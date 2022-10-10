// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Bet {

    struct Result{
        uint prize;
        bool win;
    }

    address public owner;
    address public lastWinner;
    uint public poolBalance;                                    //Winner takes all balance of the pool except the owner fee
    uint public ownerFee;
    address[] public pastAddresses;
    address[] public addressPool;                               //There are pools limited max 5 players which means; win 5x or die
    mapping(address => Result ) public allWinners;              //It registers every winner with their prize
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier properAmount {
      require(msg.value == 0.01 ether, "Please send 0.01 ether");
      _;
    }

    event Deposit(address indexed _from, uint _value);
    event Withdraw(address indexed _from, uint _value);
    event FindLucky(address indexed _from, uint _value);

    function deposit() external payable properAmount {          //deposit from wallet to contract for buying a ticket
        addressPool.push(payable(msg.sender));  
        poolBalance += msg.value;
        emit Deposit(msg.sender, msg.value);

        if(addressPool.length == 5) 
        findLucky();                                            //When 5 players join, the funct starts to find a winner 
    }
    
    function withdraw() public  {                               //Only the winner can claim the prize with this funct.
        uint _balance;
        uint _ownerFee;
        
        if(msg.sender != owner) {                               //If a participant claims for prize
            require( allWinners[msg.sender].win == true, "Game Over!");
            require( allWinners[msg.sender].prize != 0, "Already Claimed!");

            ownerFee += ( allWinners[msg.sender].prize / 100 ) * 5;
            _balance = allWinners[msg.sender].prize - (((allWinners[msg.sender].prize) / 100 ) * 5); 
            emit Withdraw(msg.sender, _balance);
            allWinners[msg.sender].prize = 0;                   //Winner's balance is updated to 0 when he claims the prize
            
            payable(msg.sender).transfer(_balance);             
        }  
        else{                                                   //The owner can call withdraw function to withdraw only the owner's fee
            require( ownerFee != 0, "Insufficient Fund");
            _ownerFee = ownerFee;
            ownerFee = 0;
            
            payable(msg.sender).transfer(_ownerFee);
        }
    }
    
    function random() private view returns(uint){
        return uint(keccak256(abi.encodePacked(owner, block.timestamp)));
    }

    function findLucky() public returns(address) {
        require(addressPool.length == 5, "Wait for other participants!");      
        lastWinner = addressPool[random()%addressPool.length];  //Winner is found randomly
        allWinners[lastWinner].prize += poolBalance;            //poolBalance mapped to winner's address to be able to claim
        allWinners[lastWinner].win = true;
        emit Deposit(msg.sender, (poolBalance / 100) * 95);

        for(uint i=0; i<addressPool.length; i++) {              //Saving addresses from the pool to pastAddresses before removing the pool
            pastAddresses.push(addressPool[i]);
        }
        delete addressPool;                                     //addresses are deleted from the pool for new participants
        poolBalance=0;                                          //pool balance resets for new a bet
        
        return lastWinner;
    }

    function viewAllAddressPool() public view returns( address[] memory){
        return addressPool;
    }
    
    function balance() external view returns(uint balanceEth) {
        balanceEth = address(this).balance;
    }
}
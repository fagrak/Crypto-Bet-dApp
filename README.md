# Bet/Lottery dApp - Crypto Bet
<p align="center">
<img align="top" width="278" alt="betApp" src="https://user-images.githubusercontent.com/63971790/229678849-ce5f5147-864b-43f2-851d-038b274d007f.PNG">
</p>
Crypto Bet is a decentralized application (dApp) built on the Ethereum Sepolia Testnet network. The app allows users to participate in a lottery-style game for a chance to win the entire pool of Ether (ETH), except for a small fee taken by the creator of the contract.

## Features

* Pool size is fixed at 5 players
* Ticket price is 0.01 ETH per ticket
* Users can purchase tickets and join the pool by clicking the "Start" button
* The app displays the current status of the pool, including contract balance, status, and last winner, when the "Update" button is clicked
* The "Deposit" button allows users to withdraw their winnings if they win the pool
* The "Claim" button allows the contract deployer to claim the fee of 0.01% of the pool's total value
* The app has a table displaying all participants of current and previous pools, including the winners

## Getting Started

To use Crypto Bet, you must have the Metamask Wallet that is compatible with the Sepolia Testnet network. Once you have the metamask wallet set up, follow these steps:

1. Go to the Crypto Bet website and connect your wallet to the dApp.
2. Click the "Start" button to purchase a ticket and join the pool.
3. Click the "Update" button to check the current status of the pool.
4. If you win the pool, click the "Claim" button to withdraw your winnings.
5. If you are the contract deployer, click the "Claim" button to claim your fee.

## How to run this project?
1) You must deploy the contract "./contract/bet.sol" on remix etc. 
2) Copy the deployed contract address and paste it to the "contract" variable in App.js
3) You can see codes and run on this link by codesandbox: https://codesandbox.io/s/bet-app-ijqy6l

## License
Crypto Bet is licensed under the MIT License. See LICENSE for more information.

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Abi from "./Abi.json";
import TxList from "./TxList";

export default function App() {
  const [contractInfo, setContractInfo] = useState({
    contractBalance: "-",
    poolBalance: "-",
    lastWinner: "-"
  });

  const [address] = useState({
    contract: "0x045DE4EFfccECab903606e9E8Ee6E6107d62280e"
    //0xD1CA129A71D27722D421F7049d7ab50D905F6bB3
  });

  const [txs, setTxs] = useState([]);

  useEffect(() => {
    if (address.contract !== "-") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const bet = new ethers.Contract(address.contract, Abi, provider);

      bet.on("Deposit", (from, amount, event) => {
        console.log({ from, amount, event });
        if (amount > 10000000000000000) {
          from = "*** WINNER *** : " + from;
        } else {
          from = "Player : " + from;
        }
        setTxs((currentTxs) => [
          ...currentTxs,
          {
            txHash: event.transactionHash,
            from,
            amount: String(amount)
          }
        ]);
      });
    }
  }, [address.contract]);

  const handleBalance = async (e) => {
    e.preventDefault();
    if (!window.ethereum) throw new Error("Install Metamask!");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const bet = new ethers.Contract(address.contract, Abi, provider);
    let contractBalance = (await bet.balance()) / 1000000000000000000 + " ETH";
    let poolBalance;
    let lastWinner;

    try {
      if ((await bet.lastWinner()) === (await signer.getAddress())) {
        lastWinner = "YOU WON!";
      } else lastWinner = await bet.lastWinner();

      if ((await bet.poolBalance()) === 0) {
        poolBalance = "Ended";
      } else
        poolBalance =
          "Waiting for " +
          (5 - (await bet.poolBalance()) / 10000000000000000) +
          " Players";
    } catch (err) {}
    setContractInfo({
      contractBalance,
      poolBalance,
      lastWinner
    });
  };

  const depositAndStart = async (e) => {
    e.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const bet = new ethers.Contract(address.contract, Abi, signer);
    await bet.deposit({ value: ethers.utils.parseUnits("0.01", "ether") });
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const bet = new ethers.Contract(address.contract, Abi, signer);
    await bet.withdraw();
  };

  return (
    <div className="m-4 credit-card w-full lg:w-2/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
      <div>
        <form className="m-4" onSubmit={handleBalance}>
          <div className="credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
            <main className="mt-4 p-4">
              <h1 className="text-xl font-semibold text-gray-700 text-center">
                Start -{">"} Wait for others -{">"} Claim if you are the winner!
              </h1>
              <h1 className="text-center">Current Ticket Price = 0.01 Ether</h1>
            </main>
            <div className="p-4">
              <button
                onClick={depositAndStart}
                type="submit"
                className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
              >
                Start
              </button>
            </div>
            <footer className="p-4">
              <button
                type="submit"
                className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
              >
                Update
              </button>
            </footer>
            <div className="px-4">
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="text-center">
                      <th>Contract Balance</th>
                      <th>Status</th>
                      <th>Last Winner</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-center">
                      <th>{String(contractInfo.contractBalance)}</th>
                      <th>{String(contractInfo.poolBalance)}</th>
                      <th>{contractInfo.lastWinner}</th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </form>
        <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
          <div className="mt-4 p-4">
            <h1 className="text-xl font-semibold text-gray-700 text-center">
              Are you the lucky or not?
            </h1>
            <form onSubmit={handleTransfer}>
              <footer className="p-4">
                <button
                  type="submit"
                  className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
                >
                  Claim
                </button>
              </footer>
            </form>
          </div>
        </div>
      </div>
      <div>
        <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
          <div className="mt-4 p-4">
            <h1 className="text-xl font-semibold text-gray-700 text-center">
              Recent participants
            </h1>
            <p>
              <TxList txs={txs} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

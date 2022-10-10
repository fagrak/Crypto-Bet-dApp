export default function TxList({ txs }) {
  if (txs.length === 0) return null;
  return (
    <>
      {txs.map((item) => (
        <div key={item.txHash} className="alert-info mt-5 rounded-xl py-2 px-4">
          <div>
            <a href={`https://goerli.etherscan.io/tx/${item.txHash}`}>
              {item.from}
            </a>
            <p>Amount: {item.amount / 1000000000000000000}</p>
          </div>
        </div>
      ))}
    </>
  );
}

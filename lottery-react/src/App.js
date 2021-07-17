import { useEffect, useState } from "react";
import lottery from "./lottery";
import web3 from "./web3";

function App() {
  const [manager, setManager] = useState(null);
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState(null);
  const [message, setMessage] = useState("");
  const [currentAccount, setCurrentAccount] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    const currentAcc = (await web3.eth.getAccounts())[0];

    setManager(manager);
    setPlayers(players);
    setBalance(balance);
    setCurrentAccount(currentAcc);
  };

  const enableEthereum = async () => {
    window.ethereum.request({ method: "eth_requestAccounts" });
    web3.eth.getAccounts().then(console.log);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("Waiting on transaction success...");
    const accounts = await web3.eth.getAccounts();

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, "ether"),
    });
    setMessage("You have been entered!");
  };

  const onClick = async (e) => {
    setMessage("Waiting on transaction success...");

    await lottery.methods.pickWinner().send({
      from: currentAccount,
    });

    setMessage("A winner has been picked!");
  };

  return (
    <div className="App" style={{ padding: "10px 30px" }}>
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager} account</p>
      <p>
        There are currently {players.length} people enter competing to win{" "}
        {web3.utils.fromWei(balance, "ether")} ether !
      </p>

      <h3 style={{ marginTop: "4rem" }}>Want to try your luck</h3>
      <form onSubmit={onSubmit}>
        <label htmlFor="" style={{ marginRight: "1rem" }}>
          Amount of ether to enter
        </label>
        <input
          type="text"
          placeholder="Enter amount of ether"
          style={{ height: "30px" }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <br />
        <button
          style={{
            padding: "10px 30px",
            fontSize: "1rem",
            backgroundColor: "#37d9ad",
            borderRadius: "3px",
            outline: "none",
            border: " none",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          Send
        </button>
      </form>

      {manager === currentAccount && (
        <div style={{ marginTop: "4rem" }}>
          <h2>Pick a winner</h2>
          <button
            onClick={onClick}
            style={{
              padding: "10px 30px",
              fontSize: "1rem",
              backgroundColor: "#37d9ad",
              borderRadius: "3px",
              outline: "none",
              border: " none",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            Pick
          </button>
        </div>
      )}

      <h1 style={{ marginTop: "4rem" }}>{message}</h1>
    </div>
  );
}

export default App;

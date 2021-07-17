const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const util = require("util");
const { interface, bytecode } = require("./compile");
const mnemonicPhrase =
  "left glue season stomach marine among special elbow coin under magic differ";

let provider = new HDWalletProvider({
  mnemonic: {
    phrase: mnemonicPhrase,
  },
  providerOrUrl:
    "https://rinkeby.infura.io/v3/efe8913cef3e4218b9f4ef26ec5d61ab",
});

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(interface)
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  console.log(util.inspect(interface, false, null, true /* enable colors */));
  console.log("Contract deployed to", result.options.address);
};

deploy();

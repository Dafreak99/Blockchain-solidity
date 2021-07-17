const fs = require("fs");
const path = require("path");
const solc = require("solc");

const lotteryPath = path.resolve(__dirname, "contracts", "Lottery.sol");
const source = fs.readFileSync(lotteryPath, "utf-8");

const input = {
  language: "Solidity",
  sources: {
    "Lottery.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const interface = output.contracts["Lottery.sol"].Lottery.abi;

// console.log(interface);

const bytecode = output.contracts["Lottery.sol"].Lottery.evm.bytecode.object;

module.exports = {
  interface,
  bytecode,
};

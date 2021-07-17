import Web3 from "web3";

const web3 = new Web3(window.web3.currentProvider);

if (typeof window.ethereum !== "undefined") {
  console.log("MetaMask is installed!");
}

export default web3;

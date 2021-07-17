const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../compile");

let accounts;
let inbox;
const INITIAL_STRING = "Hello world";

beforeEach(async () => {
  // Get a líst of all account
  accounts = await web3.eth.getAccounts();

  // Use one of those account to deploy the contract
  inbox = await new web3.eth.Contract(interface)
    .deploy({
      data: bytecode,
      arguments: [INITIAL_STRING],
    })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox", () => {
  it("deploys a contract", () => {
    assert.ok(inbox.options.address);
    // assert.strictEqual(inbox.message, "Hello world");
  });

  it("has a default message", async () => {
    const message = await inbox.methods.message().call();
    assert.strictEqual(message, INITIAL_STRING);
  });

  it("can change the message", async () => {
    await inbox.methods.setMessage("bye").send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.strictEqual(message, "bye");
  });
});

// const { use, expect } = require("chai");
const { expect } = require("chai");

const weth = require("../constants/weth");
const deploy = require("../test-helpers/deploy");

// const { solidity } = require("ethereum-waffle");
// use(solidity);

describe("Juicer", () => {
  let juicer;

  beforeEach(async () => {
    const token = await deploy("Token");
    const prices = await deploy("Prices");
    const projects = await deploy("Projects");
    const budgetStore = await deploy("BudgetStore", [prices.address]);
    const ticketStore = await deploy("TicketStore");
    juicer = await deploy("Juicer", [
      projects.address,
      budgetStore.address,
      ticketStore.address,
      weth(process.env.HARDHAT_NETWORK) || token.address,
    ]);

    await juicer.deployed();
  });

  it("Should initialize with no overflow", async () => {
    expect(await juicer.getTotalOverflow()).to.equal("0");
  });

  // describe("setPurpose()", () => {
  //   it("Should be able to set a new purpose", async () => {
  //     const newPurpose = "Test Purpose";

  //     await myContract.setPurpose(newPurpose);
  //     expect(await myContract.purpose()).to.equal(newPurpose);
  //   });
  // });
});

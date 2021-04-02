const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const weth = require("../constants/weth");
const deploy = require("../test-helpers/deploy");
const { solidity, createFixtureLoader } = require("ethereum-waffle");

use(solidity);

const MONTH = 60*60*24*30; // 30 days

describe("Juicer", () => {
  let token;
  let prices;
  let projects;
  let budgetStore;
  let ticketStore;
  let juicer;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async () => {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    token = await deploy("Token");
    prices = await deploy("Prices");
    projects = await deploy("Projects");
    budgetStore = await deploy("BudgetStore", [prices.address]);
    ticketStore = await deploy("TicketStore");
    juicer = await deploy("Juicer", [
      projects.address,
      budgetStore.address,
      ticketStore.address,
      weth(process.env.HARDHAT_NETWORK) || token.address,
    ]);
    // console.log(`Owner: ${owner.address}`);
    // console.log(`Addr1: ${addr1.address}`);
    // console.log(`Contract address: ${juicer.address}`);
    // const balance = await addr1.getBalance()
    // console.log(`Addr1 balance: ${balance}`);
    
    await juicer.deployed();
  });

  describe("Contract Deployment", function () {
    it("Should set the right owner", async function () {
      // expect(await juicer.owner()).to.equal(owner.address);
    });

    it("Should initialize with no overflow", async () => {
      expect(await juicer.getTotalOverflow()).to.equal("0");
    });
  });    

  describe("deploy()", () => {
    it("Should deploy a project", async () => {
      const projectOwner = addr1;
      const name = "Test Project";
      const handle = "TEST";
      const link = "http://test/";
      const logoURI = `${link}logo.png`;
      const target = 1000; // $1000
      const currency = 1;  // USD
      const duration = MONTH; 
      const discountRate = 1000; // 100%
      const bondingCurve = 1000; // 100%
      const reserved = 50;  // 5%

      // FIXME: Throws exception:
      // ProviderError: VM Exception while processing transaction: revert Administrated: UNAUTHORIZED
      let tx = await juicer.connect(projectOwner).deploy(
        projectOwner.address,
        name,
        handle, 
        logoURI,
        target,
        currency,
        duration,
        link,
        discountRate,
        bondingCurve,
        reserved
      );

      // Verify event
      let receipt = await tx.wait();
      const event = receipt.events.filter((x) => {return x.event == "Deploy"});
      console.log(event);

      // Verify  project
      const identifiers = await projects.getIdentifier(event.projectId);
      expect(identifiers.name, name);
      expect(identifiers.handle, handle);
      expect(identifiers.logoURI, logoURI);
      expect(identifiers.link, link);

      // Verify budgetStore
      const budget = await budgetStore.getBudget(event.budgetId /* Prop doesn't exist */);
      expect(budget.projectId, event.projectId);
      expect(budget.target, target);
      expect(identifiers.currency, currency);
      expect(identifiers.duration, duration);
      expect(identifiers.reserved, reserved);
      expect(identifiers.bondingCurve, bondingCurve);
      expect(identifiers.discountRate, discountRate);

    });
  });
});

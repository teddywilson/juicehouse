const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const weth = require("../constants/weth");
const deploy = require("../test-helpers/deploy");
const { solidity, createFixtureLoader } = require("ethereum-waffle");

use(solidity);

const MONTH = 60*60*24*30; // 30 days
const blockGasLimit = 9000000;

describe("Juicer", () => {
  let admin;
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
  
  // TODO: Running tests is slow because lots of setup must run before every test
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
    admin = await deploy("Admin", [
      juicer.address,
      "0x766621e1e1274496ab3d65badc5866024f1ab7b8",
    ]);

    // console.log(`Owner: ${owner.address}`);
    // console.log(`Addr1: ${addr1.address}`);
    // console.log(`Contract address: ${juicer.address}`);
    // const balance = await addr1.getBalance()
    // console.log(`Addr1 balance: ${balance}`);
    
    await juicer.deployed();

    // TODO: Figure out what is necessary and what isn't
    try {
      const ProjectsFactory = await ethers.getContractFactory("Projects");
      const TicketStoreFactory = await ethers.getContractFactory("TicketStore");
      const BudgetStoreFactory = await ethers.getContractFactory("BudgetStore");
      const PricesFactory = await ethers.getContractFactory("Prices");
      const AdminFactory = await ethers.getContractFactory("Admin");
      // const StakerFactory = await ethers.getContractFactory("TimelockStaker");
      const JuicerFactory = await ethers.getContractFactory("Juicer");
  
      const attachedProjects = await ProjectsFactory.attach(projects.address);
      const attachedTicketStore = await TicketStoreFactory.attach(
        ticketStore.address
      );
      const attachedBudgetStore = await BudgetStoreFactory.attach(
        budgetStore.address
      );
      const attachedPrices = await PricesFactory.attach(prices.address);
      const attachedAdmin = await AdminFactory.attach(admin.address);
      // const attachedStaker = await StakerFactory.attach(staker.address);
      const attachedJuicer = await JuicerFactory.attach(juicer.address);
  
      await attachedProjects.setOwnership(admin.address, {
        gasLimit: blockGasLimit,
      });
      await attachedTicketStore.setOwnership(admin.address, {
        gasLimit: blockGasLimit,
      });
      await attachedBudgetStore.setOwnership(admin.address, {
        gasLimit: blockGasLimit,
      });
      await attachedPrices.transferOwnership(admin.address, {
        gasLimit: blockGasLimit,
      });
      await attachedAdmin.grantAdmin(projects.address, juicer.address, {
        gasLimit: blockGasLimit,
      });
      await attachedAdmin.grantAdmin(budgetStore.address, juicer.address, {
        gasLimit: blockGasLimit,
      });
      await attachedAdmin.grantAdmin(ticketStore.address, juicer.address, {
        gasLimit: blockGasLimit,
      });
      await attachedJuicer.setAdmin(admin.address, {
        gasLimit: blockGasLimit,
      });
      // Create the admin's budget.
      await attachedJuicer.deploy(
        admin.address,
        "Juice",
        "juice",
        "https://some.jpg",
        "0x3635C9ADC5DEA00000",
        1,
        2592000,
        "https://asdf.com",
        970,
        382,
        50,
        {
          gasLimit: blockGasLimit,
        }
      );
    } catch (e) {
      console.log("Failed to establish admin contract ownership: ", e);
    }

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
      const logoUri = `${link}logo.png`;
      const target = 1000; // $1000
      const currency = 1;  // USD
      const duration = MONTH; 
      const discountRate = 1000; // 100%
      const bondingCurveRate = 1000; // 100%
      const reserved = 50;  // 5%

      let tx = await juicer.connect(projectOwner).deploy(
        projectOwner.address,
        name,
        handle, 
        logoUri,
        target,
        currency,
        duration,
        link,
        discountRate,
        bondingCurveRate,
        reserved
      );
      let receipt = await tx.wait();

      // Verify event
      const events = receipt.events.filter(x => x.event === "Deploy");
      expect(events).to.have.lengthOf(1);
      const event = events[0];
      expect(event).to.have.property('event').that.equals('Deploy');
      
      // Verify  project
      // TODO: Is there a better way to get the projectId?
      const projectId = event.args.projectId;
      const identifiers = await projects.getIdentifier(projectId);
      expect(identifiers.name).to.equal(name);
      expect(identifiers.handle).to.equal(handle);
      expect(identifiers.logoUri).to.equal(logoUri);
      expect(identifiers.link).to.equal(link);

      // Verify budgetStore
      // TODO: Is there a better way to get the budgetId?
      const budgetId = event.args.budget.id;
      const budget = await budgetStore.getBudget(budgetId);
      expect(budget.projectId).to.equal(projectId);
      expect(budget.target).to.equal(target);
      expect(budget.currency).to.equal(currency);
      expect(budget.duration).to.equal(duration);
      expect(budget.reserved).to.equal(reserved);
      expect(budget.bondingCurveRate).to.equal(bondingCurveRate);
      expect(budget.discountRate).to.equal(discountRate);

    });
  });
});

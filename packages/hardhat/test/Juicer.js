const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const {
  solidity,
  loadFixture,
  // createFixtureLoader,
} = require("ethereum-waffle");
const deployer = require("../scripts/deployer");

// Do this instead of initializing MockProvider:
// const { waffle } = require("hardhat");
// const provider = waffle.provider;

use(solidity);

const MONTH = 60 * 60 * 24 * 30; // 30 days

// let owner;
// let addr1;
// let addr2;
// let addrs;
// let contracts;

async function fixture([owner, addr1] /* , provider */) {
  // const token = await deployContract(wallet, BasicTokenMock, [
  //   wallet.address, 1000
  // ]);
  // return {token, wallet, other};
  // [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
  return {
    contracts: await deployer(),
    owner,
    addr1,
  };
}

// Deploy contracts once before running tests
// WARNING: For performance reasons, contracts are deployed only once before running
// tests. However, this does mean that state may be different for each test. Shouild
// revisit this to determine which contracts can be deployed once and which should be
// deployed before each test.
// before(async () => {
//   [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
//   contracts = await deployer();
//   // console.log(contracts.juicer);
//   Object.keys(contracts.juicer).forEach((key) => {
//     console.log(key);
//   });

//   // admin,
//   // token,
//   // prices,
//   // projects,
//   // fundingCycles,
//   // tickets,
//   // juicer,
// });

describe.skip("Juicer", () => {
  // describe.skip("Contract Deployment", function () {
  //   it("Should set the right owner", async function () {
  //     expect(await contracts.juicer.ownerOf()).to.equal(owner.address);
  //   });

  //   it("Should initialize with no overflow", async () => {
  //     expect(await contracts.juicer.getTotalOverflow()).to.equal("0");
  //   });
  // });

  describe("deploy()", () => {
    describe.only("Reverts", () => {
      it("when the provided _discountRate is < 900", async () => {
        const { contracts, owner, addr1: projectOwner } = await loadFixture(
          fixture
        );
        console.log(owner.address);
        console.log(projectOwner.address);
        // Object.keys(contracts.juicer).forEach((key) => {
        //   console.log(key);
        // });
        console.log(await contracts.juicer.balance(false));

        const name = "Test Project";
        const handle = "TEST";
        const link = "http://test/";
        const logoUri = `${link}logo.png`;
        const target = 1000; // $1000
        const currency = 1; // USD
        const duration = MONTH;
        const discountRate = 900; // 89.9%
        const bondingCurveRate = 1000; // 100%
        const reserved = 50; // 5%

        const tx = await contracts.juicer
          .connect(projectOwner)
          .deploy(
            projectOwner.address,
            name,
            handle,
            logoUri,
            link,
            target,
            currency,
            duration,
            discountRate,
            bondingCurveRate,
            reserved
          );

        // const receipt = await tx.wait();
        // console.log(receipt);
        await expect(tx.wait()).to.emit(contracts.juicer, "Deploy");

        // await expect(tx.wait()).to.be.reverted();
        // await expect(tx.wait()).to.be.revertedWith(
        //   "Uneven wei amount not allowed"
        // );
      });
      it("when the provided _discountRate is > 1000", async () => {});

      // - the provided `_bondingCurveRate` is <= 0 or > 1000.
      // - the provided `_reserved` percent is > 1000.
    });

    // it("Should deploy a project", async () => {
    //   const projectOwner = addr1;
    //   const name = "Test Project";
    //   const handle = "TEST";
    //   const link = "http://test/";
    //   const logoUri = `${link}logo.png`;
    //   const target = 1000; // $1000
    //   const currency = 1; // USD
    //   const duration = MONTH;
    //   const discountRate = 1000; // 100%
    //   const bondingCurveRate = 1000; // 100%
    //   const reserved = 50; // 5%

    //   const tx = await contracts.juicer
    //     .connect(projectOwner)
    //     .deploy(
    //       projectOwner.address,
    //       name,
    //       handle,
    //       logoUri,
    //       target,
    //       currency,
    //       duration,
    //       link,
    //       discountRate,
    //       bondingCurveRate,
    //       reserved
    //     );
    //   const receipt = await tx.wait();

    //   // Verify event
    //   const events = receipt.events.filter((x) => x.event === "Deploy");
    //   expect(events).to.have.lengthOf(1);
    //   const event = events[0];
    //   expect(event).to.have.property("event").that.equals("Deploy");

    //   // Verify  project
    //   // TODO: Is there a better way to get the projectId?
    //   const projectId = event.args.projectId;
    //   const identifiers = await contracts.projects.getIdentifier(projectId);
    //   expect(identifiers.name).to.equal(name);
    //   expect(identifiers.handle).to.equal(handle);
    //   expect(identifiers.logoUri).to.equal(logoUri);
    //   expect(identifiers.link).to.equal(link);

    //   // // Verify budgetStore
    //   // // TODO: Is there a better way to get the budgetId?
    //   // const budgetId = event.args.budget.id;
    //   // const budget = await contracts.budgetStore.getBudget(budgetId);
    //   // expect(budget.projectId).to.equal(projectId);
    //   // expect(budget.target).to.equal(target);
    //   // expect(budget.currency).to.equal(currency);
    //   // expect(budget.duration).to.equal(duration);
    //   // expect(budget.reserved).to.equal(reserved);
    //   // expect(budget.bondingCurveRate).to.equal(bondingCurveRate);
    //   // expect(budget.discountRate).to.equal(discountRate);
    // });
  });
});

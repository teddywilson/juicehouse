const {
  ethers: { constants },
} = require("hardhat");
const { expect } = require("chai");
const { call } = require("ramda");

const tests = {
  success: [
    {
      description: "should forward funds to direct payment address",
      fn: ({ deployer, addrs }) => ({
        deployer: deployer,
        caller: addrs[0],
        // below values doesnt matter
        value: 1,
      }),
    },
  ],
};

module.exports = function () {
  describe("Success cases", function () {
    tests.success.forEach(function (successTest) {
      it(successTest.description, async function () {
        const { caller, deployer, value } = successTest.fn(this);

        // Execute the transaction.
        const tx = await caller.sendTransaction({
          to: this.contract.address,
          value,
        });

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "ProxyForward")
          .withArgs(caller.address, deployer.address, value);
      });
    });
  });
};

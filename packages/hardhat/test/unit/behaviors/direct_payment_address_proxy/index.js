const shouldBehaveLike = require("./behaviors");

const contractName = "DirectPaymentAddressProxy";

module.exports = function () {
  // Before the tests, deploy mocked dependencies and the contract.
  before(async function () {
    // Deploy mock dependency contracts.
    this.terminalV1 = await this.deployMockLocalContractFn("TerminalV1");
    this.terminalDirectory = await this.deployMockLocalContractFn(
      "TerminalDirectory"
    );
    this.directPaymentAddress = await this.deployMockLocalContractFn(
      "DirectPaymentAddress"
    );

    // Deploy the contract.
    this.contract = await this.deployContractFn(contractName, [
      this.deployer.address,
    ]);
  });

  // Test each function.
  describe("receiver(...)", shouldBehaveLike.receive);
};

const shouldBehaveLike = require("./behaviors");

let snapshotId;
module.exports = function () {
  beforeEach(async function () {
    snapshotId = await this.snapshotFn();
    // Mark the start time of each test.
    await this.setTimeMarkFn();
  });
  // // Test each contract.
  describe("OperatorStore", shouldBehaveLike.operatorStore);
  describe("Prices", shouldBehaveLike.prices);
  describe("Projects", shouldBehaveLike.projects);
  describe("TerminalDirectory", shouldBehaveLike.terminalDirectory);
  describe("Governance", shouldBehaveLike.governance);
  describe("JuiceboxProject", shouldBehaveLike.JuiceboxProject);
  // Depends on TerminalDirectory.
  describe("FundingCycles", shouldBehaveLike.fundingCycles);
  // Depends on TerminalDirectory.
  describe("DirectPaymentAddress", shouldBehaveLike.directPaymentAddress);
  // Depends on DirectPaymentAddress.
  describe(
    "DirectPaymentAddressProxy",
    shouldBehaveLike.directPaymentAddressProxy
  );
  // // Depends on OperatorStore and Projects.
  describe("ModStore", shouldBehaveLike.modStore);
  // Depends on OperatorStore and Projects.
  describe("TicketBooth", shouldBehaveLike.ticketBooth);
  // Depends on everything.
  describe("TerminalV1", shouldBehaveLike.terminalV1);

  // After each test, restore the contract state.
  afterEach(async function () {
    await this.restoreFn(snapshotId);
  });
};

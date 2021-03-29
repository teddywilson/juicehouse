const { ethers } = require("hardhat");

module.exports = async (contractName, _args) => {
  const contractArgs = _args || [];
  const contractArtifacts = await ethers.getContractFactory(contractName);
  const deployed = await contractArtifacts.deploy(...contractArgs);
  // await deployed.deployed();
  await deployed.deployTransaction.wait();
  return deployed;
};

/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { l2ethers, ethers } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
const weth = require("../constants/weth");
const ethUsdPriceFeed = require("../constants/eth_usd_price_feed");
const deployer = require("./deployer");

const main = async () => {
  const wethAddr = weth(process.env.HARDHAT_NETWORK);
  const ethUsdAddr = ethUsdPriceFeed(process.env.HARDHAT_NETWORK);
  deployer(wethAddr, ethUsdAddr);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

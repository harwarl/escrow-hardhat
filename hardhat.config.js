require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.17",
  // defaultNetwork: "localhost",
  paths: {
    artifacts: "./app/src/artifacts",
  },
  networks: {
    sepolia: {
      chainId: 11155111,
      url: process.env.TEST_RPC_URL,
      accounts: [process.env.TEST_PRIVATE_KEY],
    },
  },
};

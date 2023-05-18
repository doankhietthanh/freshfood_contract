import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const INFURA_API_KEY = "ePW1u9KOntXwqMxIlLYstlx0ZiuGGPrg";

const SEPOLIA_PRIVATE_KEY =
  "0x4047f34bb5cab81fefd426c7bef7938c58ba73ef85150e5eb429662b0a33d202";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  paths: {
    artifacts: "../freshfood-fe/src/artifacts",
  },
  typechain: {
    outDir: "../freshfood-fe/src/types",
  },
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/ePW1u9KOntXwqMxIlLYstlx0ZiuGGPrg`,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
    development: {
      url: "http://localhost:8545",
      blockGasLimit: 100000000,
    },
    ganache: {
      url: `http://192.168.1.7:7545`,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
  },
};

export default config;

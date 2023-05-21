import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const INFURA_API_KEY = "ePW1u9KOntXwqMxIlLYstlx0ZiuGGPrg";

const SEPOLIA_PRIVATE_KEY =
  "844c3fcd6824f0141c87def50180af77cf7ab62289d17d16d404c8e22d9b3b79";

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
    production: {
      url: "http://128.199.235.90:8545",
      blockGasLimit: 100000000,
    },
  },
};

export default config;

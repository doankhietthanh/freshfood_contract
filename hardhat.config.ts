import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

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
      accounts: [process.env.SEPOLIA_PRIVATE_KEY || ""],
    },
    development: {
      url: "http://127.0.0.1:8545",
      blockGasLimit: 100000000,
      gas: 2100000,
      gasPrice: 8000000000,
    },
    production: {
      url: "https://eth.freshfood.lalo.com.vn",
      blockGasLimit: 100000000,
      gas: 2100000,
      gasPrice: 8000000000,
    },
    infura: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY || ""],
      blockGasLimit: 100000000,
      gas: 2100000,
      gasPrice: 8000000000,
    },
  },
};

export default config;

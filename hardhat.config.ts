import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const INFURA_API_KEY = "ePW1u9KOntXwqMxIlLYstlx0ZiuGGPrg";

const SEPOLIA_PRIVATE_KEY =
  "844c3fcd6824f0141c87def50180af77cf7ab62289d17d16d404c8e22d9b3b79";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
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
  },
};

export default config;

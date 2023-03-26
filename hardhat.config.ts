import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  paths: {
    artifacts: "../freshfood-fe/src/artifacts",
  },
  typechain: {
    outDir: "../freshfood-fe/src/types",
  },
};

export default config;

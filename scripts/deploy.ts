import { ethers } from "hardhat";

async function main() {
  const FreshFood = await ethers.getContractFactory("FreshFood");

  const freshFood = await FreshFood.deploy();

  await freshFood.deployed();

  console.log("FreshFood deployed to:", freshFood.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

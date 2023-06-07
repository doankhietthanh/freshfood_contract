import { ethers } from "hardhat";
import dayjs from "dayjs";
import axios from "axios";
import { faker } from "@faker-js/faker";

const random = (i: number) => {
  return {
    title: faker.commerce.productName(),
    date: dayjs().add(i, "day").unix(),
    description: faker.commerce.productDescription(),
    table: [
      {
        stt: 1,
        name: "temperature",
        value: Math.floor(Math.random() * 100).toString(),
      },
      {
        stt: 2,
        name: "humidity",
        value: Math.floor(Math.random() * 100).toString(),
      },
      {
        stt: 3,
        name: "light",
        value: Math.floor(Math.random() * 100).toString(),
      },
      {
        stt: 4,
        name: "soilMoisture",
        value: Math.floor(Math.random() * 100).toString(),
      },
    ],
  };
};

const randomLocation = () => {
  return {
    longitude: faker.location.longitude(),
    latitude: faker.location.latitude(),
  };
};

const wallet = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
const walletPrivateKey =
  "59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";

async function main() {
  const FreshFood = await ethers.getContractFactory("FreshFood");

  const freshFood = await FreshFood.deploy();

  await freshFood.registerOwner("FRESH FOOD 1", "phamtanminhtien@gmail.com");

  // connect to wallet
  const walletSigner = new ethers.Wallet(walletPrivateKey, ethers.provider);
  const walletContract = freshFood.connect(walletSigner);
  // register wallet
  await walletContract.registerOwner(
    "FRESH FOOD 2",
    "phamtanminhtien@gmail.com"
  );

  // create 10 products
  for (let i = 0; i < 16; i++) {
    console.log("create product", i);
    await freshFood.addProduct(
      faker.commerce.productName(),
      faker.location.streetAddress(),
      faker.image.urlLoremFlickr({
        category: "food",
      })
    );

    for (let j = 0; j < 10; j++) {
      const res = await axios.post(
        "https://be.freshfood.lalo.com.vn/object-stores",
        random(j),
        {
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            account: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
            "content-type": "application/json",
            "sec-ch-ua":
              '"Microsoft Edge";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            Referer: "http://127.0.0.1:5173/",
            "Referrer-Policy": "strict-origin-when-cross-origin",
          },
        }
      );
      const { data } = res;
      console.log("add log", i, j);
      await freshFood.addLog(
        i,
        data._id,
        data.hash,
        "",
        dayjs().add(j, "day").unix()
      );
    }

    console.log("transfer product", i);
    await freshFood.transferProduct(i, wallet);

    for (let j = 11; j < 20; j++) {
      console.log("add location", i, j);
      const location = randomLocation();
      await walletContract.addLog(
        i,
        "delivery",
        "delivery",
        location.longitude + "," + location.latitude,
        dayjs().add(j, "day").unix()
      );
    }
  }

  await freshFood.deployed();

  console.log("FreshFood deployed to:", freshFood.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

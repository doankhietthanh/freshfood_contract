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
  const centerLatitude = 10.849875407769426;
  const centerLongitude = 106.77471695504762;
  const maxRadius = 20; // In kilometers

  // Convert max radius to radians
  const r = maxRadius / 111;

  const y0 = centerLatitude;
  const x0 = centerLongitude;
  const u = Math.random();
  const v = Math.random();
  const w = r * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y1 = w * Math.sin(t);
  const x1 = x / Math.cos(y0);

  const newY = y0 + y1;
  const newX = x0 + x1;

  return {
    latitude: newY,
    longitude: newX,
  };
};

const wallet = process.env.WALLET_ADDRESS || "";
const walletPrivateKey = process.env.WALLET_PRIVATE_KEY || "";

async function main() {
  const FreshFood = await ethers.getContractFactory("FreshFood");

  const freshFood = await FreshFood.deploy();

  await freshFood.registerOwner("FRESH FOOD 1", "doankhietthanh@gmail.com");

  // connect to wallet
  const walletSigner = new ethers.Wallet(walletPrivateKey, ethers.provider);
  const walletContract = freshFood.connect(walletSigner);
  // register wallet
  await walletContract.registerOwner(
    "FRESH FOOD 2",
    "doankhietthanh@gmail.com"
  );

  // create 10 products
  for (let i = 0; i < 5; i++) {
    console.log("create product", i);
    await freshFood.addProduct(
      faker.commerce.productName(),
      faker.location.streetAddress(),
      faker.image.urlLoremFlickr({
        category: "food",
      })
    );

    for (let j = 0; j < 5; j++) {
      const res = await axios.post(
        `${process.env.SERVER}/object-stores`,
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

    for (let j = 5; j < 10; j++) {
      console.log("add location", i, j);
      const location = randomLocation();
      await walletContract.addLog(
        i,
        "delivery",
        "delivery",
        location.latitude + "," + location.longitude,
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

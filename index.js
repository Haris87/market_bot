const axios = require("axios");

const TIMEINTERVAL = 5000;

const wallet = {
  USD: 2000,
  ETH: 10,
};

const inOrders = {
  USD: 0,
  ETH: 0,
};

const orders = [];

function scanMarket() {
  let counter = 0;
  setInterval(async () => {
    printBalance(counter);
    const marketOrders = await getMarketOrders();
    checkPlacedOrders(marketOrders);
    placeNewOrders(marketOrders);

    counter++;
  }, TIMEINTERVAL);
}

function checkPlacedOrders(marketOrders) {
  // TODO: check user's placed orders to see which ones are filled
}

function placeNewOrders(marketOrders) {
  const bestAsk = getBestAsk(marketOrders);
  const bestBid = getBestBid(marketOrders);

  for (let i = 0; i < 5; i++) {
    placeBid(bestBid);
    placeAsk(bestAsk);
  }
  console.log("ORDERS", orders);
}

function placeBid(bestBid) {
  const remainingUSD = wallet.USD - inOrders.USD;
  const price = calculateRandomPriceOffset(bestBid);
  const amount = (Math.random() * remainingUSD) / price;
  orders.push([1, price, amount]);
  inOrders.USD += price * amount;
}

function placeAsk(bestAsk, remainingETH) {}

function calculateRandomPriceOffset(price) {
  return price + price * (0.1 * (0.5 - Math.random()));
}

function printBalance(counter) {
  // show balance every 30 seconds
  if (counter % 6 == 0) {
    print(wallet);
  }
}

function getBestAsk() {
  // TODO: get best ASK from market orders
}

function getBestBid(marketOrders) {
  return marketOrders
    .filter((order) => {
      return order[2] > 0;
    })
    .reduce((max, order) => {
      return Math.max(max, order[1]);
    }, 0);
}

async function getMarketOrders() {
  const url = "https://api.deversifi.com/bfx/v2/book/tETHUSD/R0";
  try {
    const response = await axios.get(url);
    console.log(response.data);
    return response.data;
  } catch (e) {
    print(e);
  }
}

function print(text) {
  console.log(text);
}

scanMarket();

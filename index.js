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

let bids = [];
let asks = [];

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

function printBalance(counter) {
  if (counter % 6 == 0) {
    print(wallet);
  }
}

function checkPlacedOrders(marketOrders) {
  const bestAsk = getBestAsk(marketOrders);
  const bestBid = getBestBid(marketOrders);

  bids = bids.filter((bid) => {
    return isBidFilled(bid, bestAsk);
  });
  console.log("");
}

function isBidFilled(bid, bestAsk) {
  if (bid[1] > bestAsk) {
    const price = bid[1];
    const amount = bid[2];
    console.log("BID FILLED@" + price);
    inOrders.USD -= amount * price;
    wallet.USD -= amount * price;
    wallet.ETH += amount;
    return false;
  } else {
    return true;
  }
}

function placeNewOrders(marketOrders) {
  const bestAsk = getBestAsk(marketOrders);
  const bestBid = getBestBid(marketOrders);

  for (let i = 0; i < 5; i++) {
    placeBid(bestBid);
    // placeAsk(bestAsk);
  }
  //   console.log("bids", bids);
  //   console.log("asks", asks);
}

function placeBid(bestBid) {
  if (bids.length < 5) {
    const remainingUSD = getAvailableUSD();
    const price = calculateRandomPriceOffset(bestBid);
    const amount = (Math.random() * remainingUSD) / price;

    bids.push([1, price, amount]);
    inOrders.USD += price * amount;
  }
}

function placeAsk(bestAsk) {
  if (asks.length < 5) {
    const remainingETH = getAvailableETH();
    const price = calculateRandomPriceOffset(bestAsk);
    //TODO: fix this
    const amount = (Math.random() * remainingETH) / price;

    asks.push([1, price, amount]);
    inOrders.ETH += price * amount;
  }
}

function calculateRandomPriceOffset(price) {
  return price + price * (0.1 * (0.5 - Math.random()));
}

function getAvailableUSD() {
  return wallet.USD - inOrders.USD;
}

function getAvailableETH() {
  return wallet.ETH - inOrders.ETH;
}

function getBestAsk(marketOrders) {
  const highestPrice = marketOrders[marketOrders.length - 1][1];
  return marketOrders
    .filter((order) => {
      return order[2] < 0;
    })
    .reduce((min, order) => {
      return Math.min(min, order[1]);
    }, highestPrice);
}

function getBestBid(marketOrders) {
  const highestPrice = marketOrders[marketOrders.length - 1][1];
  return marketOrders
    .filter((order) => {
      return order[2] > 0;
    })
    .reduce((min, order) => {
      return Math.min(min, order[1]);
    }, highestPrice);
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

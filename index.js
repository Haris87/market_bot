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
    console.log("=============");
    console.log("ETH:", wallet.ETH);
    console.log("USD:", wallet.USD);
    console.log("=============");
  }
}

function checkPlacedOrders(marketOrders) {
  const bestAsk = getBestAsk(marketOrders);
  const bestBid = getBestBid(marketOrders);

  bids = bids.filter((bid) => {
    return isBidFilled(bid, bestAsk);
  });

  asks = asks.filter((ask) => {
    return isAskFilled(ask, bestBid);
  });
}

function isBidFilled(bid, bestAsk) {
  if (bid[1] > bestAsk) {
    const price = bid[1];
    const amount = bid[2];
    inOrders.USD -= amount * price;
    wallet.USD -= amount * price;
    wallet.ETH += amount;

    console.log("BID FILLED @", price, amount);

    return false;
  } else {
    return true;
  }
}

function isAskFilled(ask, bestBid) {
  if (ask[1] < bestBid) {
    const price = ask[1];
    const amount = ask[2];
    inOrders.ETH -= amount;
    wallet.ETH -= amount;
    wallet.USD += amount * price;

    console.log("ASK FILLED @", price, amount);

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
    placeAsk(bestAsk);
  }
}

function placeBid(bestBid) {
  if (bids.length < 5) {
    const remainingUSD = getAvailableUSD();
    const price = calculateRandomPriceOffset(bestBid);
    const amount = (Math.random() * remainingUSD) / price;

    bids.push([1, price, amount]);
    inOrders.USD += price * amount;

    console.log("PLACE BID @", price, amount);
  }
}

function placeAsk(bestAsk) {
  if (asks.length < 5) {
    const remainingETH = getAvailableETH();
    const price = calculateRandomPriceOffset(bestAsk);

    const amount = Math.random() * remainingETH;
    asks.push([1, price, amount]);
    inOrders.ETH += amount;

    console.log("PLACE ASK @", price, amount);
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
    // console.log(response.data);
    return response.data;
  } catch (e) {
    console.error(e);
  }
}

scanMarket();

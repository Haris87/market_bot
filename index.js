const axios = require("axios");

const TIMEINTERVAL = 5000;

const wallet = {
  USD: 2000,
  ETH: 10,
};

const orders = [];

function scanMarket() {
  let counter = 0;
  setInterval(async () => {
    console.log("tick");
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
  // TODO: place 5 bids and 5 asks
}

function printBalance(counter) {
  // show balance every 30 seconds
  if (counter % 6 == 0) {
    console.log(wallet);
  }
}

function getBestAsk() {
  // TODO: get best ASK from market orders
}

function getBestBid() {
  // TODO: get best BID from market orders
}

async function getMarketOrders() {
  const url = "https://api.deversifi.com/bfx/v2/book/tETHUSD/R0";
  try {
    const response = await axios.get(url);
    console.log(response.data);
    return response.data;
  } catch (e) {
    console.log(e);
  }
}

scanMarket();

const axios = require("axios");
const bot = require("./bot");

const TIMEINTERVAL = 5000;

/**
 * API call to get the orderbook
 */
async function getOrderbook() {
  const url = "https://api.deversifi.com/bfx/v2/book/tETHUSD/R0";
  try {
    const response = await axios.get(url);
    // console.log(response.data);
    return response.data;
  } catch (e) {
    console.error(e);
  }
}

/**
 * Prints funds every 30sec
 * @param {*} counter
 */
function printBalance(counter) {
  const wallet = bot.getFunds();
  if (counter % 6 == 0) {
    console.log("=============");
    console.log("ETH:", wallet.ETH);
    console.log("USD:", wallet.USD);
    console.log("=============");
  }
}

/**
 * Starts the interval
 */
function start() {
  let counter = 0;
  setInterval(async () => {
    const orderbook = await getOrderbook();
    const bestAsk = bot.getBestAskPrice(orderbook);
    const bestBid = bot.getBestBidPrice(orderbook);
    printBalance(counter);
    bot.checkPlacedOrders(bestAsk, bestBid);
    bot.placeNewOrders(bestAsk, bestBid);

    counter++;
  }, TIMEINTERVAL);
}
start();

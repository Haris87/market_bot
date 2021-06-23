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

/**
 * Check which bids and asks are filled
 * @param {*} orderbook
 */
function checkPlacedOrders(bestAsk, bestBid) {
  bids = bids.filter((bid) => {
    return isBidFilled(bid, bestAsk);
  });

  asks = asks.filter((ask) => {
    return isAskFilled(ask, bestBid);
  });
}

/**
 * Checks if a bid should be filled. If yes,
 *   updates the balances.
 * @param {*} bid
 * @param {*} bestAsk
 * @returns
 */
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

/**
 * Checks if an ask should be filled. If yes,
 *   updates the balances.
 * @param {*} ask
 * @param {*} bestBid
 * @returns
 */
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

/**
 * Places new bids and asks
 * @param {*} orderbook
 */
function placeNewOrders(bestAsk, bestBid) {
  for (let i = 0; i < 5; i++) {
    placeBid(bestBid);
    placeAsk(bestAsk);
  }
}

/**
 * Places new bid, if less than 5 active bids
 * @param {*} bestBid
 */
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

/**
 * Places new ask, if less than 5 active asks
 * @param {*} bestAsk
 */
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

/**
 * Calculates price with +/-5% offset
 * @param {*} price
 * @returns
 */
function calculateRandomPriceOffset(price) {
  return price + price * (0.1 * (0.5 - Math.random()));
}

/**
 * Available USD (not already in order)
 * @returns
 */
function getAvailableUSD() {
  return wallet.USD - inOrders.USD;
}

/**
 * Available ETH (not already in order)
 * @returns
 */
function getAvailableETH() {
  return wallet.ETH - inOrders.ETH;
}

/**
 * Finds best ask price in orderbook
 * @param {*} orderbook
 * @returns
 */
function getBestAskPrice(orderbook) {
  const highestPrice = orderbook[orderbook.length - 1][1];
  return orderbook
    .filter((order) => {
      return order[2] < 0;
    })
    .reduce((min, order) => {
      return Math.min(min, order[1]);
    }, highestPrice);
}

/**
 * Finds best bid price in orderbook
 * @param {*} orderbook
 * @returns
 */
function getBestBidPrice(orderbook) {
  const highestPrice = orderbook[orderbook.length - 1][1];
  return orderbook
    .filter((order) => {
      return order[2] > 0;
    })
    .reduce((min, order) => {
      return Math.min(min, order[1]);
    }, highestPrice);
}

/**
 * Returns funds
 * @returns
 */
function getFunds() {
  return wallet;
}

module.exports = {
  placeNewOrders,
  checkPlacedOrders,
  getFunds,
  getBestAskPrice,
  getBestBidPrice,
  calculateRandomPriceOffset,
};

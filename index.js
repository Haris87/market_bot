const axios = require("axios");

async function getMarketOrders() {
  const url = "https://api.deversifi.com/bfx/v2/book/tETHUSD/R0";
  try {
    const response = await axios.get(url);
    console.log(response.data);
  } catch (e) {
    console.log(e);
  }
}

getMarketOrders();

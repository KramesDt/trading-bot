const crypto = require("crypto");
require("dotenv").config();


//Fetch price of specified symbol
async function getTickerprice(symbol) {
  try {
    const priceFetch = await fetch(
      `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
    );
    const priceBody = await priceFetch.json();
    const ticPrice = parseFloat(priceBody.price);
    console.log(ticPrice);

    return ticPrice;
  } catch (error) {
    console.log("Error fetching ticker price", error);
    throw error;
  }
}

//SPOT Trade
//Make trade based on the available params
async function makeTrade(symbol, price, action, quantity) {
  try {
    const apiKey = process.env.BINANCE_API_KEY;
    const apiSecret = process.env.BINANCE_API_SECRET;
    const endpoint = "https://api.binance.com/api/v3/sor/order";
    const timestamp = Date.now();
    const params = {
      symbol,
      side: action,
      type: "LIMIT",
      quantity,
      price,
      timestamp,
      timeInForce: "GTC",
    };

    //create query string to be appended to the URL
    let queryString = Object.keys(params).map((key) => `${key}=${encodeURIComponent(params[key])}`).join("&");
    const signature = crypto.createHmac("sha256", apiSecret)
      .update(queryString)
      .digest("hex");

    queryString += "&signature=" + signature;
    const url = endpoint + "?" + queryString;

    //
    const request = await fetch(url, {
      method: "POST",
      headers: {
        "X-MBX-APIHEY": apiKey,
        "Content-type": "application/x-www-form-urlencoded",
      },
    });
    console.log(url);

    const response = await request.json();
    return response;

  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

//Create futures trade

(async () => {
  const symbol = "BTCUSDT";
  const price = await getTickerprice(symbol);
  const action = "BUY";
  const quantity = Math.round(1 / price);
  const transaction = await makeTrade(symbol, price, action, quantity);
  console.log(transaction);
})();

require("dotenv").config();
const crypto = require("crypto");
const { create } = require("domain");

//futures order
//can be a LIMIT or MARKET order depending on specified "type" in params
//can be a BUY or SELL order depending on specified "side" in params
async function futuresOrder(symbol, side, quantity, price) {
  try {
    const apiKey = process.env.BINANCE_API_KEY;
    const apiSecret = process.env.BINANCE_API_SECRET;
    const endpoint = "https://api.binance.com/fapi/v1/order";

    const timestamp = Date.now();
    const params = {
      symbol,
      side: action,
      type,
      quantity,
      price,
      timestamp,
      timeInForce: "GTC",
    };

    const queryString = Object.keys(params)
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join("&");
    const signature = crypto
      .createHmac(sha256, apiSecret)
      .update(queryString)
      .digest("hex");
    queryString += "&sinature" + signature;

    const url = endpoint + "?" + queryString;

    const request = await fetch(url, {
      method: "POST",
      headers: {
        "X-MBX-APIHEY": apiKey,
        "Content-type": "application/x-www-form-urlencoded",
      },
    });

    const response = request.json();
    return response;
  } catch (error) {
    console.log(error, ":error");
    throw error;
  }
}

(async () => {
  const symbol = "MBLUSDT";
  const type = "LIMIT";
  const price = "0.000001";
  const action = "BUY";
  const quantity = Math.round(1 / price);
  const transaction = await futuresOrder(symbol, side, quantity, price);
  console.log(transaction);
})();

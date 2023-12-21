require("dotenv").config();
const crypto = require("node:crypto");

async function utility(endpoint, verb, param) {
  const apiKey = process.env.BYBIT_API_KEY;
  const apiSecret = process.env.BYBIT_API_SECRET;
  // let endpoint = endpoint;

  const timestamp = Date.now();
  const params = param;

  let queryString = Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join("&");
  const signature = crypto
    .createHmac("sha256", apiSecret)
    .update(queryString)
    .digest("hex");
  queryString += "&signature=" + signature;
  const url = endpoint + "?" + queryString;
  console.log(url);
  const request = await fetch(url, {
    method: verb,
    headers: {
      "X-BAPI-API-KEY": apiKey,
      "Content-type": "application/json",
      "X-BAPI-TIMESTAMP": Date.now(),
      "X-BAPI-SIGN": signature,
    },
  });
  const response = request.json();
  return response;
}

module.exports = utility;

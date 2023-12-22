require("dotenv").config();
const crypto = require("node:crypto");

async function utility(endpoint, verb, param) {
  const apiKey = process.env.BYBIT_API_KEY;
  const apiSecret = process.env.BYBIT_API_SECRET;
  // let endpoint = endpoint;

  const timestamp = Date.now().toString();
  const recvWindow = 5000;
  const params = param;

  let queryString = Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join("&");
  const signature = crypto
    .createHmac("sha256", apiSecret)
    .update(timestamp + apiKey + recvWindow + queryString)
    .digest("hex");
  // queryString += "&signature=" + signature;
  const url = endpoint + "?" + queryString;
  console.log(url);
  const request = await fetch(url, {
    method: verb,
    headers: {
      "X-BAPI-SIGN-TYPE": "2",
      "X-BAPI-SIGN": signature,
      "X-BAPI-API-KEY": apiKey,
      "X-BAPI-TIMESTAMP": timestamp,
      "X-BAPI-RECV-WINDOW": recvWindow.toString(),
      "Content-Type" : "application/json; charset=utf-8"

    },
  });
  const response = request.json();
  return response;
}

module.exports = utility;

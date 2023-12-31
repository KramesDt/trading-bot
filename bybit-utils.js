require("dotenv").config();
const crypto = require("node:crypto");

async function utility(endpoint, method, param) {
  const apiKey = process.env.BYBIT_API_KEY;
  const apiSecret = process.env.BYBIT_API_SECRET;

  const timestamp = Date.now().toString();
  const recvWindow = 5000;
  const params = param;

function getSignature(parameters, secret) {
  const keys = Object.keys(parameters).sort();
  const queryString = keys
    .map((key) => `${key}=${encodeURIComponent(parameters[key])}`)
    .join("&");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(timestamp + apiKey + recvWindow + queryString)
    .digest("hex");

  // Return both the signature and the queryString
  return { signature, queryString };
}

const { signature, queryString } = getSignature(params, apiSecret);


  // Build the request URL based on the method
  var fullendpoint;
  if (method === "POST") {
    fullendpoint = endpoint;
  } else {
    fullendpoint = endpoint + "?" + queryString;
    data = "";
  }
  console.log("Method: ", method, "fullendpoint: ", fullendpoint);

  const request = await fetch(fullendpoint, {
    method: method,
    headers: {
      "X-BAPI-SIGN-TYPE": "2",
      "X-BAPI-SIGN": signature,
      "X-BAPI-API-KEY": apiKey,
      "X-BAPI-TIMESTAMP": timestamp,
      "X-BAPI-RECV-WINDOW": recvWindow.toString(),
      "Content-Type": "application/json; charset=utf-8",
    },
    data: params,
  });
  const response = request.json();
  return response;
}

module.exports = utility;

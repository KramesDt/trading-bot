require("dotenv").config();
const crypto = require("node:crypto");
const axios = require('axios')

  async function utility(endpoint, method, param) {
  const apiKey = process.env.BYBIT_API_KEY;
  const apiSecret = process.env.BYBIT_API_SECRET;
  // let endpoint = endpoint;

  const timestamp = Date.now().toString();
  const recvWindow = 20000;
  const params = param;
  console.log("params: ", params);

  let queryString = Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join("&");
  console.log("queryString: ", queryString);

  const signature = crypto
    .createHmac("sha256", apiSecret)
    .update(timestamp + apiKey + recvWindow + queryString)
    .digest("hex");
  console.log("signature: ", signature);

  // queryString += "&signature=" + signature;
  // const url = endpoint + "?" + queryString;
  // console.log(url);

  // Build the request URL based on the method
  var fullendpoint;
  if (method === "POST") {
    fullendpoint=endpoint;
  } else {
    fullendpoint = endpoint+"?"+queryString;
    data = "";
  }
  console.log("Method: ", method, "fullendpoint: ", fullendpoint)

  var headers = {
    "X-BAPI-SIGN-TYPE": "2",
    "X-BAPI-SIGN": signature,
    "X-BAPI-API-KEY": apiKey,
    "X-BAPI-TIMESTAMP": timestamp,
    "X-BAPI-RECV-WINDOW": recvWindow.toString(),
  };

  if (method === "POST") {
    headers["Content-Type"] = "application/json; charset=utf-8";
  }

  var config = {
    method: method,
    url: fullendpoint,
    headers: headers,
    data: queryString,
  };

  console.log(method + " Calling....");
  await axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
  // const response = request.json();
  // return response;
}

module.exports = utility;

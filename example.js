const crypto = require("crypto");
const axios = require("axios");
require("dotenv").config();

url = "https://api-testnet.bybit.com";

const apiKey = process.env.BYBIT_API_KEY;
const apiSecret = process.env.BYBIT_API_KEY;
var recvWindow = 20000;
var timestamp = Date.now().toString();

function getSignature(parameters, apiSecret) {
  return crypto
    .createHmac("sha256", apiSecret)
    .update(timestamp + apiKey + recvWindow + parameters)
    .digest("hex");
}

async function utility(endpoint, method, data, Info) {
  var sign = getSignature(data, apiSecret);
  var fullendpoint;

  // Build the request URL based on the method
  if (method === "POST") {
    fullendpoint = url + endpoint;
  } else {
    fullendpoint = url + endpoint + "?" + data;
    data = "";
  }

  var headers = {
    "X-BAPI-SIGN-TYPE": "2",
    "X-BAPI-SIGN": sign,
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
    data: data,
  };

  console.log(Info + " Calling....");
  await axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
}


//Create Order
async function createOrder() {
  var orderLinkId = crypto.randomBytes(16).toString("hex");

  endpoint = "/v5/order/create";
  var data =
    '{"category":"linear","symbol": "BTCUSDT","side": "Buy","positionIdx": 0,"orderType": "Limit","qty": "0.001","price": "10000","timeInForce": "GTC","orderLinkId": "' +
    orderLinkId +
    '"}';
  await utility(endpoint, "POST", data, "Create");
}

//Get unfilled Order List
async function getAllOrders(symbol) {
  endpoint = "/v5/order/realtime";
  var data = "category=linear&settleCoin=USDT";
  await utility(endpoint, "GET", data, "Order List");
}
//Cancel order
async function cancelOrder(symbol, orderLinkId) {
  orderLinkId = crypto.randomBytes(16).toString("hex");

  endpoint = "/v5/order/cancel";
  var data =
    '{"category":"linear","symbol": "BTCUSDT","orderLinkId": "' +
    orderLinkId +
    '"}';
  await utility(endpoint, "POST", data, "Cancel");
}

//Create, List and Cancel Orders
createOrder();
getAllOrders();

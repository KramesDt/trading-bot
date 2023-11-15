const crypto = require("crypto");
const utility = require("./util");

require("dotenv").config();


//Fetch price of specified symbol
async function getTickerprice(symbol) {
  try {
    const priceFetch = await fetch(
      `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
    );
    const priceBody = await priceFetch.json();
    const ticPrice = parseFloat(priceBody.price);
    // console.log(ticPrice);

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
    const timestamp = Date.now();
    return utility("https://api.binance.com/api/v3/order", "POST",  {
      symbol,
      side: action,
      type: "LIMIT", //for market orders "price"and "timeInForce" params are not needed
      quantity,
      price,
      timestamp,
      timeInForce: "GTC",
      recvWindow: 10000
    });
  } catch (error) {
    // console.log("Error", error);
    throw error;
  }
}

async function checkBalance(){
  try {
    const apiKey = process.env.BINANCE_API_KEY;
    const apiSecret = process.env.BINANCE_API_SECRET;
    const endpoint = `https://api.binance.com/api/v3/account`;
    const timestamp = Date.now();

    const symbol = "USDT";
    const params = {
      timestamp,
    };

    let queryString = Object.keys(params)
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join("&");
    const signature = crypto
      .createHmac("sha256", apiSecret)
      .update(queryString)
      .digest("hex");
    queryString += "&signature=" + signature;
    const url = endpoint + "?" + queryString;

    const request = await fetch(url, {
      method: "GET",
      headers: {
        "X-MBX-APIKEY": apiKey,
      },
    });

    const response = await request.json();
    //Balance for a single coin
    //assign symbol variable to the queried coin
    const coinBalance = response.balances.find((balance) => balance.asset === symbol);
    console.log(coinBalance);

    //All Balances
    return response.balances;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

async function getAllOrders(symbol) {
  try {
    const apiKey = process.env.BINANCE_API_KEY;
    const apiSecret = process.env.BINANCE_API_SECRET;
    const endpoint = `https://api.binance.com/api/v3/allOrders`;
    const timestamp = Date.now();

    const params = {
      symbol,
      timestamp
    }

    let queryString = Object.keys(params).map(key=>`${key}=${encodeURIComponent(params[key])}`).join('&');
    const signature = crypto.createHmac("sha256", apiSecret).update(queryString).digest('hex');
    queryString +="&signature="+signature;
    const url = endpoint+"?"+queryString;

    const request = await fetch(url, {
      method: "GET",
      headers: {
        "X-MBX-APIKEY": apiKey,
        "Content-type": "application/x-www-form-urlencoded",
      },
    });

    const response = request.json()
    return response
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

async function deleteSpotTrade(symbol, orderId){
    try {
      const apiKey = process.env.BINANCE_API_KEY;
      const apiSecret = process.env.BINANCE_API_SECRET;
      const endpoint = `https://api.binance.com/api/v3/order`;
      const timestamp = Date.now();

      const params = {
        symbol,
        orderId,
        timestamp,
        recvWindow: 5000,
      };

      let queryString = Object.keys(params)
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
        .join("&");
      const signature = crypto
        .createHmac("sha256", apiSecret)
        .update(queryString)
        .digest("hex");

      queryString += "&signature=" + signature;
      const url = endpoint + "?" + queryString;

      //
      const request = await fetch(url, {
        method: "DELETE",
        headers: {
          "X-MBX-APIKEY": apiKey,
          "Content-type": "application/x-www-form-urlencoded",
        },
      });
      // console.log(url);

      const response = await request.json();
      return response;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
}

async function deleteAllSpotTrade(symbol) {
  try {
    const apiKey = process.env.BINANCE_API_KEY;
    const apiSecret = process.env.BINANCE_API_SECRET;
    const endpoint = `https://api.binance.com/api/v3/cancelOrders`;
    const timestamp = Date.now();

    const params = {
      symbol,
      timestamp,
      recvWindow: 5000,
    };

    let queryString = Object.keys(params)
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join("&");
    const signature = crypto
      .createHmac("sha256", apiSecret)
      .update(queryString)
      .digest("hex");

    queryString += "&signature=" + signature;
    const url = endpoint + "?" + queryString;

    //
    const request = await fetch(url, {
      method: "DELETE",
      headers: {
        "X-MBX-APIHEY": apiKey,
        "Content-type": "application/x-www-form-urlencoded",
      },
    });
    // console.log(url);

    const response = await request.json();
    return response;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

(async () => {
  const symbol = "TLMUSDT";
  // const price = await getTickerprice(symbol);
  const price = 0.08;
  const action = "SELL";
  const quantity = Math.round(5 / price);
  // const balance = await checkBalance();
  // console.log(balance)
  // const allOrders = await getAllOrders(symbol)
  // console.log(allOrders);
  const transaction = await makeTrade(symbol, price, action, quantity);
  console.log(transaction);
  // const deleteOrder = await deleteSpotTrade("TLMUSDT", 7385677);
  // console.log(deleteOrder);
})();

module.exports = {
  getTickerprice,
  makeTrade,
  checkBalance,
  deleteSpotTrade,
  deleteAllSpotTrade,
};

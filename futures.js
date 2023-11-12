require("dotenv").config();
const crypto = require("node:crypto");

const utility = require('./util')

//futures order
//can be a LIMIT or MARKET order depending on specified "type" in params
//can be a BUY or SELL order depending on specified "side" in params
async function futuresOrder(symbol, action, quantity, price) {
  try {
    const type = "LIMIT";
    const timestamp = Date.now();
    return utility("https://api.binance.com/fapi/v1/order", "POST", {
        symbol,
        side: action,
        type,
        quantity,
        price,
        timestamp,
        timeInForce: "GTC",
    });
  } catch (error) {
    console.log(error, ":error");
    throw error;
  }
}

//Check balance
async function checkFuturesBalance() {
    try {
      const timestamp = Date.now();
      return utility("https://fapi.binance.com/fapi/v2/balance", "GET",{
      timestamp,
    });

  } catch (error) {
    console.log(error, ":error");
    throw error;
  }
}

async function deleteFuturesOrder(symbol, orderId){
  try {
    const type = "";
    const timestamp = Date.now();
    return await utility("https://api.binance.com/fapi/v1/order", "DELETE", {
      symbol,
      orderId,
      timestamp,
    });
  } catch (error) {
    console.log(error, ":error");
    throw error;
  }
}

async function deleteAllFuturesOrder(symbol) {
  try {
    const type = "";
    const timestamp = Date.now();
    return await utility("https://api.binance.com/fapi/v1/order","DELETE", {
      symbol,
      timestamp,
    });
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
  const orderId = "7385677";
  const quantity = Math.round(2 / price);
  // const transaction = await futuresOrder(symbol, action, quantity, price);
  const balance = await checkFuturesBalance();
  // const deleteTransaction = await deleteFuturesOrder(symbol, orderId);
  // const deleteAllTransaction = await deleteAllFuturesOrder(symbol);

  // console.log("response is:", transaction);
  console.log("balance is:", balance);
})();


module.exports = {
  futuresOrder,
  checkFuturesBalance,
  deleteFuturesOrder,
  deleteAllFuturesOrder
}
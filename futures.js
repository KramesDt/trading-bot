require("dotenv").config();
const utility = require('./util')

//futures order
//can be a LIMIT or MARKET order depending on specified "type" in params
//can be a BUY or SELL order depending on specified "side" in params
async function futuresOrder(symbol, leverage, action, quantity, price) {
  try {
    const type = "LIMIT";
    const timestamp = Date.now();
    return utility("https://fapi.binance.com/fapi/v1/order", "POST", {
        symbol,
        leverage,
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
async function checkFuturesBalance(symbol) {
    try {
      const timestamp = Date.now();
      const recvWindow = 10000;
      return utility("https://fapi.binance.com/fapi/v2/balance", "GET",{
      symbol,
      timestamp,
      recvWindow
    });

    

  } catch (error) {
    console.log(error, ":error");
    throw error;
  }
}

async function getAllFuturesOrders() {
  try {
    const timestamp = Date.now();
    return utility("https://fapi.binance.com/fapi/v2/orders", "GET", {
      timestamp,
    });
  } catch (error) {
    console.log(error, ":error");
    throw error;
  }
}

async function deleteFuturesOrder(symbol, orderId){
  try {
    const timestamp = Date.now();
    return await utility("https://fapi.binance.com/fapi/v1/order", "DELETE", {
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
    const timestamp = Date.now();
    return await utility("https://fapi.binance.com/fapi/v1/order","DELETE", {
      symbol,
      timestamp,
    });
  } catch (error) {
    console.log(error, ":error");
    throw error;
  }
}

(async () => {
  const symbol = "LQTYUSDT";
  const leverage = 20;
  const percent = 7;//Specify the amount you want to trade with
  const type = "LIMIT";
  const price = 1.3;
  const action = "BUY";
  const orderId = "7385677";
  const quantity = Math.round(percent / price);
  // const transaction = await futuresOrder(symbol,leverage, action, quantity, price);
  // const balance = await checkFuturesBalance(symbol);
  const getOrder = await getAllFuturesOrders();

  // const deleteTransaction = await deleteFuturesOrder(symbol, orderId);
  // const deleteAllTransaction = await deleteAllFuturesOrder(symbol);

  // console.log("response is:", transaction);
  // console.log("balance is:", balance);
  console.log("order is: ", getOrder);
})();


module.exports = {
  futuresOrder,
  checkFuturesBalance,
  getAllFuturesOrders,
  deleteFuturesOrder,
  deleteAllFuturesOrder
}
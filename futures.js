require("dotenv").config();
const utility = require('./util')

//Get Symbol Info
async function getExchangeInfo(symbol) {
  const endpoint = "https://fapi.binance.com/fapi/v1/exchangeInfo";
  const response = await fetch(endpoint);
  const exchangeInfo = await response.json();

  // Check if exchangeInfo and exchangeInfo.symbols are defined
  if (!exchangeInfo || !exchangeInfo.symbols) {
    throw new Error("Failed to retrieve exchange information");
  }

  const symbolInfo = exchangeInfo.symbols.find((s) => s.symbol === symbol);
  console.log(symbolInfo)

  if (!symbolInfo) {
    throw new Error(`Symbol ${symbol} not found`);
  }

  const minOrderQty = symbolInfo.filters.find(
    (f) => f.filterType === "MIN_NOTIONAL"
  ).notional;
  return minOrderQty;
}

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

//Check balances
async function checkFuturesBalance(symbol) {
    try {
      const timestamp = Date.now();
      const recvWindow = 10000;
      const balances = await utility("https://fapi.binance.com/fapi/v2/balance", "GET",{
      symbol,
      timestamp,
      recvWindow
    });
    const assetBalance = balances.find((a)=> a.asset === "USDT")
    if (assetBalance) {
      return assetBalance && assetBalance.balance
    } else {
      return "Asset does not exist"
    }

  } catch (error) {
    console.log(error, ":error");
    throw error;
  }
}

async function getAllOpenFuturesOrders() {
  try {
    const timestamp = Date.now();
    return utility("https://fapi.binance.com/fapi/v1/openOrders", "GET", {
      timestamp,
    });
  } catch (error) {
    console.log(error, ":error");
    throw error;
  }
}

//GETs all Futures orders; ACTIVE, CANCELLED or FILLED
async function getAllFuturesOrders() {
  try {
    const timestamp = Date.now();
    return utility("https://fapi.binance.com/fapi/v1/allOrders", "GET", {
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
    return await utility("https://fapi.binance.com/fapi/v1/allOpenOrders","DELETE", {
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

  // const balance = await checkFuturesBalance(symbol);

  const leverage = 20; //Leverage on the futures
  const percent = 50; //Specify the percentage of USDT balance you want to trade with
  // const stake = parseFloat((percent / 100) * balance); //amount traded with in USDT
  const type = "LIMIT";
  const price = 1.3; //THe price you wanna trade at
  const action = "BUY";
  const orderId = 1206851765;
  // const quantity = Math.round(stake / price); //Quantity of assets futures traded

  const orderQty = await getExchangeInfo(symbol);
  // const transaction = await futuresOrder(symbol,leverage, action, quantity, price);
  // const openOrders = await getAllOpenFuturesOrders(); 
  // const getAllOrders = await getAllFuturesOrders();
  // const deleteTransaction = await deleteFuturesOrder(symbol, orderId);
  // const deleteAllTransactions = await deleteAllFuturesOrder(symbol);

  console.log("Minimun Order Notional Qty of", symbol, "is:", orderQty);
  // console.log("Futures Order:", transaction);
  // console.log("OPen Orders: ", openOrders);
  // console.log("All Orders: ", getAllOrders);
  // console.log("Balance is:", balance);
 // console.log("Successfully Deleted: ", deleteTransaction);
  // console.log("Successfully Deleted: ", deleteAllTransactions);
})();


module.exports = {
  futuresOrder,
  checkFuturesBalance,
  getAllFuturesOrders,
  deleteFuturesOrder,
  deleteAllFuturesOrder
}
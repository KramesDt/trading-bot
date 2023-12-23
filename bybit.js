require("dotenv").config();

const utility = require("./bybit-utils");

//get ticker price

async function getTickerPrice(symbol) {

  try {
    const priceFetch = await fetch(
      "https://api-testnet.bybit.com/v5/market/tickers?category=spot&symbol=BTCUSDT"
    );
  const exchangeInfo = await priceFetch.json();

  if (
    exchangeInfo.result &&
    exchangeInfo.result.list &&
    exchangeInfo.result.list.length > 0
  ) {
    const ticPrice = exchangeInfo.result.list[0].bid1Price;
    return ticPrice;
  } else {
    throw new Error("Invalid response format");
  }
  } catch (error) {
    console.log(error, ":error");
    throw error;
  }
  
}

async function getServerTime(){
  const serverTime = await fetch("https://api-testnet.bybit.com/v5/market/time");
  let serverTimeStamp = await serverTime.json();
  const timeStamp = serverTimeStamp.time;
  console.log("Server Time: ", serverTimeStamp.time);
}

//futures order
//can be a LIMIT or MARKET order depending on specified "type" in params
//can be a BUY or SELL order depending on specified "side" in params
async function futuresOrder(
  symbol,
  action,
  quantity,
  price = 0,
  marketType = "MARKET",
  leverage = "25",
  // timeInForce = "GTC"
) {
  try {
    const category = "linear";
    return marketType == "MARKET"
      ? utility("https://api-testnet.bybit.com/v5/order/create", "POST", {
          category,
          orderType: marketType,
          quantity,
          side: action,
          symbol,
        })
      : utility("https://api-testnet.bybit.com/v5/order/create", "POST", {
          category,
          orderType: marketType,
          price,
          quantity,
          side: action,
          // symbol,
          // timeInForce,
        });
  } catch (error) {
    console.log(error, ":error");
    throw error;
  }
}

//set leverage
async function setLeverage(symbol, buyLeverage){
  try {
    const category = "linear";
    return utility("https://api-testnet.bybit.com/v5/position/set-leverage", "POST", {
      category,
      symbol,
      buyLeverage
    });
  } catch (error) {
    console.log("error:", error);
    throw error
  }
}

async function getPositionInfo() {
  try {
    const timestamp = Date.now();
    return utility("https://api-testnet.bybit.com/v5/position/list", "GET", {
      timestamp,
    });
  } catch {
    console.log(error, ":error");
    throw error;
  }
}

//Check balances
async function checkFuturesBalance() {
  try {
    const balances = await utility(
      "https://api-testnet.bybit.com/v5/account/wallet-balance",
      "GET",
      {
        accountType: "UNIFIED",
      }
    );
    console.log(balances)
    // const assetBalances = balances.filter((a) => parseInt(a.coin) > 0);
    // if (assetBalances) {
    //   return {
    //     assets: assetBalances,
    //     assetBalance: assetBalances.find((asset) => asset.asset == symbol),
    //   };
    // } else {
    //   return "Asset does not exist";
    // }
  } catch (error) {
    console.log(error, ":error");
    throw error;
  }
}

async function getAllOpenFuturesOrders(symbol) {
  try {
    const category = "linear";
    return utility(
      "https://api-testnet.bybit.com/v5/order/create/v5/order/realtime",
      "GET",
      symbol
        ? {
            category,
            symbol,
          }
        : {
            category,
          }
    );
  } catch (error) {
    console.log(error, ":error");
    throw error;
  }
}

//GETs all Futures orders; ACTIVE, CANCELLED or FILLED
async function getAllFuturesOrders() {
  try {
    const category = "linear";
    return utility("https://api-testnet.bybit.com/v5/order/history", "GET", {
      category,
    });
  } catch (error) {
    console.log(error, ":error");
    throw error;
  }
}

async function deleteFuturesOrder(symbol, orderId) {
  try {
    const category = "linear";

    return await utility(
      "https://api-testnet.bybit.com/v5/order/cancel",
      "DELETE",
      {
        category,
        symbol,
        orderId
      }
    );
  } catch (error) {
    console.log(error, ":error");
    throw error;
  }
}

async function deleteAllFuturesOrder() {
  try {
    const category = "linear";
    return await utility(
      "https://api-testnet.bybit.com/v5/order/cancel-all",
      "DELETE",
      {
        category,
      }
    );
  } catch (error) {
    console.log(error, ":error");
    throw error;
  }
}

(async () => {
  const symbol = "BTCUSDT";
  const sym = await getTickerPrice(symbol);
  console.log(sym);

  const transaction = await futuresOrder(symbol, 25, "BUY", 20, 29000);
  console.log(transaction);

  // const balance = await checkFuturesBalance();
  // console.log("Balance is:", balance);

  // const openOrders = await getAllOpenFuturesOrders();
  // console.log("OPen Orders: ", openOrders);

  // const minOrdNotional = await getMiniumPerAsset(symbol); //Get minimum oder notional

  // const leverage = 20; //Leverage on the futures
  // const percent = 20; //Specify the percentage of USDT balance you want to trade with
  // const type = "LIMIT";
  // const price = 1.3; //THe price you wanna trade at

  // const stake = parseFloat((percent / 100) * balance); //amount traded with in USDT
  // const setQty = Math.round(stake / price); //Quantity of assets futures traded
  // const minQty = (price * minOrdNotional);
  // const qtyArray = [setQty, minQty];
  // const quantity = Math.max(qtyArray)
  // console.log("Quantity: ", quantity)

  const action = "BUY";
  //   const orderId = 1206851765;

  //   // const transaction = await futuresOrder(symbol,leverage, action, quantity, price);
  //   // const getAllOrders = await getAllFuturesOrders();
  //   // const deleteTransaction = await deleteFuturesOrder(symbol, orderId);
  //   // const deleteAllTransactions = await deleteAllFuturesOrder(symbol);

  //   console.log("Minimun Order Notional Qty of", symbol, "is:", orderQty);
  //   // console.log("Futures Order:", transaction);
  //   // console.log("All Orders: ", getAllOrders);
  //   // console.log("Successfully Deleted: ", deleteTransaction);
  //   // console.log("Successfully Deleted: ", deleteAllTransactions);
})();

// module.exports = {
//   futuresOrder,
//   getMiniumPerAsset,
//   checkFuturesBalance,
//   getAllOpenFuturesOrders,
//   getAllFuturesOrders,
//   deleteFuturesOrder,
//   deleteAllFuturesOrder,
//   getAllActiveFutures,
//   getFuturesRiskPNLOrders,
// };

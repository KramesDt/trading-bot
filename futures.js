const Binance = require("node-binance-api");
require("dotenv").config();

const binance = new Binance().options({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET,
});


// Place multiple futures orders
async function multipleFuturesOrders(orders) {
  try {
    const response = await binance.futuresMultipleOrders(orders);
    console.info("Orders placed successfully:", response);
  } catch (error) {
    console.error("Error placing orders:", error);
  }
}

// Place  futures limit buy
async function futuresLimitBuy(order) {
  try {
    const response = await binance.futuresBuy(order);
    console.info("Order placed successfully:", response);
  } catch (error) {
    console.error("Error placing orders:", error);
  }
}

// Place futures limit sell
async function futuresLimitSell(order) {
  try {
    const response = await binance.futuresSell(order);
    console.info("Order placed successfully:", response);
  } catch (error) {
    console.error("Error placing orders:", error);
  }
}

// Place futures market buy
async function futuresMarketBuy(order) {
  try {
    const response = await binance.futuresMarketBuy(order);
    console.info("Order placed successfully:", response);
  } catch (error) {
    console.error("Error placing orders:", error);
  }
}

// Place futures market sell
async function futuresMarketBuy(order) {
  try {
    const response = await binance.futuresMarketSell(order);
    console.info("Order placed successfully:", response);
  } catch (error) {
    console.error("Error placing orders:", error);
  }
}

// Cancel futures order
async function cancelFuturesOrder(symbol, orderId) {
  try {
    const response = await binance.cancelFuturesOrder(symbol, orderId);
    console.log("Order cancelled successfully:", response);
  } catch (error) {
    console.error("Error canceling order:", error);
  }
}

const order = {
  symbol: "BTCUSDT",
  side: "BUY",
  quantity: 0.1,
  price: 30000,
};

const orders = [
  {
    symbol: "BTCUSDT",
    side: "BUY",
    type: "MARKET",
    quantity: "0.01",
  },
  {
    symbol: "BNBUSDT",
    side: "SELL",
    type: "MARKET",
    quantity: "0.5",
  },
];

multipleFuturesOrders(orders);

// async function futuresTrade(){
//     console.info(await binance.futuresBuy("BTCUSDT", 0.1, 8222));

// }

// const assetPrice = async() =>{
//    const price = await binance.futuresPrices('BTCUSDT');
//    console.info(price);
// }

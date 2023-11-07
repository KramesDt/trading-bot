const crypto = require('crypto');
require(dotenv).config();

async function getTickerprice(symbol) {
    try {
        const priceFetch = await fetch(`https://api.binance.com/v3/ticker/price?${symbol}`);
        const priceBody = await priceFetch.json();
        return parseFloat(priceBody.price);
    } catch (error) {
        console.log("Error", error);
        throw error
    }
}

async function makeTrade(symbol, price, action, quantity) {
    try {
        const endpoint = 'https://api.binance.com/v3/ticker/order';
        const timestamp = Date.now();
        const params = {
          symbol,
          price,
          side: action,
          quantity,
          type: "LIMIT",
          timestamp,
          timeInForce: "GTC",
        };

        const queryString = Object.keys(params).map(key => `${key} = ${encodeURIComponent(params[key])}`).join('&');
        

    } catch (error) {
        console.log("Error", error);
        throw error;
    }
}

((async) => {
    const symbol = 'SHIBA';
    const price = getTickerprice(symbol);
    const action = 'BUY'
    const quantity = Math.round(1/price);
    const transaction = makeTrade(symbol,price,action,quantity);
    console.log(transaction);
})();
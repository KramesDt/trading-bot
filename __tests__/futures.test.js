const {
    futuresOrder,
    deleteFuturesOrder,
    deleteAllFuturesOrder
} = require('../futuresApi');

describe("Binance Futures Trading Functions", () => {

  test("should make a futures order", async () => {
    const symbol = "MBLUSDT";
    const price = 0.005; 
    const action = "BUY";
    const quantity = 200;

    const transaction = await futuresOrder(symbol, price, action, quantity);
    expect(transaction).toHaveProperty("orderId");
    expect(transaction).toHaveProperty("status", "FILLED");

  });

  
})
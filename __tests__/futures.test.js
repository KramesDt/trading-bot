const {
    futuresOrder,
    checkFuturesBalance,
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
    expect(transaction).toHaveProperty({status: "FILLED"});

  });

  test("should check futures balance", async () => {
    const timestamp = Date.now();

    const transaction = await deleteAllFuturesOrder();
    expect(transaction).toHaveProperty({ success: true });
  });

  test("should delete a futures order", async () => {
    const symbol = "MBLUSDT";
    const orderId = 27823873;
    

    const transaction = await deleteFuturesOrder(symbol, orderId);
    expect(transaction).toHaveProperty("orderId");
    expect(transaction).toHaveProperty({status: "CANCELLED"});
  });

  test("should delete all futures order", async () => {
    const symbol = "MBLUSDT";

    const transaction = await deleteAllFuturesOrder(symbol);
    expect(transaction).toHaveProperty({ success: true });
  });

  
})
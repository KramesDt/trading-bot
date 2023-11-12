const {
  futuresOrder,
  checkFuturesBalance,
  deleteFuturesOrder,
  deleteAllFuturesOrder,
} = require("../futures");

describe("Binance Futures Trading Functions", () => {
  test("should make a futures order", async () => {
    const symbol = "MBLUSDT";
    const price = 0.005;
    const action = "BUY";
    const quantity = 200;

    const transaction = await futuresOrder(symbol, price, action, quantity);
    expect(transaction).toHaveProperty("orderId");
    expect(transaction).toHaveProperty({ status: "NEW" });
  });

  test("should check futures balance", async () => {
    const timestamp = Date.now();
    const expectedResponse = [
      {
        asset: "USDT",
        balance: "1000",
        crossWalletBalance: "1000",
        availableBalance: "1000",
      },
      {
        asset: "BTC",
        balance: "1.5",
        crossWalletBalance: "1.5",
        availableBalance: "1.5",
      },
    ];
    const transaction = await checkFuturesBalance();
    expect(transaction).toEqual(expectedResponse);
  });

  //Delete a futures order
  test("should delete a futures order", async () => {
    const symbol = "MBLUSDT";
    const orderId = 27823873;

    const transaction = await deleteFuturesOrder(symbol, orderId);
    expect(transaction).toHaveProperty("orderId");
    expect(transaction).toHaveProperty({ status: "CANCELLED" });
  });

  //Delete all futures order
  test("should delete all futures order", async () => {
    const symbol = "MBLUSDT";

    const transaction = await deleteAllFuturesOrder(symbol);
    expect(transaction).toHaveProperty({ code: 200 });
    expect(transaction).toHaveProperty({ msg: "The operation of cancel all open order is done" });

  });
});

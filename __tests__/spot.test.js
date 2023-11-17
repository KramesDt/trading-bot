const {
  getTickerprice,
  makeTrade,
  checkBalance,
  deleteSpotTrade,
  deleteAllSpotTrade,
} = require("../spot.js");


describe("Binance Spot Trading Functions", () => {

  test("should fetch ticker price", async () => {
    const symbol = "BTCUSDT";
    const price = await getTickerprice(symbol);
    expect(typeof price).toBe("number");
  }, setTimeout=10000);

  test("should make a spot trade", async () => {
    const symbol = "MBLUSDT";
    const price = 0.005; 
    const action = "SELL";
    const quantity = 500;

    const transaction = await makeTrade(symbol, price, action, quantity);
    expect(transaction).toEqual({ orderId: 12345 });

    // expect(transaction).toHaveProperty("orderId");

  });

  test("should check balance", async () => {
    const balances = await checkBalance();
    expect(Array.isArray(balances)).toBe(true);
  }, setTimeout=10000);

  test("should delete a spot trade", async () => {
    const symbol = "TLMUSDT";
    const orderId = 7385677; // valid order ID

    const response = await deleteSpotTrade(symbol, orderId);
    expect(response).toHaveProperty({status: "CANCELLED"});
  });

  test("should delete all spot trades", async () => {
    const symbol = "BTCUSDT";

    const response = await deleteAllSpotTrade(symbol);
    expect(response).toHaveProperty({ success: true });
  });
});

const spot = require('../spot.js');
const fetchMock = require("jest-fetch-mock");



jest.setMock("node-fetch", fetchMock);
jest.mock("crypto");

const {
  getTickerprice,
  makeTrade,
  deleteSpotTrade,
  deleteAllSpotTrade,
} = require("../spot.js"); 

describe("Binance Trading Functions", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should fetch ticker price", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ price: "123.45" }));

    const symbol = "BTCUSDT";
    const price = await getTickerprice(symbol);

    expect(fetchMock).toHaveBeenCalledWith(
      `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
    );
    expect(price).toBe(123.45);
  });

  it("should make a spot trade", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ status: "FILLED" }));

    const symbol = "BTCUSDT";
    const price = 50000;
    const action = "BUY";
    const quantity = 0.002;
    const type = "LIMIT";
    const timestamp = Date.now();
    const timeInForce = "GTC"
    const response = await makeTrade(symbol, price, action, quantity);

    expect(fetchMock).toHaveBeenCalled(
      `https://api.binance.com/api/v3/sor/order/?${symbol}&${action}&${type}&${type}&${quantity}&${price}&${timestamp}&${timeInForce}`
      //https://api.binance.com/api/v3/sor/order?symbol=MBLUSDT&side=SELL&type=LIMIT&quantity=231&price=0.004329&timestamp=1699639458564&timeInForce=GTC&signature=3ed0f17116e93389503bb6574d14dbda0e7f81a67ba59316e3153d452673782a
    );
    // Add more expectations based on your specific use case
  });

  it("should delete a spot trade", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ status: "CANCELED" }));

    const symbol = "BTCUSDT";
    const orderId = "123456789";
    const response = await deleteSpotTrade(symbol, orderId);

    expect(fetchMock).toHaveBeenCalled();
    // Add more expectations based on your specific use case
  });

  it("should delete all spot trades", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ status: "ALL_CANCELED" }));

    const symbol = "BTCUSDT";
    const response = await deleteAllSpotTrade(symbol);

    expect(fetchMock).toHaveBeenCalled();
    // Add more expectations based on your specific use case
  });
});

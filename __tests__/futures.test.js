const {
  futuresOrder,
  checkFuturesBalance,
  deleteFuturesOrder,
  getMiniumPerAsset,
  deleteAllFuturesOrder, getAllFuturesOrders, getAllOpenFuturesOrders, getFuturesRiskPNLOrders
} = require("../futures");

jest.setTimeout(600000)

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


describe("Binance Futures Trading Functions", () => {
  test("should check futures balance", async () => {
    const transaction = await checkFuturesBalance("USDT");
    expect(transaction.assetBalance.asset).toEqual("USDT");
    expect(parseFloat(transaction.assetBalance.availableBalance)).toBeGreaterThan(0);
  });

  //Delete a futures order
  test("should make and close a futures order", async () => {
    const symbol = "MBLUSDT";
    const balance = await checkFuturesBalance();
    const { minOrdNotional, minNotional } = await getMiniumPerAsset(symbol); //Get minimum oder notional

    //Leverage on the futures
    const percent = 3; //Specify the percentage of USDT balance you want to trade with;
    const price = 0.0056; //THe price you wanna trade at
    const leverage = 25

    const stake = parseFloat((percent / 100) * parseFloat(balance.assetBalance.availableBalance)); //amount traded with in USDT
    const setQty = Math.round(stake / price) * leverage; //Quantity of assets futures traded
    const quantity = Math.max(parseInt(minNotional / price), setQty)
    const order = await futuresOrder(symbol, "SELL", quantity, price, "MARKET", leverage)
    expect(order.symbol).toEqual(symbol)
    expect(order).toHaveProperty("symbol");

    let openPosition = (await getFuturesRiskPNLOrders(symbol))[0]
    console.log("orderId:", symbol, openPosition);
    const transaction = await futuresOrder(symbol, parseFloat(openPosition.positionAmt) > 0 ? "SELL" : "BUY", Math.abs(+openPosition.positionAmt), "MARKET");
    await sleep(5000)
    openPosition = await getFuturesRiskPNLOrders(symbol)
    console.log(transaction, openPosition)
    expect(Array.isArray(openPosition)).toEqual(true);
    expect(+openPosition[0].positionAmt).toEqual(0);
  });

  //Delete all futures order
  test("should delete all futures order", async () => {
    const symbol = "MBLUSDT";
    const transaction = await deleteAllFuturesOrder(symbol);
    expect(transaction).toHaveProperty("code");
    expect(transaction).toHaveProperty("msg");
    expect(transaction.code).toEqual(200);
    expect(transaction.msg).toEqual("The operation of cancel all open order is done.");
  });
});

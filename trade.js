const {
  futuresOrder,
  checkFuturesBalance,
  deleteFuturesOrder,
  deleteAllFuturesOrder,
} = require("../futures");

const alertText1 =
  "STIC Tool Alert: Buy potential: BINANCE:SOLUSD, Timeframe = 5 Book a buy position (usable on all timeframe) price = 62.72, volume = 1762.81. You should possible wait for confirmation close above the flip line (yellow line) if you are late. Do not FOMO if you are late. cryptosmartanalyst.com";
const alertText2 =
  "STIC Tool Alert: Buy potential: BINANCE:SOLUSD, Timeframe = 5 Book a buy position (usable on all timeframe) price = 62.72, volume = 3602.27. You should possible wait for confirmation close above the flip line (yellow line) if you are late. Do not FOMO if you are late. cryptosmartanalyst.com";

// Function to extract details from the text
const extractDetails = (text) => {
  const details = {};

  // Extracting information using regular expressions
  const match = text.match(
    /Timeframe = (\d+) Book a buy position .* price = (\d+\.\d+), volume = (\d+\.\d+)/
  );

  if (match) {
    details.symbol = match[1];
    details.timeframe = match[2];
    details.price = match[3];
    details.volume = match[4];
  }

  return details;
};

// Save details into an array
const alerts = [
    extractDetails(alertText1), 
    extractDetails(alertText2)
];

// Display the result
console.log(alerts);

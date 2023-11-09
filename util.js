require("dotenv").config();
const crypto = require("node:crypto");

 async function utility(endpoint,verb, param) {
    const apiKey = process.env.BINANCE_API_KEY;
    const apiSecret = process.env.BINANCE_API_SECRET;
    // let endpoint = endpoint;

    const timestamp = Date.now();
    const params = param;

    const queryString = Object.keys(params)
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
        .join("&");
    const signature = crypto
        .createHmac(sha256, apiSecret)
        .update(queryString)
        .digest("hex");
    queryString += "&sinature" + signature;

    const url = endpoint + "?" + queryString;

    const request = await fetch(url, {
        method: verb,
        headers: {
            "X-MBX-APIHEY": apiKey,
            "Content-type": "application/x-www-form-urlencoded",
        },
    });

    const response = request.json();
    return response;

}



module.exports = utility; 


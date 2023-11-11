require("dotenv").config();
const crypto = require("node:crypto");

 async function utility(endpoint,verb, param) {
    const apiKey = process.env.BINANCE_API_KEY;
    const apiSecret = process.env.BINANCE_API_SECRET;
    // let endpoint = endpoint;

    const timestamp = Date.now();
    const params = param;

    let queryString = Object.keys(params)
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
        .join("&");
    const signature = crypto
        .createHmac("sha256", apiSecret)
        .update(queryString)
        .digest("hex");
    queryString += "&signature=" + signature;
    const url = endpoint + "?" + queryString;

    const request = await fetch(url, {
        method: verb,
        headers: {
            "X-MBX-APIKEY": apiKey,
            "Content-type": "application/x-www-form-urlencoded",
        },
    });

    const response = await request.json();
    return response;

}



module.exports = utility; 


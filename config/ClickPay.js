const ClickPay = (request) => {
    const crypto = require('crypto');

    const secretKey = '73cIcaHiNghP';
    const userId = "16910";
    const timestamp = new Date().getTime();
    // hash using sha1
    let hashAuth = crypto.createHash('sha1');
    hashAuth.update(`${timestamp}${secretKey}`);
    hashAuth.digest('hex');

    // return hashed sha1
    let hashedAuth = `${userId}:${hashAuth}`;

    //Creating a new invoice
    const initializePayment = (form, apiCallback) => {
        const options = {
            url: 'https://api.click.uz/v2/merchant/invoice/create',
            headers: {
                Auth: hashedAuth,
                'content-type': 'application/json',
                'cache-control': 'no-cache'
            },
            form
        }
        const callback = (error, response, body) => {
            return apiCallback(error, body)
        }
        request.post(options, callback)
    }

    return { initializePayment };
}

module.exports = ClickPay;
const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const pug = require('pug');
const _ = require('lodash');
const path = require('path');

const { Donor } = require('./models/donor')
const { initializePayment } = require('./config/ClickPay')(request);

const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public/')));

app.get('/', (req, res) => {
    res.json("Hello World");
});

app.post('/', (req, res) => {
    res.send(req.body);
});
app.post('/pay', (req, res) => {
    const form = _.pick(
        req.body,
        [
            'service_id',
            'amount',
            'phone_number',
            'merchant_trans_id',
            'full_name'
        ]);
    form.metadata = {
        full_name: form.full_name
    }
    form.amount *= 100;

    initializePayment(form, (error, body) => {
        if (error) {
            //handle errors
            console.log(error);
            return res.send(error);
        }
        response = JSON.parse(body);
        console.log(response);
        res.send(response)
    });
});


app.listen(port, () => {
    console.log(`App running on port ${port}`)
});

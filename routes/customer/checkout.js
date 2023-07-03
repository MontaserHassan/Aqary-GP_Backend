const express = require('express');


const router = express.Router();

const paypalHook = require('../../controllers/paypalHook');
const paypalApi = require('../../controllers/paypalApi');
const checkTransactionIfCompleted = require('../../controllers/checkTransactionId');
const { createProperty, createPropertyFunction } = require('../../controllers/propertyController');

router.post('/webhook', paypalHook);
router.get('/check/:id', checkTransactionIfCompleted);
router.post("/create-paypal-order", async (req, res) => {
  try {
    const payerId = req.body.userId;
    const { sku, amount } = req.body.cart[0];

    const order = await paypalApi.createOrder(payerId, amount.value, amount.currency_code, sku);
    res.json({order});
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.post("/capture-paypal-order", async (req, res) => {
  try {
    const captureData = await paypalApi.capturePayment(orderID);
    return res.json(captureData);
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err);
  }
});

module.exports = router;
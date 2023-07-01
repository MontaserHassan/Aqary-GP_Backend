const express = require('express');


const router = express.Router();

const paypalHook = require('../../controllers/paypalHook');
const paypalApi = require('../../controllers/paypalApi');
const checkTransactionIfCompleted = require('../../controllers/checkTransactionId');

router.post('/webhook', paypalHook);
router.get('/check/:id', checkTransactionIfCompleted);
router.post("/create-paypal-order", async (req, res) => {
  try {
    console.log(req.body)
    const payerId = req.body.userId;
    const { sku, amount } = req.body.cart[0];

    const order = await paypalApi.createOrder(payerId, amount.value, amount.currency_code, sku);
    res.json({order});
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.post("/capture-paypal-order", async (req, res) => {
  const { orderID } = req.body;
  try {
    const captureData = await paypalApi.capturePayment(orderID);
    res.json(captureData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
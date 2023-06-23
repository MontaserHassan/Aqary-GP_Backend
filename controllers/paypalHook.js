const paypal = require('@paypal/checkout-server-sdk');
const logger = require('../config/logger');

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

const paypalHook = async (req, res) => {
  const event = req.body;
  if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
    const captureId = event.resource.id;
    const transactionId = event.resource.purchase_units[0].payments.captures[0].id;
    const amount = event.resource.purchase_units[0].amount.value;
    const currency = event.resource.purchase_units[0].amount.currency_code;
    logger.info(`Event type: ${event.event_type}`);
    logger.info(`Transaction ID: ${transactionId}`);
    logger.info(`Amount: ${amount} ${currency}`);

    try {
      const request = new paypal.payments.CapturesGetRequest(captureId);
      const response = await client.execute(request);
      const capture = response.result;

      logger.info(`Capture status: ${capture.status}`);
      logger.info(`Capture amount: ${capture.amount.value} ${capture.amount.currency_code}`);

      res.sendStatus(200);
    } catch (err) {
      logger.error(`Error retrieving capture ${captureId}: ${err}`);
      res.sendStatus(500);
    }
  } else {
    logger.info(`Ignoring event: ${event.event_type}`);
    res.sendStatus(200);
  }
};

module.exports = paypalHook;

const paypal = require('@paypal/checkout-server-sdk');
const logger = require('../config/logger');
const axios = require('axios');
const crypto = require('crypto');

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

const paypalHook = async (req, res) => {
  const payload = JSON.stringify(req.body);
  const headers = JSON.stringify(req.headers);
  const signature = req.headers['paypal-transmission-sig'];

  // Verify the webhook signature
  const certUrl = `https://api.paypal.com/v1/notifications/certs/${signature}`;
  const response = await axios.get(certUrl);
  const cert = response.data;
  const verifier = crypto.createVerify('sha256');
  verifier.write(`${headers}\n${payload}`);
  verifier.end();
  const verified = verifier.verify(cert, Buffer.from(signature, 'base64'));

  if (!verified) {
    return res.status(400).send('Invalid signature');
  }

  const event = req.body;
  logger.info(event);
  if (event.event_type === 'PAYMENT.ORDER.CREATED') {
    const orderId = event.resource.id;
    logger.info(`Payment order created: ${orderId}`);

    try {
      const request = new paypal.orders.OrdersGetRequest(orderId);
      const order = await client.execute(request);

      if (order.result.status === 'CREATED' && order.result.intent === 'CAPTURE') {
        logger.info('Payment processed successfully');
      } else {
        logger.error(`Invalid order: ${JSON.stringify(order.result)}`);
      }

      res.sendStatus(200);
    } catch (err) {
      logger.error(`Error retrieving order:${err}`);
      res.sendStatus(500);
    }
  } else {
    logger.info(`Ignoring event: ${event.event_type}`);
    res.sendStatus(200);
  }
};

module.exports = paypalHook;
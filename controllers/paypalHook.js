const paypal = require('@paypal/checkout-server-sdk');
const logger = require('../config/logger');

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

const paypalHook = async (req, res) => {
  const event = req.body;
  logger.info(req.body);
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

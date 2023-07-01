const paypal = require('@paypal/checkout-server-sdk');
const logger = require('../config/logger');
const TransactionModel = require('../models/TransactionModel');

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

const createPendingTransaction = async (paymentId, amount) => {
  const transaction = new TransactionModel({
    paymentId,
    amount,
  });

  await transaction.save();

  console.log('transaction are seved:', transaction);
}

const paypalHook = async (req, res) => {
  const event = req.body;
  const { event_type, resource } = req.body;
  logger.info(event_type, resource.id, resource.amount, resource.currency);
  if (event_type === 'PAYMENT.CAPTURE.COMPLETED') {
    const orderId = event.resource.id;
    logger.info(`Payment order compeleted: ${orderId}`);

    try {
      await createPendingTransaction(id, resource.amount);
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

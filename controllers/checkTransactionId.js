const paypal = require('@paypal/checkout-server-sdk');

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

const checkTransactionIfCompleted = async (req, res) => {
  try {
    // Get the transaction details by transaction ID
    const transactionId = req.params.id;
    const request = new paypal.payments.CapturesGetRequest(transactionId);
    const transactionDetailsResponse = await client.execute(request);

    // Check the transaction status
    const transactionStatus = transactionDetailsResponse.result.status;
    res.json({ status: transactionStatus });
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
};

module.exports = checkTransactionIfCompleted;
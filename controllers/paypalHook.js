const paypal = require('@paypal/checkout-server-sdk');
const clientId = process.env.PAYPAL_CLIENT_ID   
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

const paypalHook = async (req, res) => {
        const event = req.body;
      
        if (event.event_type === 'PAYMENT.ORDER.CREATED') {
          const orderId = event.resource.id;
          console.log(`Payment order created: ${orderId}`);
      
          try {
            const request = new paypal.orders.OrdersGetRequest(orderId);
            const order = await client.execute(request);
      
            if (order.result.status === 'CREATED' && order.result.intent === 'CAPTURE') {
              console.log('Payment processed successfully');
            } else {
              console.error(`Invalid order: ${JSON.stringify(order.result)}`);
            }
      
            res.sendStatus(200);
          } catch (err) {
            console.error(`Error retrieving order:${err}`);
            res.sendStatus(500);
          }
        } else {
          console.log(`Ignoring event: ${event.event_type}`);
          res.sendStatus(200);
        }
}

export default paypalHook;
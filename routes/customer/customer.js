const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const webhookSecret = process.env.WEBHOOK_SECRET;

// all customer routes 
// for everyone 
router.get('/', (req, res) => {
    res.sendStatus(200);
})



router.post('/webhook', (req, res) => {
    const { event_type, resource } = req.body;
  
    switch (event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        console.log('Payment captured:', resource);
        return res.json(resource);
        break;
      case 'CHECKOUT.ORDER.COMPLETED':
        console.log('Order completed:', resource);
        return res.json(resource);
        break;
  
      default:
        console.log('Unknown event type:', event_type);
        return res.json(event_type);
    }
  });

// guest routes

// authenticated routes



// middleware for check is admin or not



module.exports = router;
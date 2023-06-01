const express = require('express');
const crypto = require('crypto');
const { default: paypalHook } = require('../../controllers/paypalHook');
const router = express.Router();
const webhookSecret = process.env.WEBHOOK_SECRET;

// all customer routes 
// for everyone 
router.get('/', (req, res) => {
    res.sendStatus(200);
})



router.post('/webhook', paypalHook);

// guest routes

// authenticated routes



// middleware for check is admin or not



module.exports = router;
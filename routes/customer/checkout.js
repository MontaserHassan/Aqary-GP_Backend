const router = require('express').Router;

const paypalHook = require('../../controllers/paypalHook');

router.post('/checkout/webhook', paypalHook);

module.exports = router;
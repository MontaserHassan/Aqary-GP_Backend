const express = require('express');


const router = express.Router();

const paypalHook = require('../../controllers/paypalHook');

router.post('/webhook', paypalHook);

module.exports = router;
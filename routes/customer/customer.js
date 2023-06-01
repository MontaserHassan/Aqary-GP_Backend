const express = require('express');
const paypalHook = require('../../controllers/paypalHook');
const haveRole = require('../../middlewares/haveRole');

const router = express.Router();

// all customer routes
// for everyone
router.get('/', haveRole('admin'), (req, res) => res.json({
  message: 'hello world!',
}));

router.post('/checkout/webhook', paypalHook);

// guest routes

// authenticated routes

// middleware for check is admin or not

module.exports = router;

const express = require('express');
const paypalHook = require('../../controllers/paypalHook');
const havePermission = require('../../middlewares/havePermission');
const roleName = require('../../middlewares/roleName');

const router = express.Router();

// all customer routes
// for everyone
router.get('/testPermission', havePermission('blockUser'), (req, res) => res.json({
  message: 'hello world!',
}));
router.get('/', roleName('admin'), (req, res) => res.json({
  message: 'hello world!',
}));

router.post('/checkout/webhook', paypalHook);

// guest routes

// authenticated routes

// middleware for check is admin or not

module.exports = router;

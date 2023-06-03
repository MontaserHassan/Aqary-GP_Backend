const express = require('express');
const propertyRoutes = require('./propertyRoutes');
const paypalHook = require('../../controllers/paypalHook');
const havePermission = require('../../middlewares/havePermission');
const roleName = require('../../middlewares/roleName');

const router = express.Router();

// all customer routes
// for everyone
// router.get('/', havePermission('blockUser'), (req, res) => res.json({
//   message: 'hello world!',
// }));

router.use('/property', propertyRoutes); // ---> route to property

router.get('/', roleName('admin'), (req, res) => res.json({
  message: 'hello world!',
}));

router.post('/checkout/webhook', paypalHook);

// authenticated routes

// middleware for check current user


module.exports = router;

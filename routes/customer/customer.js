/* eslint-disable no-multiple-empty-lines */
const express = require('express');
const propertyRoutes = require('./propertyRoutes');
const authRoutes = require('./authRoutes');
const paypalHook = require('../../controllers/paypalHook');
const havePermission = require('../../middlewares/havePermission');
const roleName = require('../../middlewares/roleName');

const router = express.Router();

// all customer routes
// for everyone
router.get('/testPermission', havePermission('blockUser'), (req, res) => res.json({
  message: 'hello world!',
}));
// router.get('/', havePermission('blockUser'), (req, res) => res.json({
//   message: 'hello world!',
// }));

router.use('/auth', authRoutes); // ---> route to property
router.use('/property', propertyRoutes); // ---> route to property

router.get('/', roleName('admin'), (req, res) => res.json({
  message: 'hello world!',
}));

router.post('/checkout/webhook', paypalHook);

// middleware for check current user


// authenticated routes
router.use('/auth/property', propertyRoutes); // ---> route to property

module.exports = router;

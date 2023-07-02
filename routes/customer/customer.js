/* eslint-disable no-multiple-empty-lines */
const express = require('express');
const authRoutes = require('./authRoute');
const propertyRoutes = require('./propertyRoutes');
const userRoutes = require("./userPropertyRoutes");
const checkoutRoutes = require('./checkout');
<<<<<<< HEAD
const transactionRoutes = require('./TransactionRoutes')
const cityRoutes = require('./cityRoute')
const havePermission = require('../../middlewares/havePermission');
const roleName = require('../../middlewares/roleName');
// const authRoute = require('./authRoute');
const router = express.Router();

// all customer routes
// for everyone
router.use('/api/v1/users', authRoutes); // ---> route to property
router.use('/property', propertyRoutes); // ---> route to property
router.use('/city', cityRoutes); // ---> route to property

router.use('/transaction', transactionRoutes); // ---> route to
// middleware for check current user
=======
const transactionRoutes = require('./TransactionRoutes');
const authController = require('./../../controllers/authController');


const router = express.Router();

>>>>>>> a5631318c4014db333765f3b31d0b2894c60a38f

router.use('/auth', authRoutes);
router.use('/property', propertyRoutes);
router.use('/transaction', transactionRoutes);

router.use(authController.protect);
router.use('/auth/property', userRoutes);
router.use('/checkout', checkoutRoutes);



module.exports = router;
/* eslint-disable no-multiple-empty-lines */
const express = require('express');
const authRoutes = require('./authRoute');
const propertyRoutes = require('./propertyRoutes');
const userRoutes = require("./userPropertyRoutes");
const checkoutRoutes = require('./checkout');
const transactionRoutes = require('./TransactionRoutes')
const cityRoutes = require('./cityRoute')
const havePermission = require('../../middlewares/havePermission');
const roleName = require('../../middlewares/roleName');
const authController = require('./../../controllers/authController');
// const authRoute = require('./authRoute');
const router = express.Router();

// all customer routes
// for everyone
router.use('/api/v1/users', authRoutes); // ---> route to property
router.use('/property', propertyRoutes); // ---> route to property
router.use('/city', cityRoutes); // ---> route to property

// middleware for check current user

router.use('/auth', authRoutes);
router.use('/city', cityRoutes);
router.use('/property', propertyRoutes);

router.use(authController.protect);
router.use('/transaction', transactionRoutes);
router.use('/auth/property', userRoutes);
router.use('/checkout', checkoutRoutes);



module.exports = router;
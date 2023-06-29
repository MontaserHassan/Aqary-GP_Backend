/* eslint-disable no-multiple-empty-lines */
const express = require('express');
const authRoutes = require('./authRoutes');
const propertyRoutes = require('./propertyRoutes');
const userRoutes = require("./userPropertyRoutes");
const checkoutRoutes = require('./checkout');
const transactionRoutes = require('./TransactionRoutes')
const havePermission = require('../../middlewares/havePermission');
const roleName = require('../../middlewares/roleName');

const router = express.Router();

// all customer routes
// for everyone
router.use('/auth', authRoutes); // ---> route to property
router.use('/property', propertyRoutes); // ---> route to property
router.use('/transaction', transactionRoutes); // ---> route to
// middleware for check current user


// authenticated routes
router.use('/auth/property', userRoutes); // ---> route to property
router.use('/checkout', checkoutRoutes); // --

module.exports = router;
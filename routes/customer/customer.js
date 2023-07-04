/* eslint-disable no-multiple-empty-lines */
const express = require('express');
const authRoutes = require('./authRoute');
const propertyRoutes = require('./propertyRoutes');
const userRoutes = require("./userPropertyRoutes");
const checkoutRoutes = require('./checkout');
const transactionRoutes = require('./TransactionRoutes')
const walletRoutes = require('./walletRoute')
const cityRoutes = require('./cityRoute')
const authController = require('./../../controllers/authController');
const router = express.Router();


router.use('/auth', authRoutes);
router.use('/city', cityRoutes);
router.use('/property', propertyRoutes);
router.use('/wallet', walletRoutes);



// router.use(authController.protect);
router.use('/transaction', transactionRoutes);
router.use('/auth/property', userRoutes);
router.use('/checkout', checkoutRoutes);



module.exports = router;
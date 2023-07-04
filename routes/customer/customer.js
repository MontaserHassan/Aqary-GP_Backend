/* eslint-disable no-multiple-empty-lines */
const express = require('express');
const authRoutes = require('./authRoute');
const userRoutes = require('./userRoutes');
const categoryRoutes = require('./categoryRoutes');
const propertyRoutes = require('./propertyRoutes');
const userPropertyRoutes = require("./userPropertyRoutes");
const checkoutRoutes = require('./checkout');
const transactionRoutes = require('./TransactionRoutes')
const walletRoutes = require('./walletRoute')
const cityRoutes = require('./cityRoute')
const authController = require('./../../controllers/authController');
const router = express.Router();


router.use('/auth', authRoutes);
router.use('/city', cityRoutes);
router.use('/categories', categoryRoutes);
router.use('/property', propertyRoutes);
router.use('/wallet', walletRoutes);

router.use(authController.protect);
router.use('/auth/user', userRoutes);
router.use('/transaction', transactionRoutes);
router.use('/auth/property', userPropertyRoutes);
router.use('/checkout', checkoutRoutes);



module.exports = router;
/* eslint-disable no-multiple-empty-lines */
const express = require('express');
const userController = require('./../../controllers/userController');
const authRoutes = require('./authRoute');
const propertyRoutes = require('./propertyRoutes');
const userRoutes = require("./userPropertyRoutes");
const checkoutRoutes = require('./checkout');
const transactionRoutes = require('./TransactionRoutes')
const havePermission = require('../../middlewares/havePermission');
const roleName = require('../../middlewares/roleName');

// const authRoute = require('./authRoute');
const router = express.Router();


router.use('/api/v1/users', authRoutes);
router.use('/property', propertyRoutes);
router.use('/transaction', transactionRoutes);

// middleware for check current user ---> omarHesham

router.use('/auth/property', userRoutes);
router.use('/checkout', checkoutRoutes);

//Get all users
// router.use('/api/v1/users', userController.getAllUsers)



module.exports = router;
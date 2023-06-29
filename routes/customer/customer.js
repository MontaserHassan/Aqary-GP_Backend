/* eslint-disable no-multiple-empty-lines */
const express = require('express');
const userController = require('./../../controllers/userController');
const authRoutes = require('./authRoute');
const propertyRoutes = require('./propertyRoutes');
const userRoutes = require("./userPropertyRoutes");
const checkoutRoutes = require('./checkout');
const havePermission = require('../../middlewares/havePermission');
const roleName = require('../../middlewares/roleName');
// const authRoute = require('./authRoute');
const router = express.Router();

// all customer routes
// for everyone
router.use('/api/v1/users', authRoutes); // ---> route to property
router.use('/property', propertyRoutes); // ---> route to property
// middleware for check current user


// authenticated routes
router.use('/auth/property', userRoutes); // ---> route to property
router.use('/checkout', checkoutRoutes); // --

// router.use('/api/v1/users', userController.getAllUsers)


module.exports = router;
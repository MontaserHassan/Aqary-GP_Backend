/* eslint-disable no-multiple-empty-lines */
const express = require('express');
const propertyRoutes = require('./propertyRoutes');
const authRoutes = require('./authRoutes');
const checkoutRoutes = require('./checkout');
const havePermission = require('../../middlewares/havePermission');
const roleName = require('../../middlewares/roleName');

const router = express.Router();

// all customer routes
// for everyone
router.use('/auth', authRoutes); // ---> route to property
router.use('/property', propertyRoutes); // ---> route to property
router.use('checkout', checkoutRoutes); // --
// middleware for check current user


// authenticated routes
router.use('/auth/property', propertyRoutes); // ---> route to property

module.exports = router;

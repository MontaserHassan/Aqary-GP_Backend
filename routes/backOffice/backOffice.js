/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable quotes */
const express = require("express");
const propertyRoutes = require("./propertyRoutes");




const router = express.Router();

// middleware for check is admin or not

// all admin routes
router.use('/property', propertyRoutes); // ---> route to property



module.exports = router;

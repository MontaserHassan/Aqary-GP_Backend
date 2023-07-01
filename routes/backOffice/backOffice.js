/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable quotes */
const express = require("express");
const propertyRoutes = require("./propertyRoutes");
const dashboardRoutes = require("./dashboardRoutes");




const router = express.Router();

// middleware for check is admin or not

router.use('/properties', propertyRoutes);
router.use('/dashboard', dashboardRoutes);



module.exports = router;

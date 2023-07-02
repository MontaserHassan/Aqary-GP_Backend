/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable quotes */
const express = require("express");
const propertyRoutes = require("./propertyRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const roleName = require('../../middlewares/roleName');




const router = express.Router();

// middleware for check is admin or not

router.use('/properties', roleName('Admin'), propertyRoutes);
router.use('/dashboard', roleName('Admin'), dashboardRoutes);



module.exports = router;

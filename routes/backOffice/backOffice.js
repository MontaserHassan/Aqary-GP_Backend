/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable quotes */
const express = require("express");
const propertyRoutes = require("./propertyRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const categoryRoutes = require("./categoryRoutes");
const roleName = require('../../middlewares/roleName');
const authController = require('./../../controllers/authController');
const { isAdmin } = require("../../controllers/Admin");


const router = express.Router();


router.use(authController.protect);
router.get('/isadmin', roleName('Admin'), isAdmin);
router.use('/categories', roleName('Admin'), categoryRoutes);
router.use('/properties', roleName('Admin'), propertyRoutes);
router.use('/dashboard', roleName('Admin'), dashboardRoutes);



module.exports = router;
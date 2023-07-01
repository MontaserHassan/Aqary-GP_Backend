/* eslint-disable eol-last */
/* eslint-disable import/extensions */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable quotes */
const express = require("express");
const propertyController = require('../../controllers/propertyController.js');
const { validation, propertyValidator } = require("../../validation/validation.js");
const authController = require('./../../controllers/authController');


const router = express.Router();


router.get("/", authController.protect,propertyController.getAllProperties);
router.get("/:id", validation(propertyValidator.idParams), propertyController.getProperty);
router.get("/search/:city", validation(propertyValidator.searching), propertyController.searchOnProperty);



module.exports = router;
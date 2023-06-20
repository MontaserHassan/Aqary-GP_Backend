/* eslint-disable eol-last */
/* eslint-disable import/extensions */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable quotes */
const express = require("express");
const { validation, propertyValidator } = require("../../validation/validation.js");
const propertyController = require('../../controllers/propertyController.js');


const router = express.Router();


router.get("/", propertyController.getAllProperties);
router.get("/:id", validation(propertyValidator.idParams), propertyController.getProperty);
router.delete("/:id", propertyController.deleteProperty);



module.exports = router;
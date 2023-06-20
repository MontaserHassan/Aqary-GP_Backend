/* eslint-disable eol-last */
/* eslint-disable import/extensions */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable quotes */
const express = require("express");
const propertyController = require('../../controllers/propertyController.js');
const { validation, propertyValidator } = require("../../validation/validation.js");
const { propertyFileParser } = require('../../middlewares/fileParser');


const router = express.Router();


// middleware for authenticate current user

router.use(propertyFileParser);
router.post("/", validation(propertyValidator.createProperty), propertyController.createProperty);
router.patch("/:id", validation(propertyValidator.updateProperty), propertyController.editProperty);
router.delete("/:id", propertyController.deleteProperty);



module.exports = router;
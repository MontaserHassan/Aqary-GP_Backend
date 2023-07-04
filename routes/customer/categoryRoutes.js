/* eslint-disable eol-last */
/* eslint-disable import/extensions */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable quotes */
const express = require("express");
const categoryController = require('../../controllers/categoryController');
const { validation, propertyValidator } = require("../../validation/validation.js");


const router = express.Router();


router.get("/", categoryController.getAllCategories);
router.get("/:id", validation(propertyValidator.idParams), categoryController.getCategoryById);



module.exports = router;
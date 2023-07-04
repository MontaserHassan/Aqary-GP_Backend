const express = require("express");
const { validation, categoryValidation } = require("../../validation/validation.js");
const categoryController = require('../../controllers/categoryController');


const router = express.Router();

router.post("/", validation(categoryValidation.createCategory), categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.get("/:categoryId", validation(categoryValidation.getCategoryById), categoryController.getCategoryById);
router.get("/:categoryId/properties", validation(categoryValidation.getPropertiesByCategoryId), categoryController.getPropertiesByCategoryId)
router.delete("/:categoryId", validation(categoryValidation.deleteCategory), categoryController.deleteCategory);
router.patch("/:categoryId", validation(categoryValidation.updateCategory), categoryController.updateCategory);



module.exports = router;
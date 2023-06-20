const express = require("express");
const propertyController = require('../../controllers/propertyController.js');
const { validation, propertyValidator } = require("../../validation/validation.js");
const { propertyFileParser } = require('../../middlewares/fileParser');


const router = express.Router();


router.use(propertyFileParser); // --> middleware for handle images
router.get("/", propertyController.getAllProperties);
router.get("/:id", propertyController.getProperty);


// middleware for authenticate current user


router.post("/", validation(propertyValidator.createProperty), propertyController.createProperty);
router.patch("/:id", validation(propertyValidator.updateProperty), propertyController.editProperty);
router.delete("/:id", propertyController.deleteProperty);



module.exports = router;
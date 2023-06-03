const express = require("express");
const propertyController = require('../../controllers/propertyController.js');
const { validation, propertyValidator } = require("../../validation/validation.js");
const { propertyFileParser } = require('../../middlewares/fileParser');


const router = express.Router();


router.use(propertyFileParser); // --> middleware for handle images
router.get("/property", propertyController.getAllProperties);
router.get("/property/:id", propertyController.getProperty);


// middleware for authenticate current user


router.post("/property", validation(propertyValidator.createProperty), propertyController.createProperty);
router.patch("/property/:id", propertyController.editProperty);
router.delete("/property/:id", propertyController.deleteProperty);



module.exports = router;
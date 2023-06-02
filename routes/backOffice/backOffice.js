const express = require("express");

const propertyController = require("../../controllers/property");

const router = express.Router();

// middleware for check is admin or not

// all admin routes

router.post("/property", propertyController.addProperty);
router.get("/property", propertyController.getAllProperties);
router.get("/property/:id", propertyController.getProperty);
router.get('/property/update/:id', propertyController.editProperty);
module.exports = router;

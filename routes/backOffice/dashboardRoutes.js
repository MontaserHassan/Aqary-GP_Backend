const express = require("express");
const { validation, propertyValidator } = require("../../validation/validation.js");
const AdminStatistics = require('../../controllers/Admin.js');


const router = express.Router();


router.get("/", AdminStatistics);



module.exports = router;
const express = require("express");
const {statistics, getCountPropertiesForEachCity} = require('../../controllers/Admin.js');


const router = express.Router();


router.get("/statistics", statistics);
router.get("/main-graph", getCountPropertiesForEachCity);



module.exports = router;
const express = require('express');
const cityController = require('../../controllers/cityController');
const router = express.Router();


router.post('/insert', cityController.insertCities);
router.get('/getCities', cityController.getCities);

module.exports = router;
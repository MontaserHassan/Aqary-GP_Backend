const express = require('express');
const { fileParser } = require('../middlewares/fileParser');
const { errorHandler } = require('../middlewares/errorMW');
const { handleNotFound } = require('../controllers');
const backOffice = require('./backOffice/backOffice');
const customer = require('./customer/customer');


const router = express.Router();


router.use(fileParser); // --> middleware for handle images 
router.use('/backOffice', backOffice);
router.use('/', customer);
router.all('*', handleNotFound);
router.use(errorHandler); // --> middleware for handle errors



module.exports = router;
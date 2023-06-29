const express = require('express');
const globalErrorHandler = require('./../controllers/errorController');
const { errorHandler } = require('../middlewares/errorMW');
const { handleNotFound } = require('../controllers');
const backOffice = require('./backOffice/backOffice');
const customer = require('./customer/customer');

const router = express.Router();

router.use('/backOffice', backOffice);
router.use('/', customer);
router.all('*', handleNotFound);
router.use(globalErrorHandler);
router.use(errorHandler); // --> middleware for handle errors

module.exports = router;

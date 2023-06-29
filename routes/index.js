const express = require('express');
const AppError = require('../utils/appError');
const globalErrorHandler = require('./../controllers/errorController');
const { errorHandler } = require('../middlewares/errorMW');
const { handleNotFound } = require('../controllers');
const backOffice = require('./backOffice/backOffice');
const customer = require('./customer/customer');

const router = express.Router();

router.use('/backOffice', backOffice);
router.use('/', customer);
// router.all('*', handleNotFound);
router.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
router.use(globalErrorHandler);
router.use(errorHandler); // --> middleware for handle errors

module.exports = router;

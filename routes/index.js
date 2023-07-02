const express = require('express');
const { errorHandler } = require('../middlewares/errorMW');
const { handleNotFound } = require('../controllers');
const backOffice = require('./backOffice/backOffice');
const customer = require('./customer/customer');


const router = express.Router();


router.use('/backOffice', backOffice);
router.use('/', customer);
router.all('*', handleNotFound);
router.use(errorHandler);


module.exports = router;
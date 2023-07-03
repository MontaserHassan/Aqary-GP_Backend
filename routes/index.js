const express = require('express');
const { errorHandler } = require('../middlewares/errorMW');
const { handleNotFound } = require('../controllers');
const backOffice = require('./backOffice/backOffice');
const customer = require('./customer/customer');


const router = express.Router();


router.use('/', customer);
router.use('/backOffice', backOffice);
router.all('*', handleNotFound);
router.use(errorHandler);


module.exports = router;
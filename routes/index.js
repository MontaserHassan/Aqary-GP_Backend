const express = require('express');
// const AppError = require('../utils/appError');
// const globalErrorHandler = require('./../controllers/errorController');
const { errorHandler } = require('../middlewares/errorMW');
const { handleNotFound } = require('../controllers');
const backOffice = require('./backOffice/backOffice');
const customer = require('./customer/customer');

const router = express.Router();
/**
 * @swagger
 * /admin/statistics:
 *   get:
 *     summary: Get statistics for the application
 *     responses:
 *       200:
 *         description: Returns the statistics for the application
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: integer
 *                   description: Number of registered users
 *                 properties:
 *                   type: integer
 *                   description: Number of properties in the application
 *                 transactions:
 *                   type: integer
 *                   description: Number of transactions in the application
 */
router.use('/backOffice', backOffice);
router.use('/', customer);
// router.all('*', handleNotFound);
// router.all('*', (req, res, next) => {
//     next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });
// router.use(globalErrorHandler);
router.use(errorHandler); // --> middleware for handle errors

module.exports = router;

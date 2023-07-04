const express = require("express");
const {statistics, getCountPropertiesForEachCity, getPropertyTable, getAmountForUserAndCount} = require('../../controllers/Admin.js');


const router = express.Router();

/**
 * @swagger
 * /dashboard/statistics:
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
 * /dashboard/main-graph:
 *   get:
 *     summary: Get count of properties for each city for the application

 */

router.get("/statistics", statistics);
router.get("/properties", getPropertyTable);
router.get("/subscriptions", getAmountForUserAndCount);
router.get("/main-graph", getCountPropertiesForEachCity);



module.exports = router;
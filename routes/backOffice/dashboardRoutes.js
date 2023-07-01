const express = require("express");
const { validation, propertyValidator } = require("../../validation/validation.js");
const {statistics, getCountPropertiesForEachCity} = require('../../controllers/Admin.js');


const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: admin-statistics
 *   description: admin statistics
 * /statistics:
 *   get:
 *     summary: get array of statistics for the site
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: get array of statistics for the site.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 * /main-graph:
 *   get:
 *     summary: get array of main graph for the site
 *     tags: [main-graph]
 *     responses:
 *       200:
 *         description: get array of main graph for the site.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 *
 */

router.get("/statistics", statistics);
router.get("/main-graph", getCountPropertiesForEachCity);



module.exports = router;
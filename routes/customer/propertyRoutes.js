/* eslint-disable eol-last */
/* eslint-disable import/extensions */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable quotes */
const express = require("express");
const propertyController = require('../../controllers/propertyController.js');
const { validation, propertyValidator } = require("../../validation/validation.js");



const router = express.Router();


/**
 * @swagger
 * /property:
 *   get:
 *     summary: Get all properties
 *     description: Use this endpoint to retrieve all properties.
 *     responses:
 *       200:
 *         description: Successfully retrieved properties.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */

/**
 * @swagger
 * /property/{id}:
 *   get:
 *     summary: Get a property by ID
 *     description: Use this endpoint to retrieve a property by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the property to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the property.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Property not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message indicating that the property was not found.
 */

/**
 * @swagger
 * /property/search/{city}:
 *   get:
 *     summary: Search properties by city
 *     description: Use this endpoint to search for properties by city.
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: The city to search for properties.
 *     responses:
 *       200:
 *         description: Successfully retrieved the properties.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */

router.get("/", propertyController.getAllProperties);
router.get("/:id", validation(propertyValidator.idParams), propertyController.getProperty);
router.get("/filter/:min/:max", propertyController.filterPropertiesByPrice);
router.get("/search/:city", validation(propertyValidator.searching), propertyController.searchOnProperty);



module.exports = router;
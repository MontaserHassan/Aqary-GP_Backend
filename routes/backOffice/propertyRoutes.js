/* eslint-disable eol-last */
/* eslint-disable import/extensions */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable quotes */
const express = require("express");
const { validation, propertyValidator } = require("../../validation/validation.js");
const propertyController = require('../../controllers/propertyController.js');


const router = express.Router();


/**
 * @swagger
 * /backOffice/properties:
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
 * /backOffice/properties/{id}:
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
 *   delete:
 *     summary: Delete a property
 *     description: Use this endpoint to delete a property by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the property to delete.
 *     responses:
 *       204:
 *         description: Successfully deleted the property.
 */


router.get("/", propertyController.getAllProperties);
router.get("/:id", validation(propertyValidator.idParams), propertyController.getProperty);
router.delete("/:id", propertyController.deleteProperty);



module.exports = router;
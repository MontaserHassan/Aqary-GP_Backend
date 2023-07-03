/* eslint-disable import/extensions */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { initializeCache } = require('./helpers/cache');
require('dotenv').config();
const { limiter } = require('./config/security.js');
require('./config/database.js');
const bodyParser = require('body-parser');
const { specs, swaggerUi } = require('./config/swagger.js');
const app = express();



// initializeCache
initializeCache();

// configuration
app.use(express.static('public'));
app.use(cors());

// Apply the rate limiting middleware to all requests
app.use(limiter);

// previent extended fields and set limit
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
app.use(express.json({ extended: false, limit: '1mb' }));
app.use(bodyParser.json());
// header security
app.use(helmet());
app.use(helmet.xssFilter());
app.use(helmet.hidePoweredBy('aqary tech.'));


// routes
app.use(require('./routes'));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));


module.exports = app;

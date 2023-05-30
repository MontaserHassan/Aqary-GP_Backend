const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const { limiter } = require('./config/security.js');
require('./config/database.js');

const app = express();

// configuration
app.use(express.static('public'));
app.use(cors());



// Apply the rate limiting middleware to all requests
app.use(limiter)

// previent extended fields and set limit
app.use(express.urlencoded({ extended: false, limit: "1mb" }));
app.use(express.json({ extended: false, limit: "1mb" }));

// header security
app.use(helmet());
app.use(helmet.xssFilter());
app.use(helmet.hidePoweredBy('aqary tech.'));



// routes
app.use(require('./routes'));

module.exports = app;
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const rateLimit = require('express-rate-limit')

const app = express();

// configuration
app.use(express.static('public'));
app.use(cors());

// limit requests per hour
const limiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 100,
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter)


// previent extended fields and set limit
app.use(express.urlencoded({ extended: false, limit: "1kb" }));
app.use(express.json({ extended: false, limit: "1kb" }));

// header security
app.use(helmet());
app.use(helmet.xssFilter());
app.use(helmet.hidePoweredBy('aqary tech.'));
require('./config/database.js');


// routes
app.use(require('./routes'));

module.exports = app;
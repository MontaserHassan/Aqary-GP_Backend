const express = require('express');
const cors = require('cors');
const routes = require('./routes');
require('dotenv').config();


const app = express();

// configuration
app.use(express.static('public'));
app.use(cors());
app.use(express.json());
require('./config/database.js');


// routes
app.use(routes);

module.exports = app;
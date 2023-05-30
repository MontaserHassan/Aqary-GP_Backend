const mongoClient = require('mongoose');
const logger = require('./logger');
require('dotenv').config();
const { MONGO_URL } = process.env;

mongoClient.connect(MONGO_URL)
    .then(() => logger.info('Connected to database'))
    .catch(error => console.log('Error connecting to database', error));

module.exports = mongoClient;
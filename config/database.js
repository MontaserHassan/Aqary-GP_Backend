const mongoClient = require('mongoose');
require('dotenv').config();
const { MONGO_URL } = process.env;

mongoClient.connect(MONGO_URL)
    .then(() => console.log('Connected to database'))
    .catch(error => console.log('Error connecting to database', error));

module.exports = mongoClient;
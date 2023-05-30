const express = require('express');
const cors = require('cors');
const routes = require('./routes');
require('dotenv').config();


const app = express();

const PORT = process.env.PORT || 4000;

// configuration
app.use(express.static('public'));
app.use(cors());
app.use(express.json());
require('./config/database.js');


// routes
app.use(routes);

app.listen(PORT, () => console.log(`Example app listening on port http://localhost:${PORT}`) );
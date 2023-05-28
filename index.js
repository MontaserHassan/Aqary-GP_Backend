const express = require('express');
const mongoClient = require('mongoose');
const cors = require('cors');
const routes = require('./routes');
require('dotenv').config();


const app = express();

const { MONGO_URL } = process.env;
const PORT = process.env.PORT || 4000;

/// to use cors to connect between front and back
app.use(cors());
app.use(express.json());
app.use(routes);

mongoClient.connect(MONGO_URL)
    .then(() => console.log('Connected to database'))
    .catch(error => console.log('Error connecting to database', error));

app.get('/', (req, res) => {
  console.log('connected');
  res.json({ project: 'Real State' });
});

app.listen(PORT, () => console.log(`Example app listening on port http://localhost:${PORT}`) );
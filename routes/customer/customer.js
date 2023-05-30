const express = require('express');


const router = express.Router();



// all customer routes 
// for everyone 
router.get('/', (req, res) => {
    res.sendStatus(200);
})

// guest routes

// authenticated routes



// middleware for check is admin or not



module.exports = router;
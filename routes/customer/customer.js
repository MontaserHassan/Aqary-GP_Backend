const express = require('express');


const router = express.Router();



// all customer routes 
// for everyone 
router.get('/', (req, res) => {
    res.sendStatus(200);
})
router.get('/checkout', (req, res) => {
    console.log(req.params)
    console.log(req.body)
    console.log(req.query)
})

// guest routes

// authenticated routes



// middleware for check is admin or not



module.exports = router;
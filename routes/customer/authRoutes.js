/* eslint-disable eol-last */
/* eslint-disable no-multiple-empty-lines */
const express = require('express');
const authController = require('./../controllers/authController');


const router = express.Router();


router.post('/login');
router.post('/singup', authController.signup);


module.exports = router;
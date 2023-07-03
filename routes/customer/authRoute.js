/* eslint-disable eol-last */
/* eslint-disable no-multiple-empty-lines */
const express = require('express');
const authController = require('../../controllers/authController');


const router = express.Router();


router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/user', authController.protect, authController.userInfo);


module.exports = router;
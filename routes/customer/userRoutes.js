/* eslint-disable eol-last */
/* eslint-disable no-multiple-empty-lines */
const express = require('express');
const authController = require('../../controllers/authController');
const userController = require('./../../controllers/userController');


const router = express.Router();


router.post('/userInfo', authController.protect, authController.userInfo);
router.patch('/updateUserInfo', authController.protect, userController.updateUserInfo);



module.exports = router;
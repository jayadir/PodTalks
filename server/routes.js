const express = require('express');
const router = express.Router();
const authController = require('./controllers/authController');
router.post('/sendotp', authController.sendOtp);
module.exports = router;
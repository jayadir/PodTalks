const express = require('express');
const router = express.Router();
const authController = require('./controllers/authController');
router.post('/sendotp', authController.sendOtp);
router.post('/verifyotp', authController.verifyOtp);
module.exports = router;
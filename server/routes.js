const express = require('express');
const router = express.Router();
const authController = require('./controllers/authController');
const authMiddleware = require('./middlewares/authMiddleware');
router.post('/sendotp', authController.sendOtp);
router.post('/verifyotp', authController.verifyOtp);
router.patch('/updateUsername',authMiddleware.verifyReq, authController.updateUsername);
router.get("/refreshTokens",authController.regenerateToken)
module.exports = router;
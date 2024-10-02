const express = require('express');
const router = express.Router();
const authController = require('./controllers/authController');
const authMiddleware = require('./middlewares/authMiddleware');
const roomController = require('./controllers/roomController');
router.post('/sendotp', authController.sendOtp);
router.post('/verifyotp', authController.verifyOtp);
router.patch('/updateUsername',authMiddleware.verifyReq, authController.updateUsername);
router.get("/refreshTokens",authController.regenerateToken)
router.get("/logout",authMiddleware.verifyReq,authController.logout)
router.post('/rooms/create', authMiddleware.verifyReq, roomController.createRoom);
router.get("/getAllRooms",authMiddleware.verifyReq,roomController.getRooms)
router.get("/room/:roomId",authMiddleware.verifyReq,roomController.getRoom)
module.exports = router;
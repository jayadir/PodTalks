const crypto = require("crypto");
const hash = require("../services/hashing");
const User=require('../models/userModel');
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const number = process.env.TWILIO_PHONE_NUMBER;
const client = require("twilio")(accountSid, authToken, { lazyLoading: true });
class Otp {
  async getOtp() {
    return crypto.randomInt(1000, 9999);
  }
  async sendOtp(phone, otp) {
    client.messages
      .create({
        body: `Your OTP is ${otp}`,
        from: number,
        to: phone,
      })
      .then((message) => console.log(message.sid));
  }
}
const otpService = new Otp();
exports.sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      return res.status(400).json({ message: "Mobile number is required" });
    }
    const otp = await otpService.getOtp();
    const time = 20 * 60 * 1000;
    const expiry = Date.now() + time;
    const data = {
      mobile,
      otp,
      expiry,
    };
    const strdata = JSON.stringify(data);
    const hashdata = hash.hashData(strdata);
    await otpService.sendOtp(mobile, otp);
    res.status(200).json({ hashdata, expiry, mobile});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.verifyOtp = async (req, res) => {
  try {
    const {mobile, otp, hashdata,expiry} = req.body;
    if (!mobile || !otp || !hashdata || !expiry) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if(Date.now() > expiry){
      return res.status(400).json({ message: "OTP already expired" });
    }
    const strdata = JSON.stringify({ mobile, otp, expiry });
    const check = hash.verifyHash(strdata, hashdata);
    if(!check){
      return res.status(400).json({ message: "Invalid OTP" });
    }
    const user=await User.findOne({phone:mobile});
    if(!user){
      const newUser=await User.create({
        phone:mobile
      })
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
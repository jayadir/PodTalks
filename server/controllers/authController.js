const crypto = require("crypto");
const hash = require("../services/hashing");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const number = process.env.TWILIO_PHONE_NUMBER;
const jwtaccess = process.env.JWT_ACCESS_SECRET_STRING;
const jwtrefresh = process.env.JWT_REFRESH_SECRET_STRING;
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

class jwtService {
  async generateAccessToken(payload) {
    const accessTkn = jwt.sign(payload, jwtaccess, { expiresIn: "1h" });
    const refreshTkn = jwt.sign(payload, jwtrefresh, { expiresIn: "1y" });
    return { accessTkn, refreshTkn };
  }
}
const jwtServiceObj = new jwtService();
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
    res.status(200).json({ hashdata, expiry, mobile });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, otp, hashdata, expiry } = req.body;
    if (!mobile || !otp || !hashdata || !expiry) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (Date.now() > expiry) {
      return res.status(400).json({ message: "OTP already expired" });
    }
    const strdata = JSON.stringify({ mobile, otp, expiry });
    const check = hash.verifyHash(strdata, hashdata);
    if (!check) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    let user = await User.findOne({ phone: mobile });
    if (!user) {
      user = await User.create({
        phone: mobile,
      });
    }
    const { accessTkn, refreshTkn } = await jwtServiceObj.generateAccessToken({
      _id:user._id,
      activated:false,
      phone: mobile,
    });
    res.cookie("refreshTkn", refreshTkn, {
      httpOnly: true,
      // secure:true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ accessTkn });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

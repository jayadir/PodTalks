const crypto = require("crypto");
const hash = require("../services/hashing");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const jwtServiceObj = require("../services/jwtservice");
const refreshTknModel = require("../models/refreshTknModel");
const userDto = require("../DataTransferobjs/userDto");
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
    // await otpService.sendOtp(mobile, otp);
    res.status(200).json({ hashdata, expiry, mobile, otp });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, otp, hashdata, expiry, name } = req.body;
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
        name,
        phone: mobile,
      });
    }
    const userdt = new userDto(user);
    const { accessTkn, refreshTkn } = await jwtServiceObj.generateAccessToken({
      _id: user._id,
      activated: false,
      phone: mobile,
    });
    res.cookie("refreshTkn", refreshTkn, {
      httpOnly: true,
      // secure:true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
      // sameSite: "None",
    });
    res.cookie("accessTkn", accessTkn, {
      httpOnly: true,
      // secure:true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
      // sameSite: "None",
    });
    await refreshTknModel.create({
      refreshToken: refreshTkn,
      userId: user._id,
    });
    res.status(200).json({ accessTkn, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUsername = async (req, res) => {
  try {
    const { username, mobile } = req.body;
    if (!username) {
      return res.status(400).json({ message: "username is required" });
    }
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "username already exists" });
    }
    console.log(mobile);
    user = await User.findOne({ phone: mobile });
    console.log(user);
    user.username = username;
    user.activated = true;
    await user.save();
    res.status(200).json({ message: "username updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.regenerateToken = async (req, res) => {
  try {
    const { refreshTkn } = req.cookies;
    if (!refreshTkn) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = await jwtServiceObj.verifyRefreshToken(refreshTkn);
    const data = await refreshTknModel.findOne({ refreshToken: refreshTkn });
    if (!data) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findOne({ _id: data.userId });
    if (!user) {
      return res.status(404).json({ message: "no user found" });
    }
    // console.log(user);
    const { accessTkn:newAccessTkn, refreshTkn:newRefreshTkn } =
    
      await jwtServiceObj.generateAccessToken({
        _id: user._id,
      });
      // console.log(newAccessTkn,newRefreshTkn);
    res.cookie("refreshTkn", newRefreshTkn, {
      httpOnly: true,
      // secure:true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
      // sameSite: "None",
    });
    res.cookie("accessTkn", newAccessTkn, {
      httpOnly: true,
      // secure:true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
      // sameSite: "None",
    });
    try {
      await refreshTknModel.findOneAndUpdate(
        { refreshToken: refreshTkn },
        { refreshToken: newRefreshTkn }
      );
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
    const userdt = new userDto(user);
    res.status(200).json({auth:true,user:userdt});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout=async (req,res)=>{
  try {
    await refreshTknModel.findOneAndDelete({refreshToken:req.cookies.refreshTkn});
    res.clearCookie("refreshTkn");
    res.clearCookie("accessTkn");
    res.status(200).json({message:"logout success"})
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}
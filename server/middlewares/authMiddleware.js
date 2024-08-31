const jwtServiceObj=require('../services/jwtservice')
const { TokenExpiredError } = require('jsonwebtoken');
exports.verifyReq = async (req, res, next) => {
  try {
    const { accessTkn,refreshTkn } = req.cookies;
    // console.log(accessTkn);
    if(!accessTkn){
      return res.status(401).json({message:"Unauthorized"})
    }
    const decoded=await jwtServiceObj.verifyToken(accessTkn)
    console.log(decoded)
    next()
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(500).json({ message: error.message });
  }
};

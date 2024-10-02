const jwt = require("jsonwebtoken");
const jwtaccess = process.env.JWT_ACCESS_SECRET_STRING;
const jwtrefresh = process.env.JWT_REFRESH_SECRET_STRING;
class jwtService {
  async generateAccessToken(payload) {
    const accessTkn = jwt.sign(payload, jwtaccess, { expiresIn: "1h" });
    const refreshTkn = jwt.sign(payload, jwtrefresh, { expiresIn: "1y" });
    return { accessTkn, refreshTkn };
  }
  async verifyToken(token){
    return await jwt.verify(token,jwtaccess)
  }
  async verifyRefreshToken(token){
    return await jwt.verify(token,jwtrefresh)
  }
}
const jwtServiceObj = new jwtService();
module.exports = jwtServiceObj;

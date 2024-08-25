const crypto = require("crypto");
const { model } = require("mongoose");
class hash {
  hashData(data) {
    return crypto
      .createHash("sha256", process.env.SECRET_STRING)
      .update(data)
      .digest("hex");
  }
  verifyHash(data, hash) {
    return (
      crypto
        .createHash("sha256", process.env.SECRET_STRING)
        .update(data)
        .digest("hex") === hash
    );
  }
}
module.exports = new hash();

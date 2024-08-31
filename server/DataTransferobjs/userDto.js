class userDto {
  constructor(user) {
    this._id=user._id||"";
    this.mobile = user.mobile || "";
    this.username = user.username || "";
    this.activated =user.activated||false; 
    this.createdAt =user.createdAt||new Date();
  }
}
module.exports = userDto;
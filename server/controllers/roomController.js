const Room = require("../models/roomModel");
exports.createRoom = async (req, res) => {
  const { title, type } = req.body;
  // console.log(req.)
  if (!title) {
    return res.status(400).json({ error: "Please enter a title for the room" });
  }
  try {
    const resp = await Room.create({
      topic: title,
      roomAccess: type,
      userId: req.body.userId,
      speakers: [req.body.userId],
    });
    console.log(res);
    res.status(201).json({
      message: "Room created successfully",
      roomDetails: {
        id: resp._id,
        topic: resp.topic,
        roomAccess: resp.roomAccess,
        host: resp.userId,
        speakers: resp.speakers,
        createdAt: resp.createdAt,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error in creating room" });
  }
};

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ roomAccess: { $in: ["Open", "Public"] } }).populate("speakers").populate("userId").exec();
    res.status(200).json({ rooms });
  } catch (error) {
    res.status(500).json({ error: "Internal server error in getting rooms" });
  }
};

exports.getRoom=async (req,res)=>{
  try {
    const {roomId}=req.params
    const data=await Room.find({_id:roomId}).populate("speakers").populate("userId").exec()
    res.status(200).json({data})
  } catch (error) {
    res.status(500).json({ error: "Internal server error in getting room details" });
  }
}
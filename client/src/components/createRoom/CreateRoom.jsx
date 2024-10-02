import React, { useState } from "react";
import "./createRoom.css";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function CreateRoom({ toggleCreateRoom }) {
  const navigate=useNavigate()
  const { user } = useSelector((state) => state.user);
  const [roomType, setRoomType] = useState("Open");
  const [title, setTitle] = useState("");
  const handleSubmit =async  (e) => {
    if (title === "") {
      return alert("Please enter a title for the room");
    }
    e.preventDefault();
    console.log(title, roomType);
    try {
      const res = await axios.post(process.env.REACT_APP_API_URL+"apiv1/rooms/create", {
        title,
        type: roomType,
        userId: user._id,
      },{withCredentials:true});
      console.log("res");
      console.log(res);
      if(res.status===201){
        navigate(`/room/${res.data.roomDetails.id}`)
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card create-room-card">
        <div className="card-body">
          <button className="close-button" onClick={toggleCreateRoom}>
            ×
          </button>
          <h5 className="card-title">Create Room</h5>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="roomTitle">Room Title</label>
              <input
                type="text"
                className="form-control translucent-input"
                id="roomTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter room title"
              />
            </div>
            <div className="form-group">
              <label htmlFor="roomType">Room Type</label>
              <select
                className="form-control translucent-input"
                id="roomType"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
              >
                <option>Open</option>
                <option>Public</option>
                <option>Private</option>
              </select>
            </div>
            <button type="submit" className="btn btn-light create-room-button">
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

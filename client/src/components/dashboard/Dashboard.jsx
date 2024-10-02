import React, { useEffect, useState } from "react";
import "./dashboard.css";
import Room from "../Room/Room";
import axios from "axios";
import CreateRoom from "../createRoom/CreateRoom";
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
  const navigate=useNavigate()
  const [createRoom, setCreateRoom] = useState(false);
  const [rooms, setRooms] = useState([]);
  const toggleCreateRoom = () => {
    setCreateRoom(!createRoom);
  };
  useEffect(() => {
    async function getRooms() {
      try {
        const data = await axios.get(
          process.env.REACT_APP_API_URL + "apiv1/getAllRooms",
          { withCredentials: true }
        );
        setRooms(data.data.rooms);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }
    getRooms();
  }, []);
  // const rooms = [
  //   {
  //     roomId: "1",
  //     topic: "JavaScript Best Practices",
  //     speakers: [
  //       { userId: "101", name: "Alice" },
  //       { userId: "102", name: "Bob" },
  //     ],
  //     totalParticipants: 50,
  //   },
  //   {
  //     roomId: "2",
  //     topic: "Introduction to React",
  //     speakers: [
  //       { userId: "103", name: "Charlie" },
  //       { userId: "104", name: "David" },
  //     ],
  //     totalParticipants: 75,
  //   },
  //   {
  //     roomId: "3",
  //     topic: "Advanced Node.js",
  //     speakers: [
  //       { userId: "105", name: "Eve" },
  //       { userId: "106", name: "Frank" },
  //     ],
  //     totalParticipants: 60,
  //   },
  //   {
  //     roomId: "4",
  //     topic: "CSS Grid and Flexbox",
  //     speakers: [
  //       { userId: "107", name: "Grace" },
  //       { userId: "108", name: "Heidi" },
  //     ],
  //     totalParticipants: 40,
  //   },
  // ];

  return !createRoom ? (
    <div>
      <div className="container">
        <div className="header">
          <div className="headerLeft">
            <h3>Dashboard</h3>
            <div className="search">
              <img src="/images/search.png" alt="search" />
              <input type="text" placeholder="Search" />
            </div>
          </div>
          <div className="headerRight">
            <button onClick={toggleCreateRoom}>Create Room</button>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          {rooms.map((room) => (
            <div key={room._id} className="col-md-3 mb-4" onClick={()=>navigate(`/room/${room._id}`)}>
              <Room details={room} />
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <CreateRoom handleCreateRoom={toggleCreateRoom} />
  );
}

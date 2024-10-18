import React from "react";
import "./room.css"; // Ensure the correct path to your CSS file

export default function Room({ details }) {
  return (
    <div className="room-card card mb-4">
      <div className="card-body">
        <h2 className="room-title card-title">{details.topic}</h2>
        <div className="room-speakers d-flex flex-wrap mb-3">
          {details.speakers.map((speaker) => (
            <div key={speaker.userId} className="speaker badge badge-primary mr-2 mb-2">
              {speaker.name}
            </div>
          ))}
        </div>
        {/* <div className="room-participants">
          Participants: {details.totalParticipants}
        </div> */}
      </div>
    </div>
  );
}
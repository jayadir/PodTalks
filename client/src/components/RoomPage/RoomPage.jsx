import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useConnections } from "../../customHooks/useConnections";
import { useSelector } from "react-redux";
import style from "./roompage.module.css";
import axios from "axios";
export default function RoomPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { user } = useSelector((state) => state.user);
  const { connections: participants, provideRef,handleMute } = useConnections(
    roomId,
    user
  );
  const [showRaiseHand, setShowRaiseHand] = useState(false);
  const [speaking, setSpeaking] = useState({});
  const [roomData, setRoomData] = useState();
  const [isMuted, setIsMuted] = useState(true);
  const handleGoBack = () => {
    navigate("/dashboard");
  };
  const handleChangeMute=(userId)=>{
    if(userId!==user._id) return
    setIsMuted(prev=>!prev)
  }
  useEffect(()=>{
    handleMute(isMuted,user)
  },[isMuted])
  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}apiv1/room/${roomId}`,
        {
          withCredentials: true,
        }
      );
      // console.log("response",response);
      // console.log(response.data);
      setRoomData(response.data.data[0]);
      console.log(response.data.data[0]);
    }
    fetchData();
  }, [roomId]);

  return (
    <div className={style.roomPage}>
      <div className={style.leftSide}>
        <img src="/images/mic-icon.webp" alt="Mic" className={style.micImage} />
      </div>
      <div className={style.rightSide}>
        <button className={style.backButton} onClick={handleGoBack}>
          ← Back
        </button>
        <div className={style.roomTitle}>{roomData?.topic}</div>
        <div className={style.participants}>
          {participants?.map((participant) => (
            <div
              key={participant.id}
              className={`${style.participant} ${
                speaking[participant.id] ? style.speaking : ""
              }`}
            >
              <div>
                {showRaiseHand && (
                  <button
                    className={style.raiseHandButton}
                    onClick={() => {
                      console.log("Raise hand");
                    }}
                  >
                    ✋
                  </button>
                )}
              </div>
              <audio
                autoPlay
                ref={(instance) => {
                  provideRef(instance, participant.id);
                  // detectSpeaking(instance, participant.id);
                }}
              ></audio>
              <div className={style.userAvatar}>
                <strong>{participant.username.charAt(0)}</strong>
                <div className={style.mic} onClick={()=>handleChangeMute(participant._id)}>
                  {participant.isMuted?(<img
                    src="/images/mute.png"
                    className={style.muteimg}
                    alt="mute"
                  />):(<img src="/images/unmute.png" className={style.muteimg} alt="unmute" />)}
                </div>
              </div>
              {participant.name || participant.username}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

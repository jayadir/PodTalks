import { useCallback, useEffect, useRef } from "react";
import { useStateCallback } from "./useStateCallback";
import socket from "../sockets";
import freeice from "freeice";

// const clients = [
//   {
//     id: 1,
//     username: "John Doe",
//   },
// ];

export const useConnections = (roomId, user) => {
  const [connections, setConnections] = useStateCallback([]);
  const audioMap = useRef({});
  const localStream = useRef(null);
  const availableConnections = useRef({});
  const socRef = useRef(null);
  const participantRef = useRef(connections);
  const handleMute = (isMuted, user) => {
    let interval = setInterval(() => {
      if (localStream.current) {
        localStream.current.getTracks()[0].enabled = !isMuted;
        if(isMuted){
          socRef.current.emit("user-muted", { roomId, user });
        }
        else{
          socRef.current.emit("user-unmuted", { roomId, user });
        }
        clearInterval(interval);
      }
    }, 500);
  };
  const provideRef = (instance, id) => {
    audioMap.current[id] = instance;
  };

  const addConnection = useCallback(
    (client, callback) => {
      console.log(connections);

      setConnections((prev) => {
        const connectionExists = prev.some(
          (connection) => connection._id === client._id
        );

        console.log("Adding connection:", client, "Exists:", connectionExists);

        if (connectionExists) return prev;

        const newConnections = [...prev, client];
        console.log("New connections state:", newConnections);
        return newConnections;
      }, callback);
    },
    [setConnections]
  );

  useEffect(() => {
    socRef.current = socket();
  }, []);

  useEffect(() => {
    async function captureAudio() {
      localStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    }

    captureAudio().then(() => {
      addConnection({ ...user, isMuted: true }, () => {
        const localAudio = audioMap.current[user.id];
        if (!localAudio) return;
        localAudio.volume = 0;
        localAudio.srcObject = localStream.current;

        // Use WebSocket
        socRef.current.emit("join-room", { roomId, user });
      });
    });

    return () => {
      localStream.current?.getTracks().forEach((track) => {
        track.stop();
      });
      socRef.current.emit("user-disconnected", { roomId, user });
    };
  }, [addConnection, user, roomId]);

  useEffect(() => {
    socRef.current.on(
      "user-connected",
      async ({ socketId, user, createOffer }) => {
        console.log("User connected:", user);
        console.log("Socket ID:", socketId);

        if (socketId in availableConnections.current) {
          console.log("User already connected:", user);
        }
        availableConnections.current[socketId] = new RTCPeerConnection({
          iceServers: freeice(),
        });

        availableConnections.current[socketId].onicecandidate = (e) => {
          if (e.candidate) {
            socRef.current.emit("ice_info", {
              roomId,
              socketId,
              ice: e.candidate,
            });
          }
        };

        availableConnections.current[socketId].ontrack = (e) => {
          addConnection({ ...user, isMuted: true }, () => {
            const remoteAudio = audioMap.current[user.id];
            if (remoteAudio) {
              remoteAudio.srcObject = e.streams[0];
            } else {
              const interval = setInterval(() => {
                const remoteAudio = audioMap.current[user.id];
                if (remoteAudio) {
                  remoteAudio.srcObject = e.streams[0];
                  clearInterval(interval);
                }
              }, 1000);
            }
          });
        };

        // Send local stream to others
        localStream.current.getTracks().forEach((track) => {
          availableConnections.current[socketId].addTrack(
            track,
            localStream.current
          );
        });

        // Create offer if the parameter is true
        if (createOffer) {
          const offer = await availableConnections.current[
            socketId
          ].createOffer();
          await availableConnections.current[socketId].setLocalDescription(
            offer
          );
          // Send it to other user
          socRef.current.emit("send_offer", { roomId, socketId, offer });
        }
      }
    );

    return () => {
      socRef.current.off("user-connected");
    };
  }, [addConnection, roomId]);

  // For ICE info
  useEffect(() => {
    socRef.current.on("ice_info", async ({ socketId, ice }) => {
      if (availableConnections.current[socketId]) {
        await availableConnections.current[socketId].addIceCandidate(ice);
      }
    });

    return () => {
      socRef.current.off("ice_info");
    };
  }, []);

  // For offer
  useEffect(() => {
    socRef.current.on("send_offer", async ({ socketId, offer }) => {
      if (availableConnections.current[socketId]) {
        await availableConnections.current[socketId].setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        // Offer is sent, then create answer
        if (offer.type === "offer") {
          const answer = await availableConnections.current[
            socketId
          ].createAnswer();
          await availableConnections.current[socketId].setLocalDescription(
            answer
          );
          socRef.current.emit("send_offer", {
            roomId,
            socketId,
            offer: answer,
          });
        }
      }
    });

    return () => {
      socRef.current.off("send_offer");
    };
  }, [roomId]);

  // To remove connection
  useEffect(() => {
    socRef.current.on("user-disconnected", ({ socketId, user }) => {
      if (socketId in availableConnections.current) {
        availableConnections.current[socketId].close();
        delete availableConnections.current[socketId];
        delete audioMap.current[socketId];
        setConnections((prev) =>
          prev.filter((connection) => connection.id !== user.id)
        );
      }
    });

    return () => {
      socRef.current.off("user-disconnected");
    };
  }, [roomId]);

  useEffect(() => {
    console.log("Connections state changed:", connections);
  }, [connections]);
  useEffect(()=>{
    participantRef.current = connections
  },[connections])
  useEffect(()=>{
    socRef.current.on("user-muted",({socketId,user})=>{
      participantRef.current.forEach((participant)=>{
        if(participant._id === user._id){
          participant.isMuted = true
          setConnections(JSON.parse(JSON.stringify(participantRef.current)))
        }
      })
    })
    socRef.current.on("user-unmuted",({socketId,user})=>{
      participantRef.current.forEach((participant)=>{
        if(participant._id === user._id){
          participant.isMuted = false
          setConnections(JSON.parse(JSON.stringify(participantRef.current)))
        }
      })
    })
  },[participantRef])
  return { connections, provideRef, handleMute };
};

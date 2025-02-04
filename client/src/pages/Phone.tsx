import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import ContentWraper from "../components/ContentWraper";
import { Box, Button, Skeleton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContextWrapper";

const socket = io("https://signaling-server-yoj5.onrender.com");
const socketPeer = {
  id: 1,
  role: "technician",
  firstName: "Santiago",
  lastName: "Zapata",
  socketId: "santizapata",
  photo:
    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  company: "BetterCall",
  rating: 4,
  jobId: 12,
  services: [2],
};

interface Peer {
  role: string;
  firstName: string;
  lastName: string;
  socketId: string;
  photo: string;
  address: string;
  location: { latitude: number; longitude: number } | null;
}

// interface CallData {
//   sender: string;
// }

const Phone = () => {
  const { company } = useAuth();
  const [available, setAvailable] = useState<boolean>(false);
  const [onJob, setOnJob] = useState<boolean>(false);
  const [hiringUser, setHiringUser] = useState<string | null>(null);
  const [, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [peers, setPeers] = useState<Peer[]>([]); //
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState<{ sender: string } | null>(
    null
  );
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [targetPeer, setTargetPeer] = useState<string | null>(null);
  const iceCandidateQueue = useRef<RTCIceCandidateInit[]>([]);

  const baseLocation = { lat: 6.207326920022623, lng: -75.57076466673648 };

  const generateRandomLocation = () => {
    const radiusInKm = 1;
    const earthRadiusInKm = 6371;

    const randomOffset = () => (Math.random() - 0.5) * 2; // Random value between -1 and 1

    const latOffset = (radiusInKm / earthRadiusInKm) * (180 / Math.PI);
    const lngOffset = latOffset / Math.cos((baseLocation.lat * Math.PI) / 180);

    const newLat = baseLocation.lat + randomOffset() * latOffset;
    const newLng = baseLocation.lng + randomOffset() * lngOffset;

    return {
      latitude: parseFloat(newLat.toFixed(6)),
      longitude: parseFloat(newLng.toFixed(6)),
    };
  };

  const sendRandomLocation = () => {
    const randomLocation = generateRandomLocation();
    setLocation(randomLocation);
    socket.emit("send-location", randomLocation);
  };

  useEffect(() => {
    socket.emit("register", socketPeer);
    console.log("Registered as technician:", socketPeer.socketId);

    sendRandomLocation();
    const interval = setInterval(sendRandomLocation, 3000); // Update every 3 seconds

    // Listen for incoming signaling messages
    socket.on("offer", ({ offer, sender, senderData }) => {
      console.log(`Incoming offer from ${sender} with data:`, senderData);
      setIncomingCall({ sender });
      handleOffer(offer, sender);
    });

    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);
    socket.on("call-rejected", () => {
      resetCallState(); // Reset state when the call is rejected
      alert("Call was rejected.");
      console.log("Call rejected.");
    });

    socket.on("call-ended", () => {
      resetCallState();
      alert("The other peer has ended the call.");
      console.log("Call ended.");
    });

    socket?.on("call-cancelled", () => {
      resetCallState();
      console.log(`Call cancelled`);
    });

    // Request media stream (audio only)
    const getUserMedia = async () => {
      const constraints = {
        audio: { echoCancellation: false, noiseSuppression: false }, // Disable processing for testing
        video: false,
      };
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setLocalStream(stream);
        console.log("Local stream obtained.");
      } catch (err) {
        console.error("Failed to get user media:", err);
      }
    };

    getUserMedia();

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("call-rejected");
      socket.off("call-ended");
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (inCall && !remoteStream) {
      console.warn("Remote stream is missing. Debugging...");
    }
  }, [inCall, remoteStream]);

  const toggleAvailability = () => {
    if (!onJob) {
      setAvailable(!available);
      socket.emit("toggle-availability", !available);
    }
  };

  useEffect(() => {
    socket.on("peer-list", (peers: Peer[]) => {
      //
      setPeers(peers);
    });

    socket.on("hire-request", (clientData) => {
      const accept = window.confirm(
        `Job request from ${clientData.firstName} ${clientData.lastName}. Accept?`
      );
      socket.emit("hire-response", {
        response: accept ? "accept" : "reject",
        clientId: clientData.socketId,
        technicianId: socketPeer.socketId,
      });
      if (accept) {
        setOnJob(true);
        // setHiringUser(client);
      }
    });

    socket.on("service-cancelled", () => {
      alert("Service cancelled");
      setOnJob(false);
      setHiringUser(null);
    });

    socket.on("service-ended", () => {
      alert("Service completed");
      setOnJob(false);
      setHiringUser(null);
    });

    return () => {
      socket.off("hire-request");
      socket.off("service-ended");
    };
  }, []);

  const cancelService = () => {
    socket.emit("cancel-service", {
      clientId: hiringUser,
      technicianId: socketPeer.socketId,
    });
    setOnJob(false);
    setHiringUser(null);
  };

  const endService = () => {
    socket.emit("end-service", {
      clientId: hiringUser,
      technicianId: socketPeer.socketId,
    });
    setOnJob(false);
    setHiringUser(null);
  };

  // Handle incoming offer
  const handleOffer = async (offer: RTCSessionDescription, sender: string) => {
    const peerConnection = createPeerConnection(sender);

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    console.log("Offer set to remote description.");

    // Process any ICE candidates that were queued before setting remote description
    iceCandidateQueue.current.forEach((candidate) => {
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      console.log("Queued ICE candidate added.");
    });
    iceCandidateQueue.current = []; // Clear the queue

    // Store the peer connection reference
    peerConnectionRef.current = peerConnection;
  };

  // Handle incoming answer
  const handleAnswer = async (
    answer: { answer: RTCSessionDescription } | null
  ) => {
    if (answer && answer.answer) {
      const { answer: sessionDescription } = answer;

      console.log("Received valid answer:", sessionDescription);

      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(sessionDescription)
          );
          console.log("Remote description set successfully.");

          setInCall(true); // Set "In Call" state after connection is established
        } catch (error) {
          console.error("Error setting remote description:", error);
        }
      }
    } else {
      console.error("Received invalid answer:", answer);
    }
  };

  // Handle ICE candidates
  const handleIceCandidate = ({
    candidate,
  }: {
    candidate: RTCIceCandidateInit;
  }) => {
    console.log("Received ICE candidate:", candidate);
    if (peerConnectionRef.current) {
      if (peerConnectionRef.current.remoteDescription) {
        peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      } else {
        // If remote description is not set, queue the ICE candidate
        iceCandidateQueue.current.push(candidate);
        console.log("ICE candidate queued.");
      }
    }
  };

  // Create a new peer connection
  const createPeerConnection = (targetPeer: string): RTCPeerConnection => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.ontrack = (event) => {
      console.log("Remote stream received", event.streams[0]);
      setRemoteStream(event.streams[0]);
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          target: targetPeer,
          candidate: event.candidate,
        });
        console.log(`ICE candidate sent to: ${targetPeer}`);
      }
    };

    return peerConnection;
  };

  // Start a call
  const startCall = async () => {
    if (!localStream || !targetPeer) return;

    const peerConnection = createPeerConnection(targetPeer);

    // Add local tracks to the peer connection
    localStream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, localStream));

    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      // Send the offer to the target peer
      socket.emit("offer", { target: targetPeer, offer });
      peerConnectionRef.current = peerConnection;

      setIsCalling(true);
      console.log(`Calling peer: ${targetPeer}`);
    } catch (error) {
      console.error("Error creating or setting offer:", error);
    }
  };

  // Accept a call
  const acceptCall = async () => {
    if (!incomingCall || !localStream) return;

    const peerConnection = peerConnectionRef.current!;

    // Add local tracks before creating an answer
    localStream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, localStream));

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    // Send answer to the caller
    socket.emit("answer", { target: incomingCall.sender, answer });

    setTargetPeer(incomingCall.sender); // Set target peer on the callee side
    setIncomingCall(null);
    setInCall(true);
    console.log(`Call accepted with ${incomingCall.sender}`);
  };

  // Reject a call
  const rejectCall = () => {
    if (incomingCall) {
      socket.emit("call-rejected", { target: incomingCall.sender });
      console.log(`Call rejected from ${incomingCall.sender}`);
      setIncomingCall(null); // Clear incoming call state
    }
  };

  // End a call
  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    resetCallState();
    socket.emit("call-ended", { target: targetPeer }); // Notify the other peer
    console.log("Call ended.");
  };

  const cancelCall = () => {
    if (isCalling && targetPeer) {
      socket?.emit("call-cancelled", { target: targetPeer });
      console.log(`Call cancelled to ${targetPeer}`);
      resetCallState();
    }
  };

  // Reset call state
  const resetCallState = () => {
    setIncomingCall(null);
    setIsCalling(false);
    setInCall(false);
    setTargetPeer(null);
    peerConnectionRef.current = null;
    setRemoteStream(null); // Clear remote stream
  };
  const navigate = useNavigate();
  const [callerData, setCallerData] = useState<any>();
  // const [peers, setPeers] = useState<Peer[]>([]); //
  // const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  // const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  // const [isCalling, setIsCalling] = useState(false);
  // const [inCall, setInCall] = useState(false);
  // const [incomingCall, setIncomingCall] = useState<CallData | null>(null);
  // const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  // const [targetPeer, setTargetPeer] = useState<string | null>(null);
  // const [callerData, setCallerData] = useState<any>();
  // const iceCandidateQueue = useRef<RTCIceCandidateInit[]>([]);

  // useEffect(() => {
  //   socket.emit("register", socketPeer);
  //   console.log("Registered as technician:", socketPeer.socketId);

  //   // Listen for incoming signaling messages
  //   socket.on("offer", ({ offer, sender, senderData }) => {
  //     console.log(`Incoming offer from ${sender} with data:`, senderData);
  //     setCallerData(senderData);
  //     setIncomingCall({ sender });
  //     handleOffer(offer, sender);
  //   });

  //   socket.on("answer", handleAnswer);
  //   socket.on("ice-candidate", handleIceCandidate);
  //   socket.on("call-rejected", () => {
  //     resetCallState(); // Reset state when the call is rejected
  //     alert("Call was rejected.");
  //     console.log("Call rejected.");
  //   });

  //   socket.on("call-ended", () => {
  //     resetCallState();
  //     alert("The other peer has ended the call.");
  //     console.log("Call ended.");
  //   });

  //   socket?.on("call-cancelled", () => {
  //     resetCallState();
  //     console.log(`Call cancelled`);
  //   });

  //   // Request media stream (audio only)
  //   const getUserMedia = async () => {
  //     const constraints = {
  //       audio: { echoCancellation: false, noiseSuppression: false }, // Disable processing for testing
  //       video: false,
  //     };
  //     try {
  //       const stream = await navigator.mediaDevices.getUserMedia(constraints);
  //       setLocalStream(stream);
  //       console.log("Local stream obtained.");
  //     } catch (err) {
  //       console.error("Failed to get user media:", err);
  //     }
  //   };

  //   getUserMedia();

  //   return () => {
  //     socket.off("offer");
  //     socket.off("answer");
  //     socket.off("ice-candidate");
  //     socket.off("call-rejected");
  //     socket.off("call-ended");
  //   };
  // }, []);

  // useEffect(() => {
  //   if (inCall && !remoteStream) {
  //     console.warn("Remote stream is missing. Debugging...");
  //   }
  // }, [inCall, remoteStream]);

  // //   const toggleAvailability = () => {
  // //     if (!onJob) {
  // //       setAvailable(!available);
  // //       socket.emit("toggle-availability", !available);
  // //     }
  // //   };

  // useEffect(() => {
  //   socket.on("peer-list", (peers: Peer[]) => {
  //     //
  //     setPeers(peers);
  //   });

  //   socket.on("hire-request", (clientData) => {
  //     const accept = window.confirm(
  //       `Job request from ${clientData.firstName} ${clientData.lastName}. Accept?`
  //     );
  //     socket.emit("hire-response", {
  //       response: accept ? "accept" : "reject",
  //       clientId: clientData.socketId,
  //       technicianId: socketPeer.socketId,
  //     });
  //   });

  //   socket.on("service-cancelled", () => {
  //     alert("Service cancelled");
  //   });

  //   socket.on("service-ended", () => {
  //     alert("Service completed");
  //   });

  //   return () => {
  //     socket.off("hire-request");
  //     socket.off("service-ended");
  //   };
  // }, []);

  // const handleOffer = async (offer: RTCSessionDescription, sender: string) => {
  //   const peerConnection = createPeerConnection(sender);

  //   await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  //   console.log("Offer set to remote description.");

  //   // Process any ICE candidates that were queued before setting remote description
  //   iceCandidateQueue.current.forEach((candidate) => {
  //     peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  //     console.log("Queued ICE candidate added.");
  //   });
  //   iceCandidateQueue.current = []; // Clear the queue

  //   // Store the peer connection reference
  //   peerConnectionRef.current = peerConnection;
  // };

  // // Handle incoming answer
  // const handleAnswer = async (
  //   answer: { answer: RTCSessionDescription } | null
  // ) => {
  //   if (answer && answer.answer) {
  //     const { answer: sessionDescription } = answer;

  //     console.log("Received valid answer:", sessionDescription);

  //     if (peerConnectionRef.current) {
  //       try {
  //         await peerConnectionRef.current.setRemoteDescription(
  //           new RTCSessionDescription(sessionDescription)
  //         );
  //         console.log("Remote description set successfully.");

  //         setInCall(true); // Set "In Call" state after connection is established
  //       } catch (error) {
  //         console.error("Error setting remote description:", error);
  //       }
  //     }
  //   } else {
  //     console.error("Received invalid answer:", answer);
  //   }
  // };

  // // Handle ICE candidates
  // const handleIceCandidate = ({
  //   candidate,
  // }: {
  //   candidate: RTCIceCandidateInit;
  // }) => {
  //   console.log("Received ICE candidate:", candidate);
  //   if (peerConnectionRef.current) {
  //     if (peerConnectionRef.current.remoteDescription) {
  //       peerConnectionRef.current.addIceCandidate(
  //         new RTCIceCandidate(candidate)
  //       );
  //     } else {
  //       // If remote description is not set, queue the ICE candidate
  //       iceCandidateQueue.current.push(candidate);
  //       console.log("ICE candidate queued.");
  //     }
  //   }
  // };

  // // Create a new peer connection
  // const createPeerConnection = (targetPeer: string): RTCPeerConnection => {
  //   const peerConnection = new RTCPeerConnection({
  //     iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  //   });

  //   peerConnection.ontrack = (event) => {
  //     console.log("Remote stream received", event.streams[0]);
  //     setRemoteStream(event.streams[0]);
  //   };

  //   peerConnection.onicecandidate = (event) => {
  //     if (event.candidate) {
  //       socket.emit("ice-candidate", {
  //         target: targetPeer,
  //         candidate: event.candidate,
  //       });
  //       console.log(`ICE candidate sent to: ${targetPeer}`);
  //     }
  //   };

  //   return peerConnection;
  // };

  // // Start a call
  // const startCall = async () => {
  //   if (!localStream || !targetPeer) return;

  //   const peerConnection = createPeerConnection(targetPeer);

  //   // Add local tracks to the peer connection
  //   localStream
  //     .getTracks()
  //     .forEach((track) => peerConnection.addTrack(track, localStream));

  //   try {
  //     const offer = await peerConnection.createOffer();
  //     await peerConnection.setLocalDescription(offer);

  //     // Send the offer to the target peer
  //     socket.emit("offer", { target: targetPeer, offer });
  //     peerConnectionRef.current = peerConnection;

  //     setIsCalling(true);
  //     console.log(`Calling peer: ${targetPeer}`);
  //   } catch (error) {
  //     console.error("Error creating or setting offer:", error);
  //   }
  // };

  // // Accept a call
  // const acceptCall = async () => {
  //   if (!incomingCall || !localStream) return;

  //   const peerConnection = peerConnectionRef.current!;

  //   // Add local tracks before creating an answer
  //   localStream
  //     .getTracks()
  //     .forEach((track) => peerConnection.addTrack(track, localStream));

  //   const answer = await peerConnection.createAnswer();
  //   await peerConnection.setLocalDescription(answer);

  //   // Send answer to the caller
  //   socket.emit("answer", { target: incomingCall.sender, answer });

  //   setTargetPeer(incomingCall.sender); // Set target peer on the callee side
  //   setIncomingCall(null);
  //   setInCall(true);
  //   console.log(`Call accepted with ${incomingCall.sender}`);
  // };

  // // Reject a call
  // const rejectCall = () => {
  //   if (incomingCall) {
  //     socket.emit("call-rejected", { target: incomingCall.sender });
  //     console.log(`Call rejected from ${incomingCall.sender}`);
  //     setIncomingCall(null); // Clear incoming call state
  //   }
  // };

  // // End a call
  // const endCall = () => {
  //   if (peerConnectionRef.current) {
  //     peerConnectionRef.current.close();
  //   }

  //   resetCallState();
  //   socket.emit("call-ended", { target: targetPeer }); // Notify the other peer
  //   console.log("Call ended.");
  // };

  // const cancelCall = () => {
  //   if (isCalling && targetPeer) {
  //     socket?.emit("call-cancelled", { target: targetPeer });
  //     console.log(`Call cancelled to ${targetPeer}`);
  //     resetCallState();
  //   }
  // };

  // // Reset call state
  // const resetCallState = () => {
  //   setIncomingCall(null);
  //   setIsCalling(false);
  //   setInCall(false);
  //   setTargetPeer(null);
  //   peerConnectionRef.current = null;
  //   setRemoteStream(null); // Clear remote stream
  // };

  return (
    <ContentWraper onBack={() => navigate(-1)} name="Calls">
      {/* <Box sx={{ gap: "20px", display: "flex", flexDirection: "column" }}>
        <Box>
          <Typography>
            Here you will be able to receive the incoming calls from users
            looking for your services
          </Typography>
          <button onClick={toggleAvailability} disabled={onJob}>
            {available ? "Go Offline" : "Go Online"}
          </button>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            margin: "50px",
          }}
        >
          <Box>
            {peers.map((peer) => (
              <Box key={peer.socketId}>
                <Typography>{peer.socketId}</Typography>
                <Button
                  onClick={() => {
                    setCallerData(peer.socketId);
                    setTargetPeer(peer.socketId);
                    startCall();
                  }}
                >
                  Call
                </Button>
              </Box>
            ))}
          </Box>
          {!incomingCall && !inCall && (
            <Skeleton
              variant="rectangular"
              width={300}
              height={600}
              animation="wave"
              sx={{ borderRadius: "10px" }}
            />
          )}
          {incomingCall && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                borderRadius: "10px",
                width: 300,
                height: 600,
                backgroundColor: "#fff",
                color: "#000",
                padding: "20px",
                gap: "20px",
                justifyContent: "center",
                textAlign: "center",
                border: "10px 5px 30px 5px solid black",
              }}
            >
              <img src={callerData.photo} alt="" />
              <Typography>You are receiving a call from</Typography>
              <Typography>{callerData.firstName}</Typography>
              <Typography>{incomingCall?.sender}</Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  gap: "20px",
                }}
              >
                <Button
                  fullWidth
                  sx={{ backgroundColor: "red" }}
                  onClick={() => rejectCall()}
                >
                  Reject
                </Button>
                <Button
                  fullWidth
                  sx={{ backgroundColor: "#1d960d" }}
                  onClick={() => acceptCall()}
                >
                  Accept
                </Button>
              </Box>
            </Box>
          )}
          {inCall && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                borderRadius: "10px",
                width: 300,
                height: 600,
                backgroundColor: "#fff",
                color: "#000",
                padding: "20px",
                gap: "20px",
                justifyContent: "center",
                textAlign: "center",
                border: "10px 5px 30px 5px solid black",
              }}
            >
              <img src={callerData.photo} alt="" />
              <Typography>You are in a call with</Typography>
              <Typography>{callerData.firstName}</Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  gap: "20px",
                }}
              >
                <Button
                  fullWidth
                  sx={{ backgroundColor: "red" }}
                  onClick={() => endCall()}
                >
                  End Call
                </Button>
              </Box>
            </Box>
          )}
          {isCalling && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                borderRadius: "10px",
                width: 300,
                height: 600,
                backgroundColor: "#fff",
                color: "#000",
                padding: "20px",
                gap: "20px",
                justifyContent: "center",
                textAlign: "center",
                border: "10px 5px 30px 5px solid black",
              }}
            >
              <Typography>You are calling</Typography>
              <Button
                onClick={() => {
                  cancelCall();
                }}
              >
                Cancel Call
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      {remoteStream && (
        <audio
          autoPlay
          ref={(audio) => {
            if (audio) {
              audio.srcObject = remoteStream;
            } else {
              console.log("error");
            }
          }}
        />
      )} */}
      {company && (
        <Box>
          <Typography>{company.name}</Typography>
        </Box>
      )}
      <div style={{ padding: 20 }}>
        <h2>Technician ID: {socketPeer.socketId}</h2>
        {!inCall && !incomingCall && (
          <>
            <h3>Available Peers:</h3>
            <ul>
              {peers.map((peer) => (
                <li key={peer.socketId}>
                  <button onClick={() => setTargetPeer(peer.socketId)}>
                    Select {peer.socketId}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
        {incomingCall && (
          <div>
            <p>Incoming call from: {incomingCall.sender}</p>
            <button onClick={acceptCall}>Accept</button>
            <button onClick={rejectCall}>Reject</button>
          </div>
        )}
        {targetPeer && !inCall && !incomingCall && (
          <p>Calling Peer: {targetPeer}</p>
        )}
        {inCall && <p>In Call with: {targetPeer || incomingCall?.sender}</p>}
        {!inCall && !incomingCall && (
          <>
            <button onClick={startCall} disabled={!targetPeer || isCalling}>
              Start Call
            </button>
            <button
              onClick={() => {
                setTargetPeer("samueltaktek");
                startCall();
              }}
              disabled={isCalling}
            >
              Call Samuel
            </button>
          </>
        )}
        {isCalling && !inCall && (
          <button onClick={cancelCall}>Cancel Call</button>
        )}
        {inCall && <button onClick={endCall}>End Call</button>}

        {remoteStream && (
          <audio
            autoPlay
            ref={(audio) => {
              if (audio) audio.srcObject = remoteStream;
            }}
          />
        )}
        <button onClick={toggleAvailability} disabled={onJob}>
          {available ? "Go Offline" : "Go Online"}
        </button>
        {onJob && <h3>On a job with {hiringUser}</h3>}
        {onJob && (
          <>
            <h3>Client:</h3>
            <ul>
              {peers.map((peer) => (
                <li key={peer.socketId}>
                  {peer.socketId} - Location:{" "}
                  {peer.location
                    ? `${peer.location.latitude}, ${peer.location.longitude}`
                    : "No location yet"}
                </li>
              ))}
            </ul>
          </>
        )}
        {onJob && <button onClick={cancelService}>Cancel Service</button>}
        {onJob && <button onClick={endService}>Finish Service</button>}
      </div>
    </ContentWraper>
  );
};

export default Phone;

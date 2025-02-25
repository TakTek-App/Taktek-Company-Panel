import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import ContentWraper from "../components/ContentWraper";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContextWrapper";
// import Ringtone from "../audio/Ringtone.wav";
import ringtoneSrc from "../audio/Ringtone.wav";
import axios from "axios";

const Phone = () => {
  const { company } = useAuth();
  // const socket = io("https://taktek-app-1.onrender.com", {
  //   transports: ["websocket"],
  //   reconnectionAttempts: 5,
  //   reconnectionDelay: 3000,
  // });
  const socketPeer = {
    role: "company",
    socketId: company?.id,
  };
  const navigate = useNavigate();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  // const [isCalling, setIsCalling] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState<{ sender: string } | null>(
    null
  );
  const [callerData, setCallerData] = useState<any>();
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [targetPeer, setTargetPeer] = useState<string | null>(null);
  const iceCandidateQueue = useRef<RTCIceCandidateInit[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const [availableTechnicians, setAvailableTechnicians] = useState<any>([]);
  const [technicianId, setTechnicianId] = useState<any>(undefined);

  const playSound = () => {
    const ringtone = new Audio(ringtoneSrc);
    ringtone
      .play()
      .catch((error) => console.error("Error reproduciendo el sonido:", error));
  };

  useEffect(() => {
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
  }, []);

  console.log(availableTechnicians);
  console.log(callerData, "callerData");
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("https://taktek-app-1.onrender.com", {
        transports: ["websocket"],
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
      });

      socketRef.current.emit("register", socketPeer);
      console.log("Registered as technician:", socketPeer.socketId);
      socketRef.current.on("peer-list", (technicians: any[]) => {
        console.log(technicians, "techni");
        setAvailableTechnicians(technicians);
      });

      socketRef.current.on("offer", ({ offer, sender, senderData }) => {
        console.log(`Incoming offer from ${sender} with data:`, senderData);
        setIncomingCall({ sender });
        setCallerData(senderData);
        handleOffer(offer, sender);
      });

      socketRef.current.on("answer", handleAnswer);
      socketRef.current.on("ice-candidate", handleIceCandidate);
      socketRef.current.on("call-rejected", () => {
        resetCallState();
        alert("Call was rejected.");
      });

      socketRef.current.on("call-ended", () => {
        resetCallState();
        alert("The other peer has ended the call.");
      });

      socketRef.current.on("call-cancelled", () => {
        resetCallState();
        console.log(`Call cancelled`);
      });
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (incomingCall) {
      playSound();
    }
  }, [incomingCall]);

  useEffect(() => {
    if (inCall && !remoteStream) {
      console.warn("Remote stream is missing. Debugging...");
    }
  }, [inCall, remoteStream]);

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
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: "turn:relay1.expressturn.com:3478",
          username: "efK9QS1BYXA10VH4Y8",
          credential: "rDO3JiN6ZSS2ju7C",
        },
      ],
    });

    peerConnection.ontrack = (event) => {
      console.log("Remote stream received", event.streams[0]);
      setRemoteStream(event.streams[0]);
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit("ice-candidate", {
          target: targetPeer,
          candidate: event.candidate,
        });
        console.log(`ICE candidate sent to: ${targetPeer}`);
      }
    };

    return peerConnection;
  };

  // Accept a call
  const acceptCall = async () => {
    if (!incomingCall || !localStream) return;

    console.log("socket.id", socketRef.current?.id);

    const peerConnection = peerConnectionRef.current!;

    // Add local tracks before creating an answer
    localStream
      .getTracks()
      .forEach((track) => peerConnection?.addTrack(track, localStream));

    const answer = await peerConnection?.createAnswer();
    await peerConnection?.setLocalDescription(answer);

    // Send answer to the caller
    if (incomingCall?.sender) {
      socketRef.current?.emit("answer", {
        target: incomingCall?.sender,
        answer,
      });

      try {
        axios.post(`https://admin-panel-pple.onrender.com/calls`, {
          userId: callerData.id,
          technicianId: callerData.technicianId,
        });
        console.log("me ejecute");
      } catch (error) {
        console.error(error);
      }
    }

    setTargetPeer(incomingCall?.sender); // Set target peer on the callee side
    setIncomingCall(null);
    setInCall(true);
    console.log(`Call accepted with ${incomingCall?.sender}`);
  };

  // Reject a call
  const rejectCall = () => {
    if (incomingCall) {
      socketRef.current?.emit("call-rejected", {
        target: incomingCall?.sender,
      });
      console.log(`Call rejected from ${incomingCall?.sender}`);
      setIncomingCall(null); // Clear incoming call state
    }
  };

  // End a call
  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    console.log(targetPeer);
    socketRef.current?.emit("call-ended", { target: targetPeer }); // Notify the other peer
    console.log("Call ended.");
    resetCallState();
  };

  // const cancelCall = () => {
  //   if (isCalling && targetPeer) {
  //     socket?.emit("call-cancelled", { target: targetPeer });
  //     console.log(`Call cancelled to ${targetPeer}`);
  //     resetCallState();
  //   }
  // };

  // Reset call state
  const resetCallState = () => {
    setIncomingCall(null);
    // setIsCalling(false);
    setInCall(false);
    setTargetPeer(null);
    peerConnectionRef.current = null;
    setRemoteStream(null); // Clear remote stream
  };

  const createJob = (technicianId: any) => {
    console.log(technicianId);
    socketRef.current?.emit("hire", {
      technicianId: technicianId,
      clientId: callerData?.socketId,
    });
  };

  return (
    <ContentWraper onBack={() => navigate(-1)} name="Phone">
      <Box
        sx={{
          padding: { xs: 0, md: 5 },
          display: { xs: "flex", md: "grid" },
          flexDirection: { xs: "column", md: "row" },
          justifyContent: { xs: "center", md: "space-evenly" },
          alignItems: "center",
          gridTemplateAreas: `
        "column1 column2"
        `,
          gridTemplateRows: "repeat(1,1fr)",
        }}
      >
        <Box
          sx={{
            gridArea: "column1",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {incomingCall && !inCall && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                borderRadius: "10px",
                width: 250,
                height: 500,
                backgroundColor: "#fff",
                color: "#000",
                padding: "20px",
                gap: "20px",
                justifyContent: "center",
                textAlign: "center",
                border: "10px solid black",
                marginBottom: "50px",
              }}
            >
              <p>Incoming call</p>
              <img
                src={callerData?.photo}
                alt=""
                width="90%"
                style={{
                  margin: "auto",
                }}
              />
              <Typography>{callerData?.firstName}</Typography>
              <Button onClick={acceptCall} sx={{ backgroundColor: "#38bb5c" }}>
                Accept
              </Button>
              <Button onClick={rejectCall} sx={{ backgroundColor: "tomato" }}>
                Reject
              </Button>
            </Box>
          )}
          {!incomingCall && !inCall && (
            <Box
              sx={{
                margin: "50px 0px",
                display: "flex",
                flexDirection: "column",
                borderRadius: "10px",
                width: 250,
                height: 500,
                backgroundColor: "#fff",
                color: "#000",
                padding: "20px",
                gap: "20px",
                justifyContent: "center",
                textAlign: "center",
                borderTop: "20px solid black",
                borderBottom: "40px solid black",
                borderRight: "10px solid black",
                borderLeft: "10px solid black",
              }}
            >
              <Typography>You should see the incoming calls here</Typography>
            </Box>
          )}
          {inCall && !incomingCall && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                borderRadius: "10px",
                width: 250,
                height: 500,
                backgroundColor: "#fff",
                color: "#000",
                padding: "20px",
                gap: "20px",
                justifyContent: "center",
                textAlign: "center",
                border: "10px solid black",
                marginBottom: "50px",
              }}
            >
              <p>In Call With</p>
              <img
                src={callerData?.photo}
                alt=""
                width="90%"
                style={{
                  margin: "auto",
                }}
              />
              <Typography>{callerData?.firstName}</Typography>
              <Button onClick={endCall} sx={{ backgroundColor: "tomato" }}>
                End Call
              </Button>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            gridArea: "column2",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <select
            name=""
            id=""
            onChange={(e) => {
              console.log(e.target.value);

              setTechnicianId(e.target.value);
            }}
            style={{
              width: "300px",
              height: "fit-content",
              fontSize: "18px",
              borderRadius: "5px",
              padding: "10px 10px",
              borderColor: "#c2c2c2",
            }}
          >
            <option value="Select A Technician">Select A Technician</option>
            {availableTechnicians &&
              availableTechnicians.map((tech: any) => (
                <option value={tech.socketId} key={tech.id}>
                  {tech.firstName}
                </option>
              ))}
          </select>

          <Button onClick={() => createJob(technicianId)}>Create Job</Button>
        </Box>
        {remoteStream && (
          <audio
            autoPlay
            ref={(audio) => {
              if (audio) audio.srcObject = remoteStream;
            }}
          />
        )}
      </Box>
    </ContentWraper>
  );
};

export default Phone;

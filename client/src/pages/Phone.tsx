import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import ContentWraper from "../components/ContentWraper";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Phone = () => {
  const socket = io("https://signaling-server-yoj5.onrender.com");
  const socketPeer = {
    socketId: "santizapata",
  };
  const navigate = useNavigate();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState<{ sender: string } | null>(
    null
  );
  const [callerData, setCallerData] = useState<any>();
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [targetPeer, setTargetPeer] = useState<string | null>(null);
  const iceCandidateQueue = useRef<RTCIceCandidateInit[]>([]);

  useEffect(() => {
    socket.emit("register", socketPeer);
    console.log("Registered as technician:", socketPeer.socketId);

    // Listen for incoming signaling messages
    socket.on("offer", ({ offer, sender, senderData }) => {
      console.log(`Incoming offer from ${sender} with data:`, senderData);
      setIncomingCall({ sender });
      setCallerData(senderData);
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
    };
  }, []);

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

  return (
    <ContentWraper onBack={() => navigate(-1)} name="Calls">
      <div style={{ padding: 20 }}>
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
              border: "10px solid black",
            }}
          >
            <p>Incoming call from: {incomingCall.sender}</p>
            <img src={callerData?.photo} alt="" width="300px" />
            <Typography>You should see the incoming calls here</Typography>
            <Typography>{callerData?.firstName}</Typography>
            <Typography>{incomingCall?.sender}</Typography>
            <button onClick={acceptCall}>Accept</button>
            <button onClick={rejectCall}>Reject</button>
          </Box>
        )}
        {!incomingCall && (
          <Box
            sx={{
              margin: "50px 0px",
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
              borderTop: "20px solid black",
              borderBottom: "40px solid black",
              borderRight: "10px solid black",
              borderLeft: "10px solid black",
            }}
          >
            <Typography>You should see the incoming calls here</Typography>
          </Box>
        )}
        {targetPeer && !inCall && !incomingCall && (
          <p>Calling Peer: {targetPeer}</p>
        )}
        {inCall && <p>In Call with: {targetPeer || incomingCall?.sender}</p>}
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
      </div>
    </ContentWraper>
  );
};

export default Phone;

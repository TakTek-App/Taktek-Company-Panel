import { useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";

const LIVEKIT_SERVER_URL = "wss://taktek-test-uiwu1aun.livekit.cloud";

export default function LiveKitApp() {
  const [token, setToken] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const getToken = async () => {
    const response = await fetch("http://localhost:5000/generateToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    setToken(data.token);
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-xl font-bold">LiveKit React App</h1>
      {isConnected ? (
        <LiveKitRoom
          serverUrl={LIVEKIT_SERVER_URL}
          token={token}
          connect={true}
          className="w-full h-[80vh]"
        >
          <VideoConference />
        </LiveKitRoom>
      ) : (
        <>
          <button
            onClick={getToken}
            className="p-2 bg-blue-500 text-white rounded-lg"
          >
            Obtener Token
          </button>
          {token && (
            <button
              onClick={() => setIsConnected(true)}
              className="p-2 bg-green-500 text-white rounded-lg mt-2"
            >
              Conectar a la Sala
            </button>
          )}
        </>
      )}
    </div>
  );
}

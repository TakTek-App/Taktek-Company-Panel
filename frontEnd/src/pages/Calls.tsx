// import { useState } from "react";
// import { LiveKitRoom, VideoConference } from "@livekit/components-react";
// import "@livekit/components-styles";

import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { useState } from "react";

// const LIVEKIT_SERVER_URL = "wss://taktek-test-uiwu1aun.livekit.cloud";

// export default function LiveKitApp() {
//   const [token, setToken] = useState("");
//   const [isConnected, setIsConnected] = useState(false);

//   const getToken = async () => {
//     const response = await fetch(
//       "https://taktek-company-panel.onrender.com/generateToken",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//     const data = await response.json();
//     setToken(data.token);
//   };

//   return (
//     <div className="p-4 flex flex-col items-center">
//       <h1 className="text-xl font-bold">LiveKit React App</h1>
//       {isConnected ? (
// <LiveKitRoom
//   serverUrl={LIVEKIT_SERVER_URL}
//   token={token}
//   connect={true}
//   className="w-full h-[80vh]"
// >
//   <VideoConference />
// </LiveKitRoom>
//       ) : (
//         <>
//           <button
//             onClick={getToken}
//             className="p-2 bg-blue-500 text-white rounded-lg"
//           >
//             Obtener Token
//           </button>
//           {token && (
//             <button
//               onClick={() => setIsConnected(true)}
//               className="p-2 bg-green-500 text-white rounded-lg mt-2"
//             >
//               Conectar a la Sala
//             </button>
//           )}
//         </>
//       )}
//     </div>
//   );
// }
export default function LiveKitApp() {
  const [token, setToken] = useState("");
  const [roomName, setRoomName] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [userIdToCall, setUserIdToCall] = useState(null); // ID del usuario que deseas llamar

  const LIVEKIT_SERVER_URL = "wss://taktek-test-uiwu1aun.livekit.cloud";

  const getToken = async (userId: any) => {
    const response = await fetch(
      "https://taktek-company-panel.onrender.com/generateToken",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId }), // Pasas el ID del usuario
      }
    );
    const data = await response.json();
    setToken(data.token);
    setRoomName(data.roomName); // Guardas el roomName del usuario
  };

  // Esta función se llamará cuando hagas clic en un usuario en el mapa
  const handleUserClick = (userId: any) => {
    setUserIdToCall(userId);
    getToken(userId); // Generas el token para el usuario seleccionado
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-xl font-bold">LiveKit React App</h1>

      {/* Aquí deberías renderizar los usuarios en el mapa */}
      <div>
        {/* Ejemplo de usuarios en el mapa */}
        <button onClick={() => handleUserClick(1)}>Llamar al Usuario 1</button>
        <button onClick={() => handleUserClick(2)}>Llamar al Usuario 2</button>
        {/* Agrega más botones según los usuarios disponibles */}
      </div>

      {isConnected ? (
        <LiveKitRoom
          serverUrl={LIVEKIT_SERVER_URL}
          token={token}
          // room={roomName} // Usas el roomName correspondiente al usuario
          connect={true}
          className="w-full h-[80vh]"
        >
          <VideoConference />
        </LiveKitRoom>
      ) : (
        <>
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

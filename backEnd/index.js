const express = require("express");
const cors = require("cors");
const { AccessToken } = require("livekit-server-sdk");

const app = express();
const PORT = 5000;

const LIVEKIT_HOST = "http://localhost:7880";
const API_KEY = "APItnhD9PWUr3ch";
const API_SECRET = "fBeODqCuQBAdGISITbMKI0wrXL7SNl3xIuHeajpb4qiB";

app.use(cors());
app.use(express.json());

app.post("/generateToken", async (req, res) => {
  try {
    const roomName = "defaultRoom";
    const participantName = `user_${Math.floor(Math.random() * 1000)}`;

    const at = new AccessToken(API_KEY, API_SECRET, {
      identity: participantName,
      ttl: 3600,
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true, // Permite enviar audio y video
      canSubscribe: true, // Permite recibir audio y video
    });
    const token = await at.toJwt();
    console.log("Token generado:", token);

    res.json({ token: token });
  } catch (error) {
    res.status(500).json({ error: "Error generando el token" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

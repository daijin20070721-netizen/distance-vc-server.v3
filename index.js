const express = require("express");
const app = express();
const http = require("http").createServer(app);
const WebSocket = require("ws");

const wss = new WebSocket.Server({ server: http });

app.get("/", (req, res) => {
  res.send("OK");
});

// WebRTC用のシグナリング
wss.on("connection", (ws) => {
  ws.on("message", (msg) => {
    // 他の全員に中継
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg.toString());
      }
    });
  });
});

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/pos", (req, res) => {
  const data = req.body;
  console.log("Player pos:", data);
  res.send("OK");
});

http.listen(PORT, () => {
  console.log("Signaling server running on port " + PORT);
});


require("dotenv").config();
console.log(process.env.SUPABASE_URL);
const roomUsers = {};
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const supabase = require("./supabase");
const authRoutes = require("./auth");

const app = express();
app.use(express.json());

app.use(cors());
app.use("/auth", authRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", async ({ roomId, username }) => {
    socket.join(roomId);
    const { data } = await supabase
  .from("rooms")
  .select("code")
  .eq("id", roomId)
  .single();

if (data?.code) {
  socket.emit("load-code", data.code);
}

    socket.roomId = roomId;
    socket.username = username;

    if (!roomUsers[roomId]) {
      roomUsers[roomId] = [];
    }

    roomUsers[roomId].push(username);

    io.to(roomId).emit("users-in-room", roomUsers[roomId]);

    console.log(`${username} joined ${roomId}`);
  });

socket.on("send-changes", async ({ roomId, code }) => {
  console.log("Saving:", roomId);

  const { data, error } = await supabase
    .from("rooms")
    .upsert({
      id: roomId,
      code,
    });

  if (error) {
    console.log("Supabase Error:", error);
  } else {
    console.log("Saved successfully");
  }

  socket.to(roomId).emit("receive-changes", code);
});

  socket.on("disconnect", () => {
    const roomId = socket.roomId;
    const username = socket.username;

    if (roomUsers[roomId]) {
      roomUsers[roomId] = roomUsers[roomId].filter(
        (user) => user !== username
      );

      io.to(roomId).emit("users-in-room", roomUsers[roomId]);
    }

    console.log("User disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
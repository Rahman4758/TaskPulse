const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors("http://localhost:8080"));
app.use(express.json());

// Socket.io
const io = new Server(server, {
  cors: { origin: "*" }
});

// Attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("user:activity", (user) => {
    socket.broadcast.emit("user:joined", user);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// DB + Start
const mongodb = async ()=>{
    try{ await mongoose.connect(process.env.MONGO_URI)
      console.log("mongodb Connected Successfully")
    }catch(error){
      console.log("mongodb not connected")
    }
}
mongodb();
 const PORT = process.env.PORT || 5000
 server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  
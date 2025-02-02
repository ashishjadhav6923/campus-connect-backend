import { Server } from "socket.io";
import mongoose from "mongoose";
import { Message } from "./models/message.model.js";
import { ChatSession } from "./models/chatSession.model.js";

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // Allow frontend to connect
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle joining chat room
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // Handle sending messages and saving to DB
    socket.on("sendMessage", async (messageData) => {
      try {
        const { sender, recipient, chatSession, content } = messageData;

        // Validate messageData
        if (!sender || !recipient || !chatSession || !content) {
          return socket.emit("error", { message: "Missing required fields" });
        }

        // Save message to MongoDB
        const newMessage = await Message.create({
          sender,
          recipient,
          content,
          chatSession,
        });

        // Update lastMessage field in chatSession
        await ChatSession.findByIdAndUpdate(chatSession, {
          lastMessage: newMessage._id,
        });

        // Broadcast the message to the recipient
        io.to(chatSession).emit("receiveMessage", newMessage);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Internal Server Error" });
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export default setupSocket;

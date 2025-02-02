import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import app from "./app.js";
import connectDB from "./db/index.js";
import http from "http";
import setupSocket from "./socket.js";
connectDB();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
setupSocket(server);

app.get("/api", (req, res) => {
  res.send("this is api of campus connect");
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}/api`);
});

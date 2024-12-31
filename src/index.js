import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.get("/api", (req, res) => {
  res.send("this is api of campus connect");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
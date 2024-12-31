import express from "express";
import userRouter from "./routes/user.route.js";
import adminRouter from "./routes/admin.route.js";
const app = express();

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

export default app;

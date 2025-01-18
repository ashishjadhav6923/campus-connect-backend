import express, { urlencoded } from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import adminRouter from "./routes/admin.route.js";
import cookieParser from "cookie-parser";
import masterRouter from "./routes/master.route.js";
import studentRouter from "./routes/student.route.js";
import alumniRouter from "./routes/alumni.route.js";
const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/master", masterRouter);
app.use("/api/student", studentRouter);
app.use("/api/alumni", alumniRouter);

export default app;

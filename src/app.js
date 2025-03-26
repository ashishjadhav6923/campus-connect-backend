import express, { urlencoded } from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import adminRouter from "./routes/admin.route.js";
import cookieParser from "cookie-parser";
import masterRouter from "./routes/master.route.js";
import studentRouter from "./routes/student.route.js";
import alumniRouter from "./routes/alumni.route.js";
import userRouter from "./routes/user.route.js";
const app = express();
app.use(express.json());
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : [];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/master", masterRouter);
app.use("/api/student", studentRouter);
app.use("/api/alumni", alumniRouter);
app.use("/api/user", userRouter);

export default app;

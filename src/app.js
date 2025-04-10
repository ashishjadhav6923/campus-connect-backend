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
const allowedOrigins = [
  'http://localhost:5173',  // Local Vite development server
  'http://localhost:3000',  // Just in case you use another local port
  'https://campus-connect-frontend-v2.onrender.com'  // Your deployed frontend
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked origin:", origin);
      callback(null, true);  // Change to 'false' for strict CORS enforcement
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Credentials', 'Origin', 'Accept', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie']
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));
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

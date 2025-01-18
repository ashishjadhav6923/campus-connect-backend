import { Router } from "express";
import { updateStudentProfile } from "../controllers/student.controller.js";
import { verifyJwt, verifyRole } from "../middlewares/auth.middleware.js";

const studentRouter = Router();

studentRouter
  .route("/updateStudentProfile")
  .post(verifyJwt, verifyRole("student"), updateStudentProfile);

export default studentRouter;

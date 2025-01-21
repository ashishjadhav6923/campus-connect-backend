import { Router } from "express";
import {
  searchAlumniByFilter,
  updateStudentProfile,
} from "../controllers/student.controller.js";
import { verifyJwt, verifyRole } from "../middlewares/auth.middleware.js";

const studentRouter = Router();

studentRouter
  .route("/updateStudentProfile")
  .patch(verifyJwt, verifyRole("student"), updateStudentProfile);
studentRouter
  .route("/searchAlumniByFilter")
  .post(verifyJwt, verifyRole("student"), searchAlumniByFilter);

export default studentRouter;

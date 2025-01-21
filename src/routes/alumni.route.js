import { Router } from "express";
import { updateAlumniProfile } from "../controllers/alumni.controller.js";
import { verifyJwt, verifyRole } from "../middlewares/auth.middleware.js";

const alumniRouter = Router();

alumniRouter
  .route("/updateAlumniProfile")
  .patch(verifyJwt, verifyRole("alumni"), updateAlumniProfile);

export default alumniRouter;

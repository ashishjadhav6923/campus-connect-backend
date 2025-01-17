import { Router } from "express";
import { createUser, deleteUser } from "../controllers/admin.controller.js";
import { verifyJwt, verifyRole } from "../middlewares/auth.middleware.js";
const adminRouter = Router();

adminRouter
  .route("/createUser")
  .post(verifyJwt, verifyRole("admin"), createUser);
adminRouter
  .route("/deleteUser")
  .post(verifyJwt, verifyRole("admin"), deleteUser);

export default adminRouter;

import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refresh_AccessToken,
  verifyToken,
} from "../controllers/auth.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const authRouter = Router();

authRouter.route("/login").post(loginUser);

//verified routes
authRouter.route("/logout").post(verifyJwt, logoutUser);
authRouter.route("/refresh_AccessToken").post(refresh_AccessToken);
authRouter.route("/verify").get(verifyJwt, verifyToken);

export default authRouter;

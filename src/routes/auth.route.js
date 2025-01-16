import { Router } from "express";
import { loginUser, logoutUser, refresh_AccessToken } from "../controllers/auth.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";
const authRouter = Router();

authRouter.route("/login").post(loginUser);

//verified routes
authRouter.route("/logout").post(verifyJwt, logoutUser);
authRouter.route("/refresh_AccessToken").post(refresh_AccessToken);

export default authRouter;

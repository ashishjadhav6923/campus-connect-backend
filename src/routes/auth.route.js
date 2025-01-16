import { Router } from "express";
import { loginUser, logoutUser } from "../controllers/auth.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";
const authRouter = Router();

authRouter.route("/login").post(loginUser);

//verified routes
authRouter.route("/logout").post(verifyJwt, logoutUser);

export default authRouter;

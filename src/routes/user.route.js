import { Router } from "express";
import { loginUser, registerUser, userIndexController } from "../controllers/user.controller.js";
const userRouter = Router();

userRouter.route("/").get(userIndexController);
userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);

export default userRouter;

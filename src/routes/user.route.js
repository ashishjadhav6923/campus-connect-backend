import { Router } from "express";
import { registerUser, userIndexController } from "../controllers/user.controller.js";
const userRouter = Router();

userRouter.route("/").get(userIndexController);
userRouter.route("/register").post(registerUser);

export default userRouter;

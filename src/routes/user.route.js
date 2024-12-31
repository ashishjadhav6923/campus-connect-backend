import { Router } from "express";
import { userIndexController } from "../controllers/user.controller.js";
const userRouter = Router();

userRouter.route("/").get(userIndexController);

export default userRouter;

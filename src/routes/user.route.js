import { Router } from "express";
import { getUserInfoByPrn } from "../controllers/user.controller.js";
const userRouter = Router();

userRouter.route("/info/:prn").get(getUserInfoByPrn);

export default userRouter;

import { Router } from "express";
import {
  createChatSession,
  getAllUserChats,
  getChatMessages,
  getUserInfoByPrn,
} from "../controllers/user.controller.js";
import { verifyJwt, verifyRole } from "../middlewares/auth.middleware.js";
const userRouter = Router();

userRouter.route("/info/:prn").get(getUserInfoByPrn);
userRouter.route("/chats").get(verifyJwt, getAllUserChats);
userRouter.route("/chat/get/:chatSessionId").get(verifyJwt, getChatMessages);
userRouter.route("/chat/createChatSession").get(verifyJwt, createChatSession);

export default userRouter;

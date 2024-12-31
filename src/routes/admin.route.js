import { Router } from "express";
import { adminIndexController } from "../controllers/admin.controller.js";
const adminRouter = Router();

adminRouter.route("/").get(adminIndexController);

export default adminRouter;

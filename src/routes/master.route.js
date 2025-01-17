import { Router } from "express";
import { createAdmin } from "../controllers/master.controller.js";

const masterRouter = Router();

masterRouter.route("/createAdmin").post(createAdmin);
export default masterRouter;
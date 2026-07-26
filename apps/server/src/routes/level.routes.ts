import { Router } from "express";
import { getLevels } from "../controllers/level.controller.ts";

const levelRouter = Router();

levelRouter.get("/levels", getLevels);

export default levelRouter;

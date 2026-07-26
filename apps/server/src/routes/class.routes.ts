import { Router } from "express";
import { addClass, getClasses } from "../controllers/class.controller.ts";
import { CreateClassSchema } from "@school-portal/shared";
import { validate } from "../middlewares/validate.ts";

const classRouter = Router();

classRouter.post("/classes", validate(CreateClassSchema), addClass);
classRouter.get("/classes", getClasses);

export default classRouter;

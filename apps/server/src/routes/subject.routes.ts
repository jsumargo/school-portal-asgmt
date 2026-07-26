import { Router } from "express";
import { getSubjects } from "../controllers/subject.controller.ts";

const subjectRouter = Router();

subjectRouter.get("/subjects", getSubjects);

export default subjectRouter;

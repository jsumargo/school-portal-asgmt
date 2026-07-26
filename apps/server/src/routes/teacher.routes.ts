import { Router } from "express";
import { addTeacher, getTeachers } from "../controllers/teacher.controller.ts";
import { validate } from "../middlewares/validate.ts";
import { CreateTeacherSchema } from "@school-portal/shared";

const teacherRouter = Router();

teacherRouter.post("/teachers", validate(CreateTeacherSchema), addTeacher);
teacherRouter.get("/teachers", getTeachers);

export default teacherRouter;

import { type Request, type Response } from "express";
import { teacherService } from "../services/teacher.service.ts";
import type { TypedRequestBody } from "../types/express.ts";
import type { CreateTeacherRequest } from "@school-portal/shared";

export const addTeacher = async (
  req: TypedRequestBody<CreateTeacherRequest>,
  res: Response,
): Promise<void> => {
  await teacherService.createTeacher(req.body);
  res.status(201).send();
};

export const getTeachers = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const teachers = await teacherService.getAllTeachers();
  res.status(200).json({ data: teachers });
};

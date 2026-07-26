import { type Request, type Response } from "express";
import { subjectService } from "../services/subject.service.ts";

export const getSubjects = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const subjects = await subjectService.getAllSubjects();
  res.status(200).json({ data: subjects });
};

import { type Request, type Response } from "express";
import { classService } from "../services/class.service.ts";
import type { TypedRequestBody } from "../types/express.ts";
import type { CreateClassRequest } from "@school-portal/shared";

export const addClass = async (
  req: TypedRequestBody<CreateClassRequest>,
  res: Response,
): Promise<void> => {
  await classService.createClass(req.body);
  res.status(201).send();
};

export const getClasses = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const classes = await classService.getAllClasses();
  res.status(200).json({ data: classes });
};

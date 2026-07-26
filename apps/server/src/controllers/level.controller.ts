import { type Request, type Response } from "express";
import { levelService } from "../services/level.service.ts";

export const getLevels = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const levels = await levelService.getAllLevels();
  res.status(200).json({ data: levels });
};

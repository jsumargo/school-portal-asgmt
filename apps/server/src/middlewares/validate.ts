import type { Request, Response, NextFunction } from "express";
import type { z, ZodType } from "zod";

export const validate = <T extends ZodType>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
};

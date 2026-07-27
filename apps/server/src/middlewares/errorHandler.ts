import { type Request, type Response, type NextFunction } from "express";
import { AppError } from "../errors/AppError.ts";
import z, { ZodError } from "zod";
import { logError, logWarn } from "../utils/logger.ts";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (
    err instanceof SyntaxError &&
    "status" in err &&
    (err as { status?: unknown }).status === 400 &&
    "body" in err
  ) {
    logWarn("Malformed JSON in request body");
    res.status(400).json({ error: "Invalid JSON in request body" });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({ error: z.prettifyError(err) });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  logError("Unhandled error", { error: err });
  res.status(500).json({ error: "Something went wrong." });
};

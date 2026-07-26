import type { Request, Response, NextFunction } from "express";
import { requestContext } from "../context.ts";

export function traceContextMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // req.id is set by pino-http's genReqId — reuse it, don't generate a second one
  requestContext.run({ traceId: req.id as string }, () => {
    next();
  });
}

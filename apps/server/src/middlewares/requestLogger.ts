import { pinoHttp } from "pino-http";
import { randomUUID } from "crypto";
import { logger } from "../lib/logger.ts";
import { nanoid } from "nanoid";

export const requestLogger = pinoHttp({
  logger,
  genReqId: (req, res) => {
    const existingId = req.headers["x-request-id"];
    const id = existingId?.toString() || nanoid(10);
    res.setHeader("x-request-id", id);
    return id;
  },
});

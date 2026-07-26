import { ConflictError, NotFoundError } from "../errors/AppError.ts";
import { Prisma } from "../generated/prisma/client.ts";
import { logError } from "./logger.ts";

export function handlePrismaError(err: unknown, message: string): never {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        throw new ConflictError(message);
      }
      case "P2025":
        throw new NotFoundError(message);
      default:
        logError("Unhandled Prisma error code", {
          code: err.code,
          meta: err.meta,
        });
        throw err;
    }
  }

  logError("Non-Prisma error passed to handlePrismaError", { err });
  throw err;
}

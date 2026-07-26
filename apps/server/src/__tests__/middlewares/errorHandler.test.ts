import { describe, test, expect, vi, beforeEach } from "vitest";
import z, { ZodError } from "zod";
import { errorHandler } from "../../middlewares/errorHandler.ts";
import type { NextFunction, Request, Response } from "express";
import { ConflictError, NotFoundError } from "../../errors/AppError.ts";

const mockReq = (body = {}) => ({ body });
const mockRes = () => ({
  status: vi.fn().mockReturnThis(),
  json: vi.fn().mockReturnThis(),
  send: vi.fn().mockReturnThis(),
});
const mockNext = (): NextFunction => vi.fn();

describe("errorHandler", () => {
  let req: ReturnType<typeof mockReq>;
  let res: ReturnType<typeof mockRes>;
  let next: NextFunction;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    next = mockNext();
  });

  test("should return 400 with message for malformed JSON (SyntaxError)", () => {
    const err = Object.assign(new SyntaxError("Unexpected token"), {
      status: 400,
      body: "invalid",
    });

    errorHandler(err, req as Request, res as unknown as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid JSON in request body",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 400 with prettified error for ZodError", () => {
    const err = new ZodError([]);

    errorHandler(err, req as Request, res as unknown as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: z.prettifyError(err) });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 404 with error message for NotFoundError", () => {
    const err = new NotFoundError("Resource not found");

    errorHandler(err, req as Request, res as unknown as Response, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Resource not found" });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 409 with error message for ConflictError", () => {
    const err = new ConflictError("Already exists");

    errorHandler(err, req as Request, res as unknown as Response, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ error: "Already exists" });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 500 with generic message for unknown errors", () => {
    const err = new Error("Unknown");

    errorHandler(err, req as Request, res as unknown as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong." });
    expect(next).not.toHaveBeenCalled();
  });
});

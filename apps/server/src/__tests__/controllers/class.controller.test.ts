import { describe, expect, test, vi } from "vitest";
import { addClass, getClasses } from "../../controllers/class.controller.ts";
import type { Request, Response } from "express";
import { classService } from "../../services/class.service.ts";

vi.mock("../../services/class.service.ts", () => ({
  classService: {
    createClass: vi.fn(),
    getAllClasses: vi.fn(),
  },
}));

const mockReq = (body = {}) => ({ body });
const mockRes = () => ({
  status: vi.fn().mockReturnThis(),
  json: vi.fn().mockReturnThis(),
  send: vi.fn().mockReturnThis(),
});

describe("addClass", () => {
  test("should return 201 on success", async () => {
    const body = {
      level: "Primary 1",
      name: "Class Name",
      teacherEmail: "teacher@mail.com",
    };
    const req = mockReq(body);
    const res = mockRes();

    vi.mocked(classService.createClass).mockResolvedValue();

    await addClass(req as Request, res as unknown as Response);

    expect(classService.createClass).toHaveBeenCalledWith(body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalled();
  });

  test("should propagate error if service throws", async () => {
    const body = {
      level: "Primary 1",
      name: "Class Name",
      teacherEmail: "teacher@mail.com",
    };
    const req = mockReq(body);
    const res = mockRes();
    const error = new Error("DB error");

    vi.mocked(classService.createClass).mockRejectedValue(error);

    await expect(
      addClass(req as Request, res as unknown as Response),
    ).rejects.toThrow("DB error");
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe("getClasses", () => {
  test("should return 200 with classes data", async () => {
    const req = mockReq();
    const res = mockRes();
    const mockClasses = [
      {
        level: "Primary 1",
        name: "Class Name",
        formTeacher: { name: "Teacher Name" },
      },
    ];

    vi.mocked(classService.getAllClasses).mockResolvedValue(mockClasses);

    await getClasses(req as Request, res as unknown as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: mockClasses });
  });

  test("should return empty array when no classes exist", async () => {
    const req = mockReq();
    const res = mockRes();

    vi.mocked(classService.getAllClasses).mockResolvedValue([]);

    await getClasses(req as Request, res as unknown as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: [] });
  });

  test("should propagate error if service throws", async () => {
    const req = mockReq();
    const res = mockRes();
    const error = new Error("DB error");

    vi.mocked(classService.getAllClasses).mockRejectedValue(error);

    await expect(
      getClasses(req as Request, res as unknown as Response),
    ).rejects.toThrow("DB error");
    expect(res.status).not.toHaveBeenCalled();
  });
});

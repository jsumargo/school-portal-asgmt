import { describe, expect, test, vi } from "vitest";
import type { Request, Response } from "express";
import { teacherService } from "../../services/teacher.service.ts";
import {
  addTeacher,
  getTeachers,
} from "../../controllers/teacher.controller.ts";

vi.mock("../../services/teacher.service.ts", () => ({
  teacherService: {
    createTeacher: vi.fn(),
    getAllTeachers: vi.fn(),
  },
}));

const mockReq = (body = {}) => ({ body });
const mockRes = () => ({
  status: vi.fn().mockReturnThis(),
  json: vi.fn().mockReturnThis(),
  send: vi.fn().mockReturnThis(),
});

describe("addTeacher", () => {
  test("should return 201 on success", async () => {
    const body = {
      name: "Teacher Name",
      subject: "Subject Name",
      email: "teacher@mail.com",
      contactNumber: "88888888",
    };
    const req = mockReq(body);
    const res = mockRes();

    vi.mocked(teacherService.createTeacher).mockResolvedValue();

    await addTeacher(req as Request, res as unknown as Response);

    expect(teacherService.createTeacher).toHaveBeenCalledWith(body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalled();
  });

  test("should propagate error if service throws", async () => {
    const body = {
      name: "Teacher Name",
      subject: "Subject Name",
      email: "teacher@mail.com",
      contactNumber: "88888888",
    };
    const req = mockReq(body);
    const res = mockRes();
    const error = new Error("DB error");

    vi.mocked(teacherService.createTeacher).mockRejectedValue(error);

    await expect(
      addTeacher(req as Request, res as unknown as Response),
    ).rejects.toThrow("DB error");
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe("getTeachers", () => {
  test("should return 200 with teachers data", async () => {
    const req = mockReq();
    const res = mockRes();
    const mockTeachers = [
      {
        name: "Teacher Name",
        subject: "Subject Name",
        email: "teacher@mail.com",
        contactNumber: "88888888",
      },
    ];

    vi.mocked(teacherService.getAllTeachers).mockResolvedValue(mockTeachers);

    await getTeachers(req as Request, res as unknown as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: mockTeachers });
  });

  test("should return empty array when no teachers exist", async () => {
    const req = mockReq();
    const res = mockRes();

    vi.mocked(teacherService.getAllTeachers).mockResolvedValue([]);

    await getTeachers(req as Request, res as unknown as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: [] });
  });

  test("should propagate error if service throws", async () => {
    const req = mockReq();
    const res = mockRes();
    const error = new Error("DB error");

    vi.mocked(teacherService.getAllTeachers).mockRejectedValue(error);

    await expect(
      getTeachers(req as Request, res as unknown as Response),
    ).rejects.toThrow("DB error");
    expect(res.status).not.toHaveBeenCalled();
  });
});

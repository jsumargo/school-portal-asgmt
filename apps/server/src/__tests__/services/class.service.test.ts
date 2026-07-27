import { describe, test, expect, vi, beforeEach } from "vitest";
import { classService } from "../../services/class.service.ts";
import { ConflictError, NotFoundError } from "../../errors/AppError.ts";
import { levelService } from "../../services/level.service.ts";
import { teacherService } from "../../services/teacher.service.ts";
import { prisma } from "../../lib/prisma.ts";
import { handlePrismaError } from "../../utils/handlePrismaError.ts";

vi.mock("../../lib/prisma.ts", () => ({
  prisma: {
    classes: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("../../services/level.service.ts", () => ({
  levelService: {
    getLevelByName: vi.fn(),
  },
}));

vi.mock("../../services/teacher.service.ts", () => ({
  teacherService: {
    getTeacherByEmail: vi.fn(),
  },
}));

vi.mock("../../utils/handlePrismaError.ts", () => ({
  handlePrismaError: vi.fn(),
}));

vi.mock("../../utils/logger.ts", () => ({
  log: vi.fn(),
  logWarn: vi.fn(),
}));

describe("classService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createClass", () => {
    const payload = {
      level: "Primary 1",
      name: "Class Name",
      teacherEmail: "teacher@mail.com",
    };

    const mockLevel = { id: 1, name: "Primary 1" };
    const mockTeacher = {
      id: 2,
      name: "Teacher Name",
      email: "teacher@mail.com",
    };

    test("should create class successfully", async () => {
      vi.mocked(levelService.getLevelByName).mockResolvedValueOnce(mockLevel);
      vi.mocked(teacherService.getTeacherByEmail).mockResolvedValueOnce(
        mockTeacher as any,
      );
      vi.mocked(prisma.classes.findUnique).mockResolvedValueOnce(null);
      vi.mocked(prisma.classes.create).mockResolvedValueOnce({
        id: 1,
        name: "Class Name",
        levelId: 1,
        formTeacherId: 2,
      });

      await expect(classService.createClass(payload)).resolves.toBeUndefined();
      expect(prisma.classes.create).toHaveBeenCalledWith({
        data: { levelId: 1, name: "Class Name", formTeacherId: 2 },
      });
    });

    test("should throw NotFoundError when level not found", async () => {
      vi.mocked(levelService.getLevelByName).mockResolvedValueOnce(null);

      await expect(classService.createClass(payload)).rejects.toThrow(
        NotFoundError,
      );
      expect(teacherService.getTeacherByEmail).not.toHaveBeenCalled();
      expect(prisma.classes.create).not.toHaveBeenCalled();
    });

    test("should throw NotFoundError when teacher not found", async () => {
      vi.mocked(levelService.getLevelByName).mockResolvedValueOnce(mockLevel);
      vi.mocked(teacherService.getTeacherByEmail).mockResolvedValueOnce(null);

      await expect(classService.createClass(payload)).rejects.toThrow(
        NotFoundError,
      );
      expect(prisma.classes.findUnique).not.toHaveBeenCalled();
      expect(prisma.classes.create).not.toHaveBeenCalled();
    });

    test("should throw ConflictError when teacher is already assigned to another class", async () => {
      vi.mocked(levelService.getLevelByName).mockResolvedValueOnce(mockLevel);
      vi.mocked(teacherService.getTeacherByEmail).mockResolvedValueOnce(
        mockTeacher as any,
      );
      vi.mocked(prisma.classes.findUnique).mockResolvedValueOnce({
        id: 99,
        name: "Other Class",
        levelId: 1,
        formTeacherId: 2,
      });

      await expect(classService.createClass(payload)).rejects.toThrow(
        ConflictError,
      );
      expect(prisma.classes.create).not.toHaveBeenCalled();
    });

    test("should call handlePrismaError when class creation throws", async () => {
      const dbError = new Error("DB error");

      vi.mocked(levelService.getLevelByName).mockResolvedValueOnce(mockLevel);
      vi.mocked(teacherService.getTeacherByEmail).mockResolvedValueOnce(
        mockTeacher as any,
      );
      vi.mocked(prisma.classes.findUnique).mockResolvedValueOnce(null);
      vi.mocked(prisma.classes.create).mockRejectedValueOnce(dbError);
      vi.mocked(handlePrismaError).mockImplementationOnce(() => {
        throw new ConflictError(`Class "${payload.name}" already exists`);
      });

      await expect(classService.createClass(payload)).rejects.toThrow(
        ConflictError,
      );
      expect(handlePrismaError).toHaveBeenCalledWith(
        dbError,
        `Class "${payload.name}" already exists`,
      );
    });
  });

  describe("getAllClasses", () => {
    test("should return mapped classes", async () => {
      vi.mocked(prisma.classes.findMany).mockResolvedValueOnce([
        {
          name: "Class Name",
          teachers: { name: "Teacher Name" },
          levels: { name: "Primary 1" },
        },
      ] as any);

      const result = await classService.getAllClasses();

      expect(result).toEqual([
        {
          level: "Primary 1",
          name: "Class Name",
          formTeacher: { name: "Teacher Name" },
        },
      ]);
    });

    test("should return empty array when no classes exist", async () => {
      vi.mocked(prisma.classes.findMany).mockResolvedValueOnce([]);

      const result = await classService.getAllClasses();
      expect(result).toEqual([]);
    });
  });
});

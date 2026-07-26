import { describe, test, expect, vi, beforeEach } from "vitest";
import { teacherService } from "../../services/teacher.service.ts";
import { ConflictError, NotFoundError } from "../../errors/AppError.ts";
import { subjectService } from "../../services/subject.service.ts";
import { prisma } from "../../lib/prisma.ts";
import { handlePrismaError } from "../../utils/handlePrismaError.ts";

vi.mock("../../lib/prisma.ts", () => ({
  prisma: {
    teachers: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("../../services/subject.service.ts", () => ({
  subjectService: {
    getSubjectByName: vi.fn(),
  },
}));

vi.mock("../../utils/handlePrismaError.ts", () => ({
  handlePrismaError: vi.fn(),
}));

vi.mock("../../utils/logger.ts", () => ({
  log: vi.fn(),
  logWarn: vi.fn(),
  logError: vi.fn(),
}));

describe("teacherService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createTeacher", () => {
    const payload = {
      name: "Teacher Name",
      subject: "Subject Name",
      email: "teacher@mail.com",
      contactNumber: "88888888",
    };

    const mockSubject = { id: 1, name: "Subject Name" };

    test("should create teacher successfully", async () => {
      vi.mocked(subjectService.getSubjectByName).mockResolvedValueOnce(
        mockSubject as any,
      );
      vi.mocked(prisma.teachers.create).mockResolvedValueOnce({
        id: 1,
        name: "Teacher Name",
        email: "teacher@mail.com",
        contactNumber: "88888888",
        subjectId: 1,
      } as any);

      await expect(
        teacherService.createTeacher(payload),
      ).resolves.toBeUndefined();
      expect(prisma.teachers.create).toHaveBeenCalledWith({
        data: {
          name: payload.name,
          subjectId: mockSubject.id,
          email: payload.email,
          contactNumber: payload.contactNumber,
        },
      });
    });

    test("should throw NotFoundError when subject not found", async () => {
      vi.mocked(subjectService.getSubjectByName).mockResolvedValueOnce(null);

      await expect(teacherService.createTeacher(payload)).rejects.toThrow(
        NotFoundError,
      );
      expect(prisma.teachers.create).not.toHaveBeenCalled();
    });

    test("should call handlePrismaError when teacher creation throws", async () => {
      const dbError = new Error("DB error");

      vi.mocked(subjectService.getSubjectByName).mockResolvedValueOnce(
        mockSubject as any,
      );
      vi.mocked(prisma.teachers.create).mockRejectedValueOnce(dbError);
      vi.mocked(handlePrismaError).mockImplementationOnce(() => {
        throw new ConflictError(
          `Teacher email "${payload.email}" already exists`,
        );
      });

      await expect(teacherService.createTeacher(payload)).rejects.toThrow(
        ConflictError,
      );
      expect(handlePrismaError).toHaveBeenCalledWith(
        dbError,
        `Teacher email "${payload.email}" already exists`,
      );
    });
  });

  describe("getAllTeachers", () => {
    test("should return mapped teachers", async () => {
      vi.mocked(prisma.teachers.findMany).mockResolvedValueOnce([
        {
          name: "Teacher Name",
          email: "teacher@mail.com",
          contactNumber: "88888888",
          subjects: { name: "Subject Name" },
        },
      ] as any);

      const result = await teacherService.getAllTeachers();

      expect(result).toEqual([
        {
          name: "Teacher Name",
          email: "teacher@mail.com",
          contactNumber: "88888888",
          subject: "Subject Name",
        },
      ]);
    });

    test("should return empty array when no teachers exist", async () => {
      vi.mocked(prisma.teachers.findMany).mockResolvedValueOnce([]);

      const result = await teacherService.getAllTeachers();
      expect(result).toEqual([]);
    });
  });
});

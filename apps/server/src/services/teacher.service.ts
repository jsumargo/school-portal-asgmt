import { ConflictError, NotFoundError } from "../errors/AppError.ts";
import type { CreateTeacherRequest, TeacherData } from "@school-portal/shared";
import { prisma } from "../lib/prisma.ts";
import type { teachers as TeacherRecord } from "../generated/prisma/client.ts";
import { handlePrismaError } from "../utils/handlePrismaError.ts";
import { subjectService } from "./subject.service.ts";
import { log, logError, logWarn } from "../utils/logger.ts";

export const teacherService = {
  async getAllTeachers(): Promise<TeacherData[]> {
    const teachers = await prisma.teachers.findMany({
      select: {
        name: true,
        email: true,
        contactNumber: true,
        subjects: { select: { name: true } },
      },
    });

    return teachers.map(({ subjects, ...rest }) => ({
      ...rest,
      subject: subjects.name,
    }));
  },

  async getTeacherByEmail(email: string): Promise<TeacherRecord | null> {
    return await prisma.teachers.findUnique({ where: { email } });
  },

  async createTeacher(data: CreateTeacherRequest): Promise<void> {
    log("Creating teacher", { email: data.email, subject: data.subject });

    const subject = await subjectService.getSubjectByName(data.subject);
    if (!subject) {
      logWarn("Teacher creation failed: subject not found", {
        subject: data.subject,
      });
      throw new NotFoundError("Subject not found");
    }

    try {
      const teacher = await prisma.teachers.create({
        data: {
          name: data.name,
          subjectId: subject.id,
          email: data.email,
          contactNumber: data.contactNumber,
        },
      });
      log("Teacher created", { teacherId: teacher.id, email: teacher.email });
    } catch (err) {
      logWarn("Teacher creation failed: database error", {
        email: data.email,
      });
      handlePrismaError(err, `Teacher email "${data.email}" already exists`);
    }
  },
};

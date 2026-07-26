import { ConflictError, NotFoundError } from "../errors/AppError.ts";
import type { CreateClassRequest, ClassData } from "@school-portal/shared";
import { prisma } from "../lib/prisma.ts";
import { teacherService } from "./teacher.service.ts";
import type { classes as ClassRecord } from "../generated/prisma/client.ts";
import { handlePrismaError } from "../utils/handlePrismaError.ts";
import { log, logWarn } from "../utils/logger.ts";
import { levelService } from "./level.service.ts";

export const classService = {
  async getAllClasses(): Promise<ClassData[]> {
    const classes = await prisma.classes.findMany({
      select: {
        name: true,
        teachers: { select: { name: true } },
        levels: { select: { name: true } },
      },
    });

    return classes.map(({ teachers, levels, name }) => ({
      level: levels.name,
      name: name,
      formTeacher: { name: teachers.name },
    }));
  },

  async getClassByName(name: string): Promise<ClassRecord | null> {
    return prisma.classes.findUnique({ where: { name } });
  },

  async getClassByFormTeacherId(
    formTeacherId: number,
  ): Promise<ClassRecord | null> {
    return prisma.classes.findUnique({ where: { formTeacherId } });
  },

  async createClass(data: CreateClassRequest): Promise<void> {
    log("Creating class", { name: data.name, teacherEmail: data.teacherEmail });

    // Check if level exists
    const level = await levelService.getLevelByName(data.level);
    if (!level) {
      logWarn("Class creation failed: level not found", {
        level: data.level,
      });
      throw new NotFoundError("Level not found");
    }

    // Check if teacher data exists
    const teacher = await teacherService.getTeacherByEmail(data.teacherEmail);
    if (!teacher) {
      logWarn("Class creation failed: teacher not found", {
        teacherEmail: data.teacherEmail,
      });
      throw new NotFoundError("Teacher not found");
    }

    // Check if teacher is already assigned to another class
    const assignedClass = await this.getClassByFormTeacherId(teacher.id);
    if (assignedClass) {
      logWarn(
        "Class creation failed: teacher already assigned to other class",
        { teacherEmail: data.teacherEmail },
      );
      throw new ConflictError(
        `Teacher "${teacher.name}" is already assigned to Class "${assignedClass.name}"`,
      );
    }

    try {
      const createdClass = await prisma.classes.create({
        data: { levelId: level.id, name: data.name, formTeacherId: teacher.id },
      });
      log("Class created", {
        classId: createdClass.id,
        name: createdClass.name,
      });
    } catch (err) {
      logWarn("Class creation failed: database error", {
        name: data.name,
      });
      handlePrismaError(err, `Class "${data.name}" already exists`);
    }
  },
};

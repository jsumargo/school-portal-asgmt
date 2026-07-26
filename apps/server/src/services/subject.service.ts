import { prisma } from "../lib/prisma.ts";

export const subjectService = {
  async getAllSubjects() {
    return await prisma.subjects.findMany({
      select: { name: true },
      orderBy: { name: "asc" },
    });
  },

  async getSubjectByName(name: string) {
    return await prisma.subjects.findUnique({ where: { name } });
  },
};

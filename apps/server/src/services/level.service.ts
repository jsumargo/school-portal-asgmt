import { prisma } from "../lib/prisma.ts";

export const levelService = {
  async getAllLevels() {
    return await prisma.levels.findMany({
      select: { name: true },
      orderBy: { name: "asc" },
    });
  },

  async getLevelByName(name: string) {
    return await prisma.levels.findUnique({ where: { name } });
  },
};

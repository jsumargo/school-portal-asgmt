import { prisma } from "../src/lib/prisma.ts";

const SUBJECT_LIST = [
  "English Language",
  "Mother Tongue Language",
  "Mathematics",
  "Science",
  "Art",
  "Music",
  "Physical Education",
  "Social Studies",
  "Character and Citizenship Education",
];

const CLASS_LEVEL = [
  "Primary 1",
  "Primary 2",
  "Primary 3",
  "Primary 4",
  "Primary 5",
  "Primary 6",
];

async function main() {
  await Promise.all(
    SUBJECT_LIST.map((name) =>
      prisma.subjects.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  await Promise.all(
    CLASS_LEVEL.map((name) =>
      prisma.levels.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

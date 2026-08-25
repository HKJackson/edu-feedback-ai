import { PrismaClient, UserRole } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash("123456", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@edu.local" },
    update: {},
    create: {
      email: "admin@edu.local",
      name: "管理员",
      role: UserRole.ADMIN,
      password,
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: "teacher@edu.local" },
    update: {},
    create: {
      email: "teacher@edu.local",
      name: "张老师",
      role: UserRole.TEACHER,
      password,
    },
  });

  const parentUser = await prisma.user.upsert({
    where: { email: "parent@edu.local" },
    update: {},
    create: {
      email: "parent@edu.local",
      name: "家长",
      role: UserRole.PARENT,
      password,
    },
  });

  const student = await prisma.student.upsert({
    where: { id: "seed-student" },
    update: {},
    create: {
      id: "seed-student",
      name: "王小明",
      notes: "示例学生",
    },
  });

  await prisma.parentStudent.upsert({
    where: {
      parentId_studentId: {
        parentId: parentUser.id,
        studentId: student.id,
      },
    },
    update: {},
    create: {
      parentId: parentUser.id,
      studentId: student.id,
    },
  });

  await prisma.class.upsert({
    where: { id: "seed-class" },
    update: {},
    create: {
      id: "seed-class",
      name: "三年级奥数班",
      type: "OLYMPIAD_MATH",
      description: "示例班级",
    },
  });

  await prisma.classEnrollment.upsert({
    where: {
      studentId_classId: {
        studentId: student.id,
        classId: "seed-class",
      },
    },
    update: {},
    create: {
      studentId: student.id,
      classId: "seed-class",
    },
  });

  console.log({ admin, teacher, parentUser, student });
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

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";

export async function createStudent(formData: FormData) {
  const name = formData.get("name") as string;
  const notes = formData.get("notes") as string;
  const parentEmail = formData.get("parentEmail") as string;
  const parentName = formData.get("parentName") as string;
  const classIds = formData.getAll("classIds") as string[];

  const student = await prisma.student.create({
    data: {
      name,
      notes: notes || null,
    },
  });

  if (classIds.length > 0) {
    await prisma.classEnrollment.createMany({
      data: classIds.map((classId) => ({
        studentId: student.id,
        classId,
      })),
    });
  }

  if (parentEmail) {
    const password = await bcrypt.hash("123456", 10);
    const parent = await prisma.user.upsert({
      where: { email: parentEmail },
      update: {},
      create: {
        email: parentEmail,
        name: parentName || "家长",
        role: UserRole.PARENT,
        password,
      },
    });

    await prisma.parentStudent.create({
      data: {
        parentId: parent.id,
        studentId: student.id,
      },
    });
  }

  revalidatePath("/teacher/students");
  redirect("/teacher/students");
}

export async function updateStudent(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const notes = formData.get("notes") as string;
  const classIds = formData.getAll("classIds") as string[];

  await prisma.student.update({
    where: { id },
    data: {
      name,
      notes: notes || null,
    },
  });

  await prisma.classEnrollment.deleteMany({
    where: { studentId: id },
  });

  if (classIds.length > 0) {
    await prisma.classEnrollment.createMany({
      data: classIds.map((classId) => ({
        studentId: id,
        classId,
      })),
    });
  }

  revalidatePath("/teacher/students");
  redirect("/teacher/students");
}

export async function deleteStudent(id: string) {
  await prisma.student.delete({ where: { id } });
  revalidatePath("/teacher/students");
}

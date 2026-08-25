"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ClassType } from "@prisma/client";

export async function createClass(formData: FormData) {
  const name = formData.get("name") as string;
  const type = formData.get("type") as ClassType;
  const description = formData.get("description") as string;

  await prisma.class.create({
    data: {
      name,
      type,
      description: description || null,
    },
  });

  revalidatePath("/teacher/classes");
  redirect("/teacher/classes");
}

export async function updateClass(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const type = formData.get("type") as ClassType;
  const description = formData.get("description") as string;

  await prisma.class.update({
    where: { id },
    data: {
      name,
      type,
      description: description || null,
    },
  });

  revalidatePath("/teacher/classes");
  redirect("/teacher/classes");
}

export async function deleteClass(id: string) {
  await prisma.class.delete({ where: { id } });
  revalidatePath("/teacher/classes");
}

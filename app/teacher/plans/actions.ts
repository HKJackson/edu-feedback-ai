"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function createLearningPlan(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const studentId = formData.get("studentId") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const startDate = new Date(formData.get("startDate") as string);
  const endDate = new Date(formData.get("endDate") as string);

  await prisma.learningPlan.create({
    data: {
      studentId,
      title,
      content,
      startDate,
      endDate,
      teacherId: session.user.id,
    },
  });

  revalidatePath("/teacher/plans");
  revalidatePath("/parent");
  redirect("/teacher/plans");
}

export async function deleteLearningPlan(id: string) {
  await prisma.learningPlan.delete({ where: { id } });
  revalidatePath("/teacher/plans");
  revalidatePath("/parent");
}

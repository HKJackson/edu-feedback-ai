"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function createFeedback(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const studentId = formData.get("studentId") as string;
  const classId = formData.get("classId") as string;
  const keyPoints = formData.get("keyPoints") as string;
  const aiSummary = formData.get("aiSummary") as string;
  const isPublished = formData.get("isPublished") === "on";

  await prisma.dailyFeedback.create({
    data: {
      studentId,
      classId,
      keyPoints,
      aiSummary: aiSummary || null,
      isPublished,
      teacherId: session.user.id,
    },
  });

  revalidatePath("/teacher/feedback");
  revalidatePath("/parent");
  redirect("/teacher/feedback");
}

export async function deleteFeedback(id: string) {
  await prisma.dailyFeedback.delete({ where: { id } });
  revalidatePath("/teacher/feedback");
  revalidatePath("/parent");
}

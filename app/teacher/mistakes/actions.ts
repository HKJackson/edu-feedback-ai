"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { PracticeSource } from "@prisma/client";

export async function createMistake(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const studentId = formData.get("studentId") as string;
  const classId = formData.get("classId") as string;
  const subject = formData.get("subject") as string;
  const content = formData.get("content") as string;
  const reason = formData.get("reason") as string;
  const knowledgeTag = formData.get("knowledgeTag") as string;
  const aiVariation = formData.get("aiVariation") as string;
  const publishVariation = formData.get("publishVariation") === "on";

  const mistake = await prisma.mistake.create({
    data: {
      studentId,
      classId: classId || null,
      subject,
      content,
      reason: reason || null,
      knowledgeTag: knowledgeTag || null,
      aiVariation: aiVariation || null,
      isVariationUsed: publishVariation,
      teacherId: session.user.id,
    },
  });

  if (publishVariation && aiVariation) {
    await prisma.practice.create({
      data: {
        studentId,
        classId: classId || null,
        title: `${subject} 变式练习`,
        content: aiVariation,
        source: PracticeSource.AI_VARIATION,
        sourceId: mistake.id,
        isPublished: true,
        teacherId: session.user.id,
      },
    });
  }

  revalidatePath("/teacher/mistakes");
  revalidatePath("/parent");
  redirect("/teacher/mistakes");
}

export async function deleteMistake(id: string) {
  await prisma.mistake.delete({ where: { id } });
  revalidatePath("/teacher/mistakes");
  revalidatePath("/parent");
}

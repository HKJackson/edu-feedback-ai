import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateLearningPlan } from "@/lib/ai";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { studentId } = await req.json();

    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const [feedbacks, mistakes] = await Promise.all([
      prisma.dailyFeedback.findMany({
        where: { studentId },
        orderBy: { date: "desc" },
        take: 10,
        select: { keyPoints: true, date: true },
      }),
      prisma.mistake.findMany({
        where: { studentId },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { content: true, subject: true, knowledgeTag: true },
      }),
    ]);

    const plan = await generateLearningPlan(student.name, feedbacks, mistakes);
    return NextResponse.json({ plan });
  } catch (error) {
    console.error("AI learning plan error:", error);
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}

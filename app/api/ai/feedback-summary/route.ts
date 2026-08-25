import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateFeedbackSummary } from "@/lib/ai";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { keyPoints, studentName, className } = await req.json();
    const summary = await generateFeedbackSummary(keyPoints, studentName, className);
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("AI feedback summary error:", error);
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateMistakeVariations } from "@/lib/ai";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { content, subject, count } = await req.json();
    const variations = await generateMistakeVariations(content, subject, count);
    return NextResponse.json({ variations });
  } catch (error) {
    console.error("AI mistake variations error:", error);
    return NextResponse.json({ error: "Failed to generate variations" }, { status: 500 });
  }
}

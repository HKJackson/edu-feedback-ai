import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackForm } from "./feedback-form";

export default async function NewFeedbackPage() {
  const [students, classes] = await Promise.all([
    prisma.student.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.class.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">新建课堂反馈</h1>
        <p className="text-muted-foreground">填写要点，使用 AI 生成给家长的完整反馈</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>反馈内容</CardTitle>
        </CardHeader>
        <CardContent>
          <FeedbackForm students={students} classes={classes} />
        </CardContent>
      </Card>
    </div>
  );
}

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { DeleteFeedbackButton } from "./delete-button";

export default async function FeedbackPage() {
  const feedbacks = await prisma.dailyFeedback.findMany({
    orderBy: { date: "desc" },
    include: {
      student: true,
      class: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">课堂反馈</h1>
          <p className="text-muted-foreground">记录每次课情况，AI 辅助生成家长反馈</p>
        </div>
        <Button asChild>
          <Link href="/teacher/feedback/new">
            <Plus className="mr-2 h-4 w-4" />
            新建反馈
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {feedbacks.map((feedback) => (
          <Card key={feedback.id}>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-base">
                  {feedback.student.name} · {feedback.class.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {feedback.date.toISOString().split("T")[0]}
                  </span>
                  {feedback.isPublished ? (
                    <Badge variant="default">已发布</Badge>
                  ) : (
                    <Badge variant="outline">草稿</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">课堂要点</p>
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground">{feedback.keyPoints}</p>
                </div>
                {feedback.aiSummary && (
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-sm font-medium">AI 反馈总结</p>
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">{feedback.aiSummary}</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <DeleteFeedbackButton id={feedback.id} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {feedbacks.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">暂无反馈，点击右上角新建。</p>
      )}
    </div>
  );
}

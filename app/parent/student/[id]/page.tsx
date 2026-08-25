import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Lightbulb, Target, FileText } from "lucide-react";

export default async function ParentStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const student = await prisma.student.findFirst({
    where: {
      id,
      parentStudents: {
        some: {
          parentId: session?.user?.id,
        },
      },
    },
    include: {
      enrollments: {
        include: { class: true },
      },
      feedbacks: {
        where: { isPublished: true },
        orderBy: { date: "desc" },
        include: { class: true },
      },
      mistakes: {
        orderBy: { createdAt: "desc" },
        include: { class: true },
      },
      practices: {
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        include: { class: true },
      },
      learningPlans: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!student) notFound();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">{student.name}</h2>
        <p className="text-sm text-muted-foreground">
          班级：{student.enrollments.map((e) => e.class.name).join("、") || "未分班"}
        </p>
      </div>

      <Tabs defaultValue="feedback" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="feedback">
            <BookOpen className="mr-1 h-4 w-4" />
            反馈
          </TabsTrigger>
          <TabsTrigger value="mistakes">
            <Lightbulb className="mr-1 h-4 w-4" />
            错题
          </TabsTrigger>
          <TabsTrigger value="practices">
            <FileText className="mr-1 h-4 w-4" />
            练习
          </TabsTrigger>
          <TabsTrigger value="plans">
            <Target className="mr-1 h-4 w-4" />
            规划
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feedback" className="space-y-3">
          {student.feedbacks.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">暂无课堂反馈</p>
          ) : (
            student.feedbacks.map((feedback) => (
              <Card key={feedback.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      {feedback.class.name}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground">
                      {feedback.date.toISOString().split("T")[0]}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm">{feedback.aiSummary || feedback.keyPoints}</p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="mistakes" className="space-y-3">
          {student.mistakes.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">暂无错题记录</p>
          ) : (
            student.mistakes.map((mistake) => (
              <Card key={mistake.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{mistake.subject}</CardTitle>
                    {mistake.class && (
                      <Badge variant="secondary">{mistake.class.name}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="whitespace-pre-wrap text-sm">{mistake.content}</p>
                  {mistake.reason && (
                    <p className="text-xs text-muted-foreground">原因：{mistake.reason}</p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="practices" className="space-y-3">
          {student.practices.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">暂无练习题</p>
          ) : (
            student.practices.map((practice) => (
              <Card key={practice.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{practice.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm">{practice.content}</p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="plans" className="space-y-3">
          {student.learningPlans.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">暂无学习规划</p>
          ) : (
            student.learningPlans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{plan.title}</CardTitle>
                    <span className="text-xs text-muted-foreground">
                      {plan.startDate.toISOString().split("T")[0]} ~{" "}
                      {plan.endDate.toISOString().split("T")[0]}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm">{plan.content}</p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

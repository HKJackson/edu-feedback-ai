import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanForm } from "./plan-form";

export default async function NewPlanPage() {
  const students = await prisma.student.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">生成学习规划</h1>
        <p className="text-muted-foreground">AI 基于学生反馈和错题生成个性化计划</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>规划信息</CardTitle>
        </CardHeader>
        <CardContent>
          <PlanForm students={students} />
        </CardContent>
      </Card>
    </div>
  );
}

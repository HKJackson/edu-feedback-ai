import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DeletePlanButton } from "./delete-button";

export default async function PlansPage() {
  const plans = await prisma.learningPlan.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      student: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">学习规划</h1>
          <p className="text-muted-foreground">基于反馈和错题，AI 生成个性化学习计划</p>
        </div>
        <Button asChild>
          <Link href="/teacher/plans/new">
            <Plus className="mr-2 h-4 w-4" />
            生成规划
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-base">{plan.title}</CardTitle>
                <span className="text-sm text-muted-foreground">
                  {plan.startDate.toISOString().split("T")[0]} ~{" "}
                  {plan.endDate.toISOString().split("T")[0]}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">学生：{plan.student.name}</p>
              <div className="mt-3 rounded-md bg-muted p-3">
                <p className="whitespace-pre-wrap text-sm">{plan.content}</p>
              </div>
              <div className="mt-4 flex justify-end">
                <DeletePlanButton id={plan.id} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {plans.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">暂无学习规划，点击右上角生成。</p>
      )}
    </div>
  );
}

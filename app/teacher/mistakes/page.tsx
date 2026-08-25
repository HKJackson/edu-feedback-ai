import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { DeleteMistakeButton } from "./delete-button";

export default async function MistakesPage() {
  const mistakes = await prisma.mistake.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      student: true,
      class: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">错题管理</h1>
          <p className="text-muted-foreground">登记错题，AI 生成变式练习</p>
        </div>
        <Button asChild>
          <Link href="/teacher/mistakes/new">
            <Plus className="mr-2 h-4 w-4" />
            登记错题
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {mistakes.map((mistake) => (
          <Card key={mistake.id}>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-base">
                  {mistake.student.name} · {mistake.subject}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {mistake.class && (
                    <Badge variant="secondary">{mistake.class.name}</Badge>
                  )}
                  {mistake.isVariationUsed ? (
                    <Badge>已生成练习</Badge>
                  ) : (
                    <Badge variant="outline">未生成练习</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">原题</p>
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground">{mistake.content}</p>
                </div>
                {mistake.reason && (
                  <div>
                    <p className="text-sm font-medium">错误原因</p>
                    <p className="text-sm text-muted-foreground">{mistake.reason}</p>
                  </div>
                )}
                {mistake.aiVariation && (
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-sm font-medium">AI 变式题</p>
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">{mistake.aiVariation}</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <DeleteMistakeButton id={mistake.id} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mistakes.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">暂无错题，点击右上角登记。</p>
      )}
    </div>
  );
}

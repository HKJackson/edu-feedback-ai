import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MistakeForm } from "./mistake-form";

export default async function NewMistakePage() {
  const [students, classes] = await Promise.all([
    prisma.student.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.class.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">登记错题</h1>
        <p className="text-muted-foreground">记录错题，使用 AI 生成同类变式练习</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>错题信息</CardTitle>
        </CardHeader>
        <CardContent>
          <MistakeForm students={students} classes={classes} />
        </CardContent>
      </Card>
    </div>
  );
}

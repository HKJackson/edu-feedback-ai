import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function TeacherDashboard() {
  const [classCount, studentCount, feedbackCount, mistakeCount] = await Promise.all([
    prisma.class.count(),
    prisma.student.count(),
    prisma.dailyFeedback.count(),
    prisma.mistake.count(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">老师工作台</h1>
        <p className="text-muted-foreground">欢迎使用教培反馈与 AI 辅助系统</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>班级数量</CardDescription>
            <CardTitle className="text-3xl">{classCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">托管班 / 习题班 / C++ / 奥数</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>学生数量</CardDescription>
            <CardTitle className="text-3xl">{studentCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">已录入系统的学生</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>反馈记录</CardDescription>
            <CardTitle className="text-3xl">{feedbackCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">课堂反馈条数</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>错题记录</CardDescription>
            <CardTitle className="text-3xl">{mistakeCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">已登记错题数</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

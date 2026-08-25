import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

export default async function ParentDashboard() {
  const session = await auth();

  const students = await prisma.student.findMany({
    where: {
      parentStudents: {
        some: {
          parentId: session?.user?.id,
        },
      },
    },
    include: {
      enrollments: {
        include: {
          class: true,
        },
      },
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">我的孩子</h2>
        <p className="text-sm text-muted-foreground">点击孩子查看反馈与错题</p>
      </div>

      {students.length === 0 ? (
        <p className="text-sm text-muted-foreground">暂无可查看的孩子，请联系老师绑定。</p>
      ) : (
        <div className="space-y-3">
          {students.map((student) => (
            <Link key={student.id} href={`/parent/student/${student.id}`}>
              <Card className="transition-colors hover:bg-accent">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-lg">
                    {student.name}
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    班级：{student.enrollments.map((e) => e.class.name).join("、") || "未分班"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

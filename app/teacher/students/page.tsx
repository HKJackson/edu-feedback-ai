import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { classTypeLabels } from "@/lib/class-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { DeleteStudentButton } from "./delete-button";

export default async function StudentsPage() {
  const students = await prisma.student.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      enrollments: {
        include: { class: true },
      },
      parentStudents: {
        include: { parent: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">学生管理</h1>
          <p className="text-muted-foreground">录入学生、分班、绑定家长</p>
        </div>
        <Button asChild>
          <Link href="/teacher/students/new">
            <Plus className="mr-2 h-4 w-4" />
            新建学生
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {students.map((student) => (
          <Card key={student.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{student.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {student.enrollments.map((e) => (
                    <Badge key={e.id} variant="secondary">
                      {classTypeLabels[e.class.type]}
                    </Badge>
                  ))}
                  {student.enrollments.length === 0 && (
                    <span className="text-sm text-muted-foreground">未分班</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  家长：{student.parentStudents.map((p) => p.parent.email).join("、") || "未绑定"}
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href={`/teacher/students/${student.id}/edit`}>编辑</Link>
                </Button>
                <DeleteStudentButton id={student.id} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {students.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">暂无学生，点击右上角新建。</p>
      )}
    </div>
  );
}

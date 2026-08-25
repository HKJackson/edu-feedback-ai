import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateStudent } from "../../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export default async function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      enrollments: true,
      parentStudents: { include: { parent: true } },
    },
  });

  if (!student) notFound();

  const classes = await prisma.class.findMany({ orderBy: { createdAt: "desc" } });
  const enrolledClassIds = new Set(student.enrollments.map((e) => e.classId));
  const parent = student.parentStudents[0]?.parent;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">编辑学生</h1>
        <p className="text-muted-foreground">修改学生信息</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>学生信息</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateStudent.bind(null, id)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">学生姓名</Label>
              <Input id="name" name="name" defaultValue={student.name} required />
            </div>

            <div className="space-y-2">
              <Label>所属班级</Label>
              <div className="space-y-2 rounded-md border p-3">
                {classes.map((cls) => (
                  <div key={cls.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`class-${cls.id}`}
                      name="classIds"
                      value={cls.id}
                      defaultChecked={enrolledClassIds.has(cls.id)}
                    />
                    <Label htmlFor={`class-${cls.id}`} className="text-sm font-normal">
                      {cls.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">备注（可选）</Label>
              <Textarea id="notes" name="notes" defaultValue={student.notes || ""} />
            </div>

            {parent && (
              <div className="rounded-md bg-muted p-3 text-sm">
                <p className="font-medium">已绑定家长</p>
                <p className="text-muted-foreground">{parent.email}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1">保存</Button>
              <Button variant="outline" asChild>
                <Link href="/teacher/students">取消</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

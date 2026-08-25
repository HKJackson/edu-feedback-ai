import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createStudent } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export default async function NewStudentPage() {
  const classes = await prisma.class.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">新建学生</h1>
        <p className="text-muted-foreground">录入学生信息并绑定班级、家长</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>学生信息</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createStudent} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">学生姓名</Label>
              <Input id="name" name="name" placeholder="例如：王小明" required />
            </div>

            <div className="space-y-2">
              <Label>所属班级</Label>
              <div className="space-y-2 rounded-md border p-3">
                {classes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">暂无班级，请先创建班级。</p>
                ) : (
                  classes.map((cls) => (
                    <div key={cls.id} className="flex items-center gap-2">
                      <Checkbox id={`class-${cls.id}`} name="classIds" value={cls.id} />
                      <Label htmlFor={`class-${cls.id}`} className="text-sm font-normal">
                        {cls.name}
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentEmail">家长邮箱</Label>
              <Input id="parentEmail" name="parentEmail" type="email" placeholder="用于家长端登录" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentName">家长称呼（可选）</Label>
              <Input id="parentName" name="parentName" placeholder="例如：王先生" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">备注（可选）</Label>
              <Textarea id="notes" name="notes" placeholder="学生特点、学习情况等" />
            </div>

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

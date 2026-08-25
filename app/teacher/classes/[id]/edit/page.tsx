import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateClass } from "../../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { classTypeOptions } from "@/lib/class-types";

export default async function EditClassPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cls = await prisma.class.findUnique({ where: { id } });

  if (!cls) notFound();

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">编辑班级</h1>
        <p className="text-muted-foreground">修改班级信息</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>班级信息</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateClass.bind(null, id)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">班级名称</Label>
              <Input id="name" name="name" defaultValue={cls.name} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">班级类型</Label>
              <Select name="type" required defaultValue={cls.type}>
                <SelectTrigger>
                  <SelectValue placeholder="选择班级类型" />
                </SelectTrigger>
                <SelectContent>
                  {classTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">描述（可选）</Label>
              <Textarea id="description" name="description" defaultValue={cls.description || ""} />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1">保存</Button>
              <Button variant="outline" asChild>
                <Link href="/teacher/classes">取消</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

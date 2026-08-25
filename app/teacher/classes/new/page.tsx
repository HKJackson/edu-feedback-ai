import Link from "next/link";
import { createClass } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { classTypeOptions } from "@/lib/class-types";

export default function NewClassPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">新建班级</h1>
        <p className="text-muted-foreground">填写班级基本信息</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>班级信息</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createClass} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">班级名称</Label>
              <Input id="name" name="name" placeholder="例如：三年级奥数班" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">班级类型</Label>
              <Select name="type" required defaultValue="OLYMPIAD_MATH">
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
              <Textarea id="description" name="description" placeholder="班级简介、上课时间等" />
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

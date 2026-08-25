import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { classTypeLabels } from "@/lib/class-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { DeleteClassButton } from "./delete-button";

export default async function ClassesPage() {
  const classes = await prisma.class.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">班级管理</h1>
          <p className="text-muted-foreground">管理托管班、习题班、C++ 班、奥数班</p>
        </div>
        <Button asChild>
          <Link href="/teacher/classes/new">
            <Plus className="mr-2 h-4 w-4" />
            新建班级
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <Card key={cls.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{cls.name}</CardTitle>
                <Badge variant="secondary">{classTypeLabels[cls.type]}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {cls.description || "暂无描述"}
              </p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href={`/teacher/classes/${cls.id}/edit`}>编辑</Link>
                </Button>
                <DeleteClassButton id={cls.id} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {classes.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">暂无班级，点击右上角新建。</p>
      )}
    </div>
  );
}

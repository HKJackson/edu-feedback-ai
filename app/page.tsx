import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">EduFeedback AI</CardTitle>
          <CardDescription>
            教培机构课堂反馈与 AI 辅助系统
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/login">老师/管理员登录</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/parent/login">家长登录</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { createFeedback } from "../actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

interface FeedbackFormProps {
  students: { id: string; name: string }[];
  classes: { id: string; name: string }[];
}

export function FeedbackForm({ students, classes }: FeedbackFormProps) {
  const [studentId, setStudentId] = useState("");
  const [classId, setClassId] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selectedStudent = students.find((s) => s.id === studentId);
  const selectedClass = classes.find((c) => c.id === classId);

  const handleGenerate = async () => {
    if (!studentId || !classId || !keyPoints.trim()) {
      toast.error("请先选择学生、班级并填写课堂要点");
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch("/api/ai/feedback-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyPoints,
          studentName: selectedStudent?.name,
          className: selectedClass?.name,
        }),
      });

      if (!res.ok) throw new Error("生成失败");
      const data = await res.json();
      setAiSummary(data.summary);
      toast.success("反馈总结已生成");
    } catch {
      toast.error("生成失败，请检查 AI Key 配置");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    await createFeedback(formData);
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="studentId">学生</Label>
          <Select name="studentId" value={studentId} onValueChange={(v) => setStudentId(v || "")} required>
            <SelectTrigger>
              <SelectValue placeholder="选择学生" />
            </SelectTrigger>
            <SelectContent>
              {students.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="classId">班级</Label>
          <Select name="classId" value={classId} onValueChange={(v) => setClassId(v || "")} required>
            <SelectTrigger>
              <SelectValue placeholder="选择班级" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="keyPoints">课堂要点</Label>
        <Textarea
          id="keyPoints"
          name="keyPoints"
          value={keyPoints}
          onChange={(e) => setKeyPoints(e.target.value)}
          placeholder="例如：今天学习了鸡兔同笼，小明开始理解假设法，但计算步骤容易出错，回家需要多练习"
          rows={4}
          required
        />
      </div>

      <input type="hidden" name="aiSummary" value={aiSummary} />

      <Button
        type="button"
        variant="outline"
        onClick={handleGenerate}
        disabled={generating}
        className="w-full"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        {generating ? "AI 生成中..." : "AI 生成反馈总结"}
      </Button>

      {aiSummary && (
        <div className="space-y-2 rounded-md bg-muted p-3">
          <Label>AI 生成的反馈总结（可修改）</Label>
          <Textarea
            value={aiSummary}
            onChange={(e) => setAiSummary(e.target.value)}
            rows={6}
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <Checkbox id="isPublished" name="isPublished" defaultChecked />
        <Label htmlFor="isPublished" className="text-sm font-normal">
          发布给家长查看
        </Label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="flex-1" disabled={submitting}>
          {submitting ? "保存中..." : "保存反馈"}
        </Button>
        <Button variant="outline" asChild>
          <Link href="/teacher/feedback">取消</Link>
        </Button>
      </div>
    </form>
  );
}

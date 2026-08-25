"use client";

import { useState } from "react";
import Link from "next/link";
import { createLearningPlan } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

interface PlanFormProps {
  students: { id: string; name: string }[];
}

export function PlanForm({ students }: PlanFormProps) {
  const [studentId, setStudentId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selectedStudent = students.find((s) => s.id === studentId);

  const handleGenerate = async () => {
    if (!studentId) {
      toast.error("请先选择学生");
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch("/api/ai/learning-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
      });

      if (!res.ok) throw new Error("生成失败");
      const data = await res.json();
      setContent(data.plan);
      if (!title) {
        setTitle(`${selectedStudent?.name} 的个性化学习规划`);
      }
      toast.success("学习规划已生成");
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
    await createLearningPlan(formData);
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate">开始日期</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">结束日期</Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">规划标题</Label>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例如：王小明的两周数学提升计划"
          required
        />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleGenerate}
        disabled={generating}
        className="w-full"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        {generating ? "AI 生成中..." : "AI 生成学习规划"}
      </Button>

      <div className="space-y-2">
        <Label htmlFor="content">规划内容</Label>
        <Textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="点击上方按钮，根据学生近期的课堂反馈和错题自动生成"
          rows={10}
          required
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="flex-1" disabled={submitting}>
          {submitting ? "保存中..." : "保存规划"}
        </Button>
        <Button variant="outline" asChild>
          <Link href="/teacher/plans">取消</Link>
        </Button>
      </div>
    </form>
  );
}

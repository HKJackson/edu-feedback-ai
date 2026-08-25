"use client";

import { useState } from "react";
import Link from "next/link";
import { createMistake } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

interface MistakeFormProps {
  students: { id: string; name: string }[];
  classes: { id: string; name: string }[];
}

export function MistakeForm({ students, classes }: MistakeFormProps) {
  const [studentId, setStudentId] = useState("");
  const [classId, setClassId] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [aiVariation, setAiVariation] = useState("");
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleGenerate = async () => {
    if (!subject.trim() || !content.trim()) {
      toast.error("请先填写学科/知识点和原题");
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch("/api/ai/mistake-variations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, subject, count: 2 }),
      });

      if (!res.ok) throw new Error("生成失败");
      const data = await res.json();
      setAiVariation(data.variations);
      toast.success("变式题已生成");
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
    await createMistake(formData);
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
          <Label htmlFor="classId">班级（可选）</Label>
          <Select name="classId" value={classId} onValueChange={(v) => setClassId(v || "")}>
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="subject">学科 / 知识点</Label>
          <Input
            id="subject"
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="例如：鸡兔同笼"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="knowledgeTag">知识标签（可选）</Label>
          <Input id="knowledgeTag" name="knowledgeTag" placeholder="例如：假设法" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">原题内容</Label>
        <Textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="完整输入学生做错的题目"
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">错误原因（可选）</Label>
        <Input id="reason" name="reason" placeholder="例如：计算步骤出错" />
      </div>

      <input type="hidden" name="aiVariation" value={aiVariation} />

      <Button
        type="button"
        variant="outline"
        onClick={handleGenerate}
        disabled={generating}
        className="w-full"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        {generating ? "AI 生成中..." : "AI 生成变式题"}
      </Button>

      {aiVariation && (
        <div className="space-y-2 rounded-md bg-muted p-3">
          <Label>AI 生成的变式题（可修改）</Label>
          <Textarea
            value={aiVariation}
            onChange={(e) => setAiVariation(e.target.value)}
            rows={6}
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <Checkbox id="publishVariation" name="publishVariation" defaultChecked />
        <Label htmlFor="publishVariation" className="text-sm font-normal">
          同时发布为练习题给学生
        </Label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="flex-1" disabled={submitting}>
          {submitting ? "保存中..." : "保存错题"}
        </Button>
        <Button variant="outline" asChild>
          <Link href="/teacher/mistakes">取消</Link>
        </Button>
      </div>
    </form>
  );
}

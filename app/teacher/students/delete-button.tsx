"use client";

import { useTransition } from "react";
import { deleteStudent } from "./actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export function DeleteStudentButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (!confirm("确定要删除这个学生吗？相关记录将一并删除。")) return;
        startTransition(async () => {
          await deleteStudent(id);
          toast.success("学生已删除");
        });
      }}
      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

"use client";

import { useTransition } from "react";
import { deleteLearningPlan } from "./actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export function DeletePlanButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (!confirm("确定要删除这份学习规划吗？")) return;
        startTransition(async () => {
          await deleteLearningPlan(id);
          toast.success("学习规划已删除");
        });
      }}
      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
    >
      <Trash2 className="mr-2 h-4 w-4" />
      删除
    </Button>
  );
}

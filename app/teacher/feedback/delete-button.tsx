"use client";

import { useTransition } from "react";
import { deleteFeedback } from "./actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export function DeleteFeedbackButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (!confirm("确定要删除这条反馈吗？")) return;
        startTransition(async () => {
          await deleteFeedback(id);
          toast.success("反馈已删除");
        });
      }}
      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
    >
      <Trash2 className="mr-2 h-4 w-4" />
      删除
    </Button>
  );
}

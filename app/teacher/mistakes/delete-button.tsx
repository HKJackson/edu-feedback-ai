"use client";

import { useTransition } from "react";
import { deleteMistake } from "./actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export function DeleteMistakeButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (!confirm("确定要删除这道错题吗？")) return;
        startTransition(async () => {
          await deleteMistake(id);
          toast.success("错题已删除");
        });
      }}
      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
    >
      <Trash2 className="mr-2 h-4 w-4" />
      删除
    </Button>
  );
}

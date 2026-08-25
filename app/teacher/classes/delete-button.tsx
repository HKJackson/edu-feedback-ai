"use client";

import { useTransition } from "react";
import { deleteClass } from "./actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export function DeleteClassButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (!confirm("确定要删除这个班级吗？相关记录将保留。")) return;
        startTransition(async () => {
          await deleteClass(id);
          toast.success("班级已删除");
        });
      }}
      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

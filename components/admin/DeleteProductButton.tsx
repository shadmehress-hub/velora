"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteProductAction } from "@/lib/actions/admin.action";

function DeleteProductButton({ productId }: { productId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }

    startTransition(async () => {
      await deleteProductAction(productId);
      setConfirming(false);
    });
  };

  return (
    <Button
      type="button"
      variant={confirming ? "destructive" : "ghost"}
      size="xs"
      disabled={isPending}
      onClick={handleDelete}
      className="gap-1"
    >
      {isPending ? (
        <Loader2 className="size-3 animate-spin" />
      ) : (
        <Trash2 className="size-3" />
      )}
      <span>{confirming ? "تایید حذف؟" : "حذف"}</span>
    </Button>
  );
}

export default DeleteProductButton;

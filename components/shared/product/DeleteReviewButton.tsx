"use client";

import { useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteReviewAction } from "@/lib/actions/review.action";

function DeleteReviewButton({ reviewId }: { reviewId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      disabled={isPending}
      aria-label="حذف دیدگاه"
      onClick={() =>
        startTransition(async () => {
          await deleteReviewAction(reviewId);
        })
      }
      className="text-muted-foreground hover:text-destructive"
    >
      {isPending ? (
        <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
      ) : (
        <Trash2 className="size-3.5" aria-hidden="true" />
      )}
    </Button>
  );
}

export default DeleteReviewButton;

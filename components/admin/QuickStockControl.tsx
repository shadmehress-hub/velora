"use client";

import { useTransition } from "react";
import { Loader2, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { adjustProductStockAction } from "@/lib/actions/admin.action";
import { cn, formatNumber } from "@/lib/utils";

function QuickStockControl({
  productId,
  productName,
  stock,
}: {
  productId: string;
  productName: string;
  stock: number;
}) {
  const [isPending, startTransition] = useTransition();

  const adjust = (delta: number) => {
    startTransition(async () => {
      await adjustProductStockAction(productId, delta);
    });
  };

  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-border/70 bg-muted/30 p-0.5">
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        disabled={isPending}
        onClick={() => adjust(1)}
        aria-label={`افزایش موجودی ${productName}`}
        className="size-7 rounded-lg"
      >
        <Plus className="size-3.5" aria-hidden="true" />
      </Button>

      <span
        className={cn(
          "min-w-8 text-center text-xs font-bold tabular-nums",
          stock <= 0
            ? "text-destructive"
            : stock <= 3
              ? "text-amber-600 dark:text-amber-400"
              : "text-foreground",
        )}
      >
        {isPending ? (
          <Loader2 className="mx-auto size-3.5 animate-spin text-muted-foreground" />
        ) : (
          formatNumber(stock)
        )}
      </span>

      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        disabled={isPending || stock <= 0}
        onClick={() => adjust(-1)}
        aria-label={`کاهش موجودی ${productName}`}
        className="size-7 rounded-lg"
      >
        <Minus className="size-3.5" aria-hidden="true" />
      </Button>
    </div>
  );
}

export default QuickStockControl;

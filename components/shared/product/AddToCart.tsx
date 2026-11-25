"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  addItemToCart,
  updateCartItemQty,
} from "@/lib/actions/cart.action";
import { cn, formatNumber } from "@/lib/utils";

interface AddToCartProps {
  productId: string;
  stock: number;
  initialQty: number;
}

function AddToCart({ productId, stock, initialQty }: AddToCartProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const isOutOfStock = stock <= 0;

  const handleAdd = () => {
    setFeedback(null);
    startTransition(async () => {
      const res = await addItemToCart(productId);
      setFeedback({
        type: res.success ? "success" : "error",
        text: res.message,
      });
    });
  };

  const handleChangeQty = (nextQty: number) => {
    setFeedback(null);
    startTransition(async () => {
      const res = await updateCartItemQty(productId, nextQty);
      if (!res.success) {
        setFeedback({ type: "error", text: res.message });
      }
    });
  };

  if (isOutOfStock) {
    return (
      <Button size="lg" disabled className="h-10 w-full gap-2">
        <ShoppingCart className="size-4" />
        اتمام موجودی
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      {initialQty > 0 ? (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2 rounded-xl border border-border/80 bg-muted/30 p-1.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isPending || initialQty >= stock}
              onClick={() => handleChangeQty(initialQty + 1)}
              aria-label="افزایش تعداد"
              className="size-8 rounded-lg"
            >
              <Plus className="size-4" />
            </Button>

            <span className="flex items-center gap-1.5 text-sm font-bold tabular-nums text-foreground">
              {isPending ? (
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              ) : (
                formatNumber(initialQty)
              )}
              <span className="text-xs font-normal text-muted-foreground">
                عدد در سبد
              </span>
            </span>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isPending}
              onClick={() => handleChangeQty(initialQty - 1)}
              aria-label={initialQty === 1 ? "حذف از سبد خرید" : "کاهش تعداد"}
              className={cn(
                "size-8 rounded-lg",
                initialQty === 1 && "text-destructive hover:text-destructive",
              )}
            >
              {initialQty === 1 ? (
                <Trash2 className="size-4" />
              ) : (
                <Minus className="size-4" />
              )}
            </Button>
          </div>

          <Link
            href="/cart"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "h-10 w-full gap-2",
            )}
          >
            <ShoppingBag className="size-4" />
            مشاهده سبد خرید
          </Link>
        </div>
      ) : (
        <Button
          type="button"
          size="lg"
          disabled={isPending}
          onClick={handleAdd}
          className="h-10 w-full gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              در حال افزودن...
            </>
          ) : (
            <>
              <ShoppingCart className="size-4" />
              افزودن به سبد خرید
            </>
          )}
        </Button>
      )}

      {feedback && (
        <p
          role="status"
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium",
            feedback.type === "error"
              ? "text-destructive"
              : "text-emerald-600 dark:text-emerald-400",
          )}
        >
          {feedback.type === "success" && (
            <CheckCircle2 className="size-3.5 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </p>
      )}
    </div>
  );
}

export default AddToCart;

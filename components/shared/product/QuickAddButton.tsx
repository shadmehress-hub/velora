"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { addItemToCart } from "@/lib/actions/cart.action";
import { cn } from "@/lib/utils";

function QuickAddButton({
  productId,
  disabled,
}: {
  productId: string;
  disabled?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || isPending) return;

    startTransition(async () => {
      const res = await addItemToCart(productId);
      if (res.success) {
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
      }
    });
  };

  return (
    <Button
      type="button"
      variant={added ? "default" : "outline"}
      size="icon-sm"
      disabled={disabled || isPending}
      onClick={handleClick}
      aria-label="افزودن سریع به سبد خرید"
      title={disabled ? "ناموجود" : "افزودن به سبد خرید"}
      className={cn(
        "shrink-0 rounded-lg transition-colors",
        added && "bg-emerald-600 text-white hover:bg-emerald-600 border-emerald-600",
      )}
    >
      {isPending ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : added ? (
        <Check className="size-3.5" />
      ) : (
        <ShoppingCart className="size-3.5" />
      )}
    </Button>
  );
}

export default QuickAddButton;

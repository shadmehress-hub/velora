import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { getMyCart } from "@/lib/actions/cart.action";
import { cn, formatNumber } from "@/lib/utils";

async function CartButton() {
  const cart = await getMyCart();
  const totalQty = cart?.totalQty ?? 0;

  return (
    <Link
      href="/cart"
      aria-label="سبد خرید"
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "relative gap-1.5",
      )}
    >
      <span className="relative inline-flex">
        <ShoppingCart className="size-4" />
        {totalQty > 0 && (
          <span className="absolute -top-2 -right-2 flex min-w-4 h-4 items-center justify-center rounded-full bg-sky-500 px-1 text-[10px] font-bold leading-none text-white shadow-xs">
            {formatNumber(totalQty)}
          </span>
        )}
      </span>
      <span className="hidden sm:inline">سبد خرید</span>
    </Link>
  );
}

export default CartButton;

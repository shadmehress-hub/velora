import { Suspense } from "react";
import type { Metadata } from "next";

import { CartSkeleton } from "@/components/shared/cart/CartSkeleton";
import CartViewClient from "@/components/shared/cart/CartViewClient";
import { getMyCart } from "@/lib/actions/cart.action";

export const metadata: Metadata = {
  title: "سبد خرید",
};

async function CartContent() {
  const cart = await getMyCart();
  return <CartViewClient cart={cart} />;
}

export default function CartPage() {
  return (
    <Suspense fallback={<CartSkeleton />}>
      <CartContent />
    </Suspense>
  );
}

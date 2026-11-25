import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/session";
import ShippingForm from "@/components/shared/checkout/ShippingForm";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyCart } from "@/lib/actions/cart.action";

export const metadata: Metadata = {
  title: "اطلاعات ارسال و تسویه‌حساب",
};

function ShippingSkeleton() {
  return (
    <div className="space-y-6 py-4 sm:py-6">
      <Skeleton className="h-14 w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Skeleton className="h-96 w-full rounded-2xl lg:col-span-8" />
        <Skeleton className="h-72 w-full rounded-2xl lg:col-span-4" />
      </div>
    </div>
  );
}

async function ShippingContent() {
  const [session, cart] = await Promise.all([
    getServerSession(),
    getMyCart(),
  ]);

  if (!session?.user) {
    redirect("/signin?callbackUrl=/shipping");
  }

  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  return (
    <ShippingForm cart={cart} defaultName={session.user.name ?? ""} />
  );
}

export default function ShippingPage() {
  return (
    <Suspense fallback={<ShippingSkeleton />}>
      <ShippingContent />
    </Suspense>
  );
}

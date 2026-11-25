import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Package, ShoppingBag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyOrders } from "@/lib/actions/order.action";
import {
  cn,
  formatNumber,
  formatPrice,
  ORDER_STATUS_META,
} from "@/lib/utils";

export const metadata: Metadata = {
  title: "سفارش‌های من",
};

async function OrdersListContent() {
  const orders = await getMyOrders();

  if (orders.length === 0) {
    return (
      <section className="mx-auto my-8 flex max-w-lg flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/50 px-6 py-14 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
          <Package className="size-8" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          هنوز سفارشی ثبت نکرده‌اید
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          پس از ثبت سفارش، می‌توانید وضعیت پرداخت و ارسال را در این بخش پیگیری
          کنید.
        </p>
        <Link
          href="/search"
          className={cn(buttonVariants({ size: "lg" }), "mt-6 gap-2")}
        >
          <ShoppingBag className="size-4" aria-hidden="true" />
          شروع خرید
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-6 py-4 sm:py-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            سفارش‌های من
          </h1>
          <Badge variant="secondary" className="tabular-nums">
            {formatNumber(orders.length)} سفارش
          </Badge>
        </div>
        <Link
          href="/search"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          خرید جدید
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const statusInfo = ORDER_STATUS_META[order.status] ?? {
            label: order.status,
            variant: "secondary" as const,
          };

          return (
            <article
              key={order.id}
              className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs transition-colors hover:border-border"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/25 px-5 py-3.5">
                <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm">
                  <span className="font-mono text-xs text-muted-foreground">
                    #{order.id.slice(0, 8)}
                  </span>
                  <span className="text-border">•</span>
                  <span className="tabular-nums text-muted-foreground">
                    {new Intl.DateTimeFormat("fa-IR").format(
                      new Date(order.createdAt),
                    )}
                  </span>
                  <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                  {order.isPaid ? (
                    <Badge
                      variant="outline"
                      className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                    >
                      پرداخت‌شده
                    </Badge>
                  ) : (
                    order.paymentMethod === "zarinpal" &&
                    order.status !== "cancelled" && (
                      <Badge variant="destructive">در انتظار پرداخت</Badge>
                    )
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold tabular-nums text-foreground sm:text-base">
                    {formatPrice(order.totalPrice)}
                  </span>
                  <Link
                    href={`/orders/${order.id}`}
                    className={buttonVariants({ variant: "outline", size: "xs" })}
                  >
                    جزئیات سفارش
                  </Link>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                {order.items.map((item) => (
                  <Link
                    key={item.id}
                    href={`/product/${item.slug}`}
                    className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/20 px-2.5 py-1.5 text-xs transition-colors hover:bg-muted/40"
                  >
                    <div className="relative size-8 shrink-0 overflow-hidden rounded-md bg-background">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="32px"
                        className="object-contain p-0.5"
                      />
                    </div>
                    <span dir="auto" className="max-w-36 truncate font-medium">
                      {item.name}
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                      ×{formatNumber(item.qty)}
                    </span>
                  </Link>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4 py-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-36 w-full rounded-2xl" />
          <Skeleton className="h-36 w-full rounded-2xl" />
        </div>
      }
    >
      <OrdersListContent />
    </Suspense>
  );
}

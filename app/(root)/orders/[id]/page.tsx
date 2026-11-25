import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  MapPin,
  ReceiptText,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrderById } from "@/lib/actions/order.action";
import {
  cn,
  formatNumber,
  formatPrice,
  ORDER_STATUS_META,
} from "@/lib/utils";

export const metadata: Metadata = {
  title: "جزئیات سفارش",
};

async function OrderDetailContent({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment?: string; placed?: string }>;
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const statusInfo = ORDER_STATUS_META[order.status] ?? {
    label: order.status,
    variant: "secondary" as const,
  };

  return (
    <div className="space-y-6 py-4 sm:py-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              جزئیات سفارش
            </h1>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>
          <p dir="ltr" className="text-right font-mono text-xs text-muted-foreground">
            Order #{order.id}
          </p>
        </div>

        <Link
          href="/orders"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <ArrowRight className="size-4" aria-hidden="true" />
          همه سفارش‌ها
        </Link>
      </div>

      {/* Payment Feedback Banner */}
      {sp.payment === "success" && (
        <div
          role="status"
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-700 dark:text-emerald-300"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="size-5 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-bold">پرداخت با موفقیت انجام شد!</p>
              {order.paymentRefId && (
                <p className="text-xs opacity-90">
                  کد رهگیری پرداخت:{" "}
                  <span dir="ltr" className="font-mono font-semibold">
                    {order.paymentRefId}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {sp.payment === "failed" && !order.isPaid && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-destructive"
        >
          <div className="flex items-center gap-2.5">
            <XCircle className="size-5 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-bold">پرداخت ناموفق یا لغو شد</p>
              <p className="text-xs opacity-90">
                سفارش شما ثبت شده و می‌توانید مجدداً اقدام به پرداخت کنید.
              </p>
            </div>
          </div>
          <Link
            href={`/payment/${order.id}`}
            className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
          >
            <CreditCard className="size-4" aria-hidden="true" />
            تلاش مجدد پرداخت
          </Link>
        </div>
      )}

      {sp.placed === "cod" && (
        <div
          role="status"
          className="flex items-center gap-2.5 rounded-2xl border border-sky-500/40 bg-sky-500/10 p-4 text-sky-700 dark:text-sky-300"
        >
          <CheckCircle2 className="size-5 shrink-0" aria-hidden="true" />
          <p className="text-sm font-bold">
            سفارش شما با روش پرداخت در محل ثبت و به مرحله پردازش ارسال شد.
          </p>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Left: Items & Address */}
        <div className="space-y-6 lg:col-span-8">
          {/* Items */}
          <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs">
            <div className="flex items-center gap-2 border-b border-border/60 bg-muted/30 px-5 py-3.5">
              <ReceiptText className="size-4 text-sky-500" aria-hidden="true" />
              <h2 className="text-sm font-bold text-foreground sm:text-base">
                اقلام سفارش
              </h2>
            </div>

            <div className="divide-y divide-border/50 px-5">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-4"
                >
                  <div className="flex min-w-0 items-center gap-3.5">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted/30">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-contain p-1.5"
                      />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <Link
                        href={`/product/${item.slug}`}
                        dir="auto"
                        className="block truncate text-right text-sm font-semibold text-foreground hover:underline"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-muted-foreground tabular-nums">
                        {formatNumber(item.qty)} عدد × {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold tabular-nums text-foreground">
                    {formatPrice(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Shipping Info */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <MapPin className="size-4 text-sky-500" aria-hidden="true" />
              <h2 className="text-sm font-bold text-foreground sm:text-base">
                نشانی تحویل‌گیرنده
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div>
                <span className="text-xs text-muted-foreground">گیرنده:</span>
                <p className="font-medium text-foreground">{order.fullName}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">موبایل:</span>
                <p dir="ltr" className="text-right font-medium tabular-nums">
                  {order.phone}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">استان و شهر:</span>
                <p className="font-medium text-foreground">
                  {order.province}، {order.city}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">کد پستی:</span>
                <p dir="ltr" className="text-right font-mono font-medium">
                  {order.postalCode}
                </p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-xs text-muted-foreground">نشانی کامل:</span>
                <p className="mt-0.5 leading-relaxed text-foreground">
                  {order.address}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right: Payment Summary */}
        <aside className="lg:col-span-4">
          <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
            <h2 className="border-b border-border/60 pb-3 text-base font-bold">
              خلاصه مالی سفارش
            </h2>

            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">روش پرداخت</span>
                <span className="font-medium">
                  {order.paymentMethod === "zarinpal"
                    ? "زرین‌پال (آنلاین)"
                    : "پرداخت در محل"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">وضعیت پرداخت</span>
                <Badge variant={order.isPaid ? "default" : "secondary"}>
                  {order.isPaid ? "پرداخت‌شده" : "پرداخت‌نشده"}
                </Badge>
              </div>

              {order.paymentRefId && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">کد پیگیری</span>
                  <span dir="ltr" className="font-mono text-xs font-medium">
                    {order.paymentRefId}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-border/50 pt-2.5">
                <span className="text-muted-foreground">جمع کالاها</span>
                <span className="font-medium tabular-nums">
                  {formatPrice(order.itemsPrice)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">هزینه ارسال</span>
                <span className="font-medium tabular-nums">
                  {order.shippingPrice === 0
                    ? "رایگان"
                    : formatPrice(order.shippingPrice)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border/60 pt-4">
              <span className="text-sm font-semibold">جمع کل</span>
              <span className="text-lg font-extrabold tabular-nums text-foreground">
                {formatPrice(order.totalPrice)}
              </span>
            </div>

            {!order.isPaid &&
              order.paymentMethod === "zarinpal" &&
              order.status !== "cancelled" && (
                <Link
                  href={`/payment/${order.id}`}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-10 w-full gap-2 bg-amber-500 font-semibold text-zinc-950 hover:bg-amber-400",
                  )}
                >
                  <CreditCard className="size-4" aria-hidden="true" />
                  پرداخت آنلاین زرین‌پال
                </Link>
              )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function OrderDetailPage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment?: string; placed?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 py-6">
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      }
    >
      <OrderDetailContent
        params={props.params}
        searchParams={props.searchParams}
      />
    </Suspense>
  );
}

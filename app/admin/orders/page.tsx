import { Suspense } from "react";
import Link from "next/link";
import { ExternalLink, ReceiptText } from "lucide-react";

import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminOrders } from "@/lib/actions/admin.action";
import {
  cn,
  formatNumber,
  formatPrice,
  ORDER_STATUS_META,
} from "@/lib/utils";

const FILTER_TABS = [
  { value: "all", label: "همه" },
  { value: "pending", label: "در انتظار پرداخت" },
  { value: "processing", label: "در حال پردازش" },
  { value: "shipped", label: "ارسال شده" },
  { value: "delivered", label: "تحویل شده" },
  { value: "cancelled", label: "لغو شده" },
];

async function AdminOrdersContent({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const activeStatus = sp.status || "all";
  const orders = await getAdminOrders(activeStatus);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            مدیریت سفارش‌ها
          </h1>
          <Badge variant="secondary" className="tabular-nums">
            {formatNumber(orders.length)} سفارش
          </Badge>
        </div>
      </div>

      {/* Status Filter Pills */}
      <div
        role="navigation"
        aria-label="فیلتر وضعیت سفارش‌ها"
        className="flex flex-wrap items-center gap-1.5"
      >
        {FILTER_TABS.map((tab) => {
          const isActive = activeStatus === tab.value;
          return (
            <Link
              key={tab.value}
              href={
                tab.value === "all"
                  ? "/admin/orders"
                  : `/admin/orders?status=${tab.value}`
              }
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors sm:text-sm",
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-xs"
                  : "border-border/70 bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = ORDER_STATUS_META[order.status] ?? {
              label: order.status,
              variant: "secondary" as const,
            };

            return (
              <section
                key={order.id}
                className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/25 px-5 py-3.5">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        #{order.id.slice(0, 8)}
                      </span>
                      <span className="text-sm font-bold text-foreground">
                        {order.fullName}
                      </span>
                      <Badge variant={statusInfo.variant}>
                        {statusInfo.label}
                      </Badge>
                      <Badge
                        variant={order.isPaid ? "outline" : "secondary"}
                        className={cn(
                          order.isPaid &&
                            "border-emerald-500/40 text-emerald-600 dark:text-emerald-400",
                        )}
                      >
                        {order.isPaid ? "پرداخت‌شده" : "پرداخت‌نشده"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {order.user?.email} •{" "}
                      <span dir="ltr" className="tabular-nums">
                        {order.phone}
                      </span>{" "}
                      • {order.province}، {order.city}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-sm font-extrabold tabular-nums text-foreground">
                      {formatPrice(order.totalPrice)}
                    </span>
                    <OrderStatusSelect
                      orderId={order.id}
                      currentStatus={order.status}
                    />
                    <Link
                      href={`/orders/${order.id}`}
                      aria-label="مشاهده فاکتور سفارش"
                      className={buttonVariants({
                        variant: "ghost",
                        size: "icon-xs",
                      })}
                    >
                      <ExternalLink className="size-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-xs text-muted-foreground">
                  <div className="flex flex-wrap items-center gap-2">
                    {order.items.map((item) => (
                      <span
                        key={item.id}
                        className="rounded-lg border border-border/60 bg-muted/20 px-2.5 py-1 text-foreground"
                      >
                        <span dir="auto">{item.name}</span>{" "}
                        <span className="text-muted-foreground tabular-nums">
                          ×{formatNumber(item.qty)}
                        </span>
                      </span>
                    ))}
                  </div>
                  <span className="tabular-nums">
                    {new Intl.DateTimeFormat("fa-IR").format(
                      new Date(order.createdAt),
                    )}
                  </span>
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
          <ReceiptText
            className="size-8 text-muted-foreground"
            aria-hidden="true"
          />
          <p className="mt-3 text-sm font-medium text-foreground">
            سفارشی در این وضعیت ثبت نشده است
          </p>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage(props: {
  searchParams: Promise<{ status?: string }>;
}) {
  return (
    <Suspense fallback={<Skeleton className="h-80 w-full rounded-2xl" />}>
      <AdminOrdersContent searchParams={props.searchParams} />
    </Suspense>
  );
}

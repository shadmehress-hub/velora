import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Layers,
  Package,
  Plus,
  ReceiptText,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

import QuickStockControl from "@/components/admin/QuickStockControl";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminOverview } from "@/lib/actions/admin.action";
import { cn, formatNumber, formatPrice } from "@/lib/utils";

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Skeleton className="h-72 w-full rounded-2xl lg:col-span-7" />
        <Skeleton className="h-72 w-full rounded-2xl lg:col-span-5" />
      </div>
      <Skeleton className="h-72 w-full rounded-2xl" />
    </div>
  );
}

const CATEGORY_BAR_COLORS = [
  "from-sky-400 to-blue-600",
  "from-emerald-400 to-teal-600",
  "from-violet-400 to-indigo-600",
  "from-amber-400 to-orange-600",
];

async function AdminDashboardContent() {
  const stats = await getAdminOverview();

  const totalForHealth = Math.max(1, stats.totalProducts);
  const healthyPct = Math.round(
    (stats.healthyStockCount / totalForHealth) * 100,
  );
  const lowPct = Math.round((stats.lowStockCount / totalForHealth) * 100);
  const outPct = Math.max(0, 100 - healthyPct - lowPct);

  const maxCategoryValue = Math.max(
    1,
    ...stats.categoryStats.map((c) => c.inventoryValue),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            داشبورد مدیریت
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            تحلیل موجودی، ارزش کالاها، سبدهای فعال و هشدارهای انبار
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className={cn(buttonVariants({ size: "sm" }), "min-h-9 gap-1.5")}
        >
          <Plus className="size-4" aria-hidden="true" />
          افزودن محصول جدید
        </Link>
      </div>

      {/* KPI Cards */}
      <section aria-labelledby="kpi-heading">
        <h2 id="kpi-heading" className="sr-only">
          شاخص‌های کلیدی فروشگاه
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="فروش تاییدشده"
            value={formatPrice(stats.paidRevenue)}
            subtitle={`${formatNumber(stats.totalOrders)} سفارش کل`}
            icon={<ReceiptText className="size-5 text-emerald-500" />}
            href="/admin/orders"
          />
          <StatCard
            title="کل محصولات"
            value={formatNumber(stats.totalProducts)}
            subtitle={`${formatNumber(stats.totalUnitsInStock)} عدد موجودی انبار`}
            icon={<Package className="size-5 text-sky-500" />}
            href="/admin/products"
          />
          <StatCard
            title="کاربران و سبدها"
            value={formatNumber(stats.totalUsers)}
            subtitle={`${formatNumber(stats.activeCarts)} سبد فعال (${formatNumber(stats.totalCartUnits)} کالا)`}
            icon={<Users className="size-5 text-amber-500" />}
            href="/admin/users"
          />
          <StatCard
            title="ارزش کل انبار"
            value={formatPrice(stats.inventoryValue)}
            subtitle={`${formatNumber(stats.pendingOrdersCount)} سفارش در انتظار رسیدگی`}
            icon={<Wallet className="size-5 text-violet-500" />}
            href="/admin/orders?status=processing"
          />
        </div>
      </section>

      {/* Analytics Row: Category Breakdown + Stock Health */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Category Inventory Chart */}
        <section
          aria-labelledby="category-analytics-heading"
          className="flex flex-col justify-between gap-5 rounded-2xl border border-border/70 bg-card p-5 shadow-xs lg:col-span-7"
        >
          <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3.5">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 text-sky-500" aria-hidden="true" />
              <h2
                id="category-analytics-heading"
                className="text-sm font-bold text-foreground sm:text-base"
              >
                تحلیل ارزش موجودی به تفکیک دسته‌بندی
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">
              بر اساس ارزش انبار
            </span>
          </div>

          <div className="space-y-4">
            {stats.categoryStats.map((cat, idx) => {
              const barPct = Math.max(
                8,
                Math.round((cat.inventoryValue / maxCategoryValue) * 100),
              );
              const sharePct =
                stats.inventoryValue > 0
                  ? Math.round((cat.inventoryValue / stats.inventoryValue) * 100)
                  : 0;
              const gradient =
                CATEGORY_BAR_COLORS[idx % CATEGORY_BAR_COLORS.length];

              return (
                <Link
                  key={cat.name}
                  href={`/admin/products?category=${encodeURIComponent(cat.name)}`}
                  className="group block space-y-2 rounded-xl border border-border/50 bg-muted/20 p-3 transition-colors hover:border-border hover:bg-muted/40"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground group-hover:text-sky-500">
                        {cat.name}
                      </span>
                      <Badge variant="outline" className="text-[11px] tabular-nums">
                        {formatNumber(cat.productCount)} مدل •{" "}
                        {formatNumber(cat.stockUnits)} عدد
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold tabular-nums text-foreground">
                        {formatPrice(cat.inventoryValue)}
                      </span>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        ({formatNumber(sharePct)}٪)
                      </span>
                    </div>
                  </div>

                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full bg-gradient-to-l transition-all duration-500",
                        gradient,
                      )}
                      style={{ width: `${barPct}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-muted-foreground">
                    میانگین قیمت هر مدل:{" "}
                    <span className="font-medium tabular-nums text-foreground">
                      {formatPrice(cat.avgPrice)}
                    </span>
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Stock Health + Top Products */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          {/* Stock Health */}
          <section
            aria-labelledby="stock-health-heading"
            className="space-y-4 rounded-2xl border border-border/70 bg-card p-5 shadow-xs"
          >
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-emerald-500" aria-hidden="true" />
                <h2
                  id="stock-health-heading"
                  className="text-sm font-bold text-foreground sm:text-base"
                >
                  سلامت موجودی انبار
                </h2>
              </div>
              <span className="text-xs tabular-nums text-muted-foreground">
                {formatNumber(stats.totalProducts)} کالا
              </span>
            </div>

            {/* Segmented Progress Bar */}
            <div
              role="img"
              aria-label={`موجود کافی ${healthyPct} درصد، رو به اتمام ${lowPct} درصد، ناموجود ${outPct} درصد`}
              className="flex h-3 w-full overflow-hidden rounded-full bg-muted"
            >
              <div
                className="bg-emerald-500 transition-all"
                style={{ width: `${healthyPct}%` }}
              />
              <div
                className="bg-amber-500 transition-all"
                style={{ width: `${lowPct}%` }}
              />
              <div
                className="bg-destructive transition-all"
                style={{ width: `${outPct}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <Link
                href="/admin/products?stock=in"
                className="rounded-xl border border-border/50 bg-muted/20 p-2.5 transition-colors hover:border-emerald-500/40"
              >
                <p className="text-[11px] text-muted-foreground">موجود کافی</p>
                <p className="mt-0.5 text-sm font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                  {formatNumber(stats.healthyStockCount)}
                </p>
              </Link>
              <Link
                href="/admin/products?stock=low"
                className="rounded-xl border border-border/50 bg-muted/20 p-2.5 transition-colors hover:border-amber-500/40"
              >
                <p className="text-[11px] text-muted-foreground">موجودی کم</p>
                <p className="mt-0.5 text-sm font-bold tabular-nums text-amber-600 dark:text-amber-400">
                  {formatNumber(stats.lowStockCount)}
                </p>
              </Link>
              <Link
                href="/admin/products?stock=out"
                className="rounded-xl border border-border/50 bg-muted/20 p-2.5 transition-colors hover:border-destructive/40"
              >
                <p className="text-[11px] text-muted-foreground">ناموجود</p>
                <p className="mt-0.5 text-sm font-bold tabular-nums text-destructive">
                  {formatNumber(stats.outOfStockCount)}
                </p>
              </Link>
            </div>
          </section>

          {/* Top Inventory Value Products */}
          <section
            aria-labelledby="top-value-heading"
            className="flex-1 space-y-3 rounded-2xl border border-border/70 bg-card p-5 shadow-xs"
          >
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <TrendingUp className="size-4 text-violet-500" aria-hidden="true" />
              <h2
                id="top-value-heading"
                className="text-sm font-bold text-foreground sm:text-base"
              >
                پرارزش‌ترین موجودی‌ها
              </h2>
            </div>

            <div className="space-y-2.5">
              {stats.topValueProducts.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl px-2 py-1.5 text-xs transition-colors hover:bg-muted/40 sm:text-sm"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-muted text-[11px] font-bold tabular-nums text-muted-foreground">
                      {formatNumber(index + 1)}
                    </span>
                    <span
                      dir="auto"
                      className="truncate text-right font-medium text-foreground"
                    >
                      {product.name}
                    </span>
                  </div>
                  <span className="shrink-0 font-bold tabular-nums text-muted-foreground">
                    {formatPrice(product.price * Math.max(0, product.stock))}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Low Stock Products with Inline Quick Stock Stepper */}
      <section
        aria-labelledby="low-stock-heading"
        className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 px-5 py-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-amber-500" aria-hidden="true" />
            <h2
              id="low-stock-heading"
              className="text-sm font-bold text-foreground sm:text-base"
            >
              هشدار موجودی انبار (تغییر سریع تعداد)
            </h2>
          </div>
          <Link
            href="/admin/products"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            همه محصولات
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {stats.lowStockProducts.length > 0 ? (
          <div className="divide-y divide-border/50">
            {stats.lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted/30">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="44px"
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="min-w-0">
                    <p
                      dir="auto"
                      className="truncate text-right text-sm font-semibold text-foreground"
                    >
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.category} • {formatPrice(product.price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <QuickStockControl
                    productId={product.id}
                    productName={product.name}
                    stock={product.stock}
                  />
                  <Link
                    href={`/admin/products/${product.id}`}
                    className={buttonVariants({
                      variant: "outline",
                      size: "xs",
                    })}
                  >
                    ویرایش
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            موجودی همه محصولات در وضعیت مطلوب است.
          </p>
        )}
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  href,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col justify-between gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-md sm:p-5"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          {title}
        </span>
        <span className="flex size-9 items-center justify-center rounded-xl bg-muted/60 transition-transform group-hover:scale-105">
          {icon}
        </span>
      </div>
      <div className="space-y-0.5">
        <p className="text-lg font-extrabold tabular-nums text-foreground sm:text-xl">
          {value}
        </p>
        <p className="text-[11px] text-muted-foreground">{subtitle}</p>
      </div>
    </Link>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AdminDashboardContent />
    </Suspense>
  );
}

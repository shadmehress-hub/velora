import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpDown,
  CheckCircle2,
  Filter,
  RotateCcw,
  SearchX,
  SlidersHorizontal,
} from "lucide-react";

import ProductCard from "@/components/shared/product/ProductCard";
import { SearchSkeleton } from "@/components/shared/search/SearchSkeleton";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  getCategoriesWithMeta,
  getFilteredProducts,
} from "@/lib/actions/product.action";
import { cn, formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "جستجو و دسته‌بندی محصولات",
};

const SORT_OPTIONS = [
  { value: "newest", label: "جدیدترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
  { value: "stock", label: "بیشترین موجودی" },
];

function buildSearchUrl(
  base: {
    q?: string;
    category?: string;
    sort?: string;
    inStock?: boolean;
  },
  overrides: Partial<{
    q: string;
    category: string;
    sort: string;
    inStock: boolean;
  }>,
) {
  const next = { ...base, ...overrides };
  const params = new URLSearchParams();
  if (next.q?.trim()) params.set("q", next.q.trim());
  if (next.category && next.category !== "همه") {
    params.set("category", next.category);
  }
  if (next.sort && next.sort !== "newest") params.set("sort", next.sort);
  if (next.inStock) params.set("inStock", "true");

  const qs = params.toString();
  return qs ? `/search?${qs}` : "/search";
}

async function SearchResultsContent({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    inStock?: string;
  }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const activeCategory = sp.category?.trim() || "همه";
  const activeSort = sp.sort || "newest";
  const inStockOnly = sp.inStock === "true";

  const [products, categories] = await Promise.all([
    getFilteredProducts({
      q,
      category: activeCategory,
      sort: activeSort,
      inStock: inStockOnly,
    }),
    getCategoriesWithMeta(),
  ]);

  const currentFilters = {
    q,
    category: activeCategory,
    sort: activeSort,
    inStock: inStockOnly,
  };

  const hasActiveFilters =
    Boolean(q) ||
    activeCategory !== "همه" ||
    activeSort !== "newest" ||
    inStockOnly;

  const totalCatalogCount = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="space-y-6 py-4 sm:py-6">
      {/* Page Title + Active Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {q
                ? `نتایج جستجو برای «${q}»`
                : activeCategory !== "همه"
                  ? `دسته ${activeCategory}`
                  : "همه محصولات فروشگاه"}
            </h1>
            <Badge variant="secondary" className="tabular-nums">
              {formatNumber(products.length)} کالا
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground sm:text-sm">
            فیلتر و مرتب‌سازی سریع بین محصولات دیجیتال ولورا
          </p>
        </div>

        {hasActiveFilters && (
          <Link
            href="/search"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "gap-1.5",
            )}
          >
            <RotateCcw className="size-3.5" />
            حذف همه فیلترها
          </Link>
        )}
      </div>

      {/* Main 2-column Search Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Sidebar Filters */}
        <aside className="space-y-4 lg:sticky lg:top-28 lg:col-span-3">
          <div className="space-y-5 rounded-2xl border border-border/70 bg-card p-4 shadow-xs sm:p-5">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3 text-sm font-bold text-foreground">
              <SlidersHorizontal className="size-4 text-sky-500" />
              <span>فیلترهای محصولات</span>
            </div>

            {/* Categories Filter */}
            <div className="space-y-2.5">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <Filter className="size-3.5" />
                دسته‌بندی
              </p>
              <div className="flex flex-wrap gap-1.5 lg:flex-col lg:gap-1">
                <Link
                  href={buildSearchUrl(currentFilters, { category: "همه" })}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors lg:py-2 sm:text-sm",
                    activeCategory === "همه"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground lg:bg-transparent",
                  )}
                >
                  <span>همه دسته‌ها</span>
                  <span className="tabular-nums opacity-80">
                    {formatNumber(totalCatalogCount)}
                  </span>
                </Link>

                {categories.map((cat) => {
                  const isActive = activeCategory === cat.name;
                  return (
                    <Link
                      key={cat.name}
                      href={buildSearchUrl(currentFilters, {
                        category: cat.name,
                      })}
                      className={cn(
                        "flex items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors lg:py-2 sm:text-sm",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground lg:bg-transparent",
                      )}
                    >
                      <span>{cat.name}</span>
                      <span className="tabular-nums opacity-80">
                        {formatNumber(cat.count)}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* In Stock Filter */}
            <div className="border-t border-border/60 pt-4">
              <Link
                href={buildSearchUrl(currentFilters, {
                  inStock: !inStockOnly,
                })}
                className={cn(
                  "flex items-center justify-between rounded-xl border px-3 py-2.5 text-xs font-medium transition-all sm:text-sm",
                  inStockOnly
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "border-border/70 bg-muted/20 text-muted-foreground hover:border-border hover:text-foreground",
                )}
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="size-4" />
                  فقط کالاهای موجود
                </span>
                <span className="text-[11px]">
                  {inStockOnly ? "فعال" : "خاموش"}
                </span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Results Column */}
        <div className="space-y-4 lg:col-span-9">
          {/* Sort Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/60 bg-card/70 px-4 py-2.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <ArrowUpDown className="size-3.5" />
              <span>مرتب‌سازی:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {SORT_OPTIONS.map((opt) => {
                const isActive = activeSort === opt.value;
                return (
                  <Link
                    key={opt.value}
                    href={buildSearchUrl(currentFilters, { sort: opt.value })}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {opt.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Product Grid or Empty State */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/40 px-6 py-16 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <SearchX className="size-7" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-foreground">
                محصولی با این مشخصات یافت نشد
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                عبارت جستجو یا فیلترهای انتخابی را تغییر دهید.
              </p>
              <Link
                href="/search"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "mt-5 gap-1.5",
                )}
              >
                <RotateCcw className="size-3.5" />
                نمایش همه محصولات
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage(props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    inStock?: string;
  }>;
}) {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchResultsContent searchParams={props.searchParams} />
    </Suspense>
  );
}

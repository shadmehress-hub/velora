import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpDown,
  ExternalLink,
  Pencil,
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";

import DeleteProductButton from "@/components/admin/DeleteProductButton";
import ExportProductsCsvButton from "@/components/admin/ExportProductsCsvButton";
import QuickStockControl from "@/components/admin/QuickStockControl";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminProducts } from "@/lib/actions/admin.action";
import { cn, formatNumber, formatPrice } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "newest", label: "جدیدترین" },
  { value: "price-desc", label: "گران‌ترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "stock-asc", label: "کمترین موجودی" },
];

function buildAdminProductsUrl(
  current: { q?: string; category?: string; stock?: string; sort?: string },
  overrides: Partial<{
    q: string;
    category: string;
    stock: string;
    sort: string;
  }>,
) {
  const next = { ...current, ...overrides };
  const params = new URLSearchParams();
  if (next.q?.trim()) params.set("q", next.q.trim());
  if (next.category && next.category !== "همه") {
    params.set("category", next.category);
  }
  if (next.stock && next.stock !== "all") params.set("stock", next.stock);
  if (next.sort && next.sort !== "newest") params.set("sort", next.sort);

  const qs = params.toString();
  return qs ? `/admin/products?${qs}` : "/admin/products";
}

async function AdminProductsContent({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    stock?: string;
    sort?: string;
  }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const activeCategory = sp.category?.trim() || "همه";
  const activeStock = sp.stock || "all";
  const activeSort = sp.sort || "newest";

  const { products, categories, counts } = await getAdminProducts({
    q,
    category: activeCategory,
    stock: activeStock,
    sort: activeSort,
  });

  const currentFilters = {
    q,
    category: activeCategory,
    stock: activeStock,
    sort: activeSort,
  };

  const hasFilters =
    Boolean(q) ||
    activeCategory !== "همه" ||
    activeStock !== "all" ||
    activeSort !== "newest";

  const stockTabs = [
    { value: "all", label: "همه", count: counts.all },
    { value: "in", label: "موجود کافی", count: counts.inStock },
    { value: "low", label: "موجودی کم", count: counts.low },
    { value: "out", label: "ناموجود", count: counts.out },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            مدیریت محصولات
          </h1>
          <Badge variant="secondary" className="tabular-nums">
            {formatNumber(products.length)} مورد
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ExportProductsCsvButton products={products} />
          <Link
            href="/admin/products/new"
            className={cn(buttonVariants({ size: "sm" }), "min-h-9 gap-1.5")}
          >
            <Plus className="size-4" aria-hidden="true" />
            افزودن محصول
          </Link>
        </div>
      </div>

      {/* Stock Status Tabs */}
      <div
        role="navigation"
        aria-label="فیلتر وضعیت موجودی"
        className="flex flex-wrap items-center gap-1.5"
      >
        {stockTabs.map((tab) => {
          const isActive = activeStock === tab.value;
          return (
            <Link
              key={tab.value}
              href={buildAdminProductsUrl(currentFilters, { stock: tab.value })}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm",
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-xs"
                  : "border-border/70 bg-card text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              <span>{tab.label}</span>
              <span className="tabular-nums opacity-80">
                ({formatNumber(tab.count)})
              </span>
            </Link>
          );
        })}
      </div>

      {/* Search + Category + Sort Toolbar */}
      <div className="space-y-3 rounded-2xl border border-border/70 bg-card p-4 shadow-xs">
        <form
          action="/admin/products"
          method="GET"
          className="flex flex-wrap items-center gap-2"
        >
          {activeCategory !== "همه" && (
            <input type="hidden" name="category" value={activeCategory} />
          )}
          {activeStock !== "all" && (
            <input type="hidden" name="stock" value={activeStock} />
          )}
          {activeSort !== "newest" && (
            <input type="hidden" name="sort" value={activeSort} />
          )}

          <div className="relative min-w-56 flex-1">
            <Label htmlFor="admin-product-search" className="sr-only">
              جستجوی محصول
            </Label>
            <Search
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="admin-product-search"
              name="q"
              defaultValue={q}
              placeholder="جستجو بر اساس نام، برند، دسته‌بندی یا اسلاگ..."
              className="h-9 pr-9"
            />
          </div>
          <Button type="submit" variant="outline" size="sm" className="h-9">
            جستجو
          </Button>
          {hasFilters && (
            <Link
              href="/admin/products"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "h-9 gap-1",
              )}
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              پاک کردن
            </Link>
          )}
        </form>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-3">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-muted-foreground">دسته:</span>
            {["همه", ...categories].map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <Link
                  key={cat}
                  href={buildAdminProductsUrl(currentFilters, {
                    category: cat,
                  })}
                  className={cn(
                    "rounded-lg px-2.5 py-1 font-medium transition-colors",
                    isActive
                      ? "bg-primary/15 text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {cat}
                </Link>
              );
            })}
          </div>

          {/* Sort */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <ArrowUpDown
              className="size-3.5 text-muted-foreground"
              aria-hidden="true"
            />
            {SORT_OPTIONS.map((opt) => {
              const isActive = activeSort === opt.value;
              return (
                <Link
                  key={opt.value}
                  href={buildAdminProductsUrl(currentFilters, {
                    sort: opt.value,
                  })}
                  className={cn(
                    "rounded-lg px-2 py-1 font-medium transition-colors",
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
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <caption className="sr-only">جدول مدیریت محصولات ولورا</caption>
            <thead className="border-b border-border/60 bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  محصول
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  دسته‌بندی
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  قیمت
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  تغییر سریع موجودی
                </th>
                <th scope="col" className="px-4 py-3 text-left font-semibold">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="transition-colors hover:bg-muted/25"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
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
                          className="truncate text-right font-semibold text-foreground"
                        >
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.brand}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {product.category}
                  </td>
                  <td className="px-4 py-3 font-medium tabular-nums">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-3">
                    <QuickStockControl
                      productId={product.id}
                      productName={product.name}
                      stock={product.stock}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/product/${product.slug}`}
                        aria-label={`مشاهده ${product.name} در فروشگاه`}
                        className={buttonVariants({
                          variant: "ghost",
                          size: "icon-xs",
                        })}
                      >
                        <ExternalLink className="size-3.5" aria-hidden="true" />
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}`}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "xs" }),
                          "gap-1",
                        )}
                      >
                        <Pencil className="size-3" aria-hidden="true" />
                        ویرایش
                      </Link>
                      <DeleteProductButton productId={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {products.map((product) => (
          <div
            key={product.id}
            className="space-y-3 rounded-2xl border border-border/70 bg-card p-4 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted/30">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="56px"
                  className="object-contain p-1.5"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  dir="auto"
                  className="truncate text-right text-sm font-semibold text-foreground"
                >
                  {product.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {product.category} • {product.brand}
                </p>
                <p className="mt-1 text-sm font-bold tabular-nums">
                  {formatPrice(product.price)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-3">
              <QuickStockControl
                productId={product.id}
                productName={product.name}
                stock={product.stock}
              />
              <div className="flex items-center gap-1.5">
                <Link
                  href={`/admin/products/${product.id}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "xs" }),
                    "gap-1",
                  )}
                >
                  <Pencil className="size-3" aria-hidden="true" />
                  ویرایش
                </Link>
                <DeleteProductButton productId={product.id} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          محصولی با این فیلتر یافت نشد.
        </div>
      )}
    </div>
  );
}

export default function AdminProductsPage(props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    stock?: string;
    sort?: string;
  }>;
}) {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
      <AdminProductsContent searchParams={props.searchParams} />
    </Suspense>
  );
}

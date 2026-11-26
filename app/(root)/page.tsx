import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Headphones,
  PackageCheck,
  RotateCcw,
  Sparkles,
  Truck,
} from "lucide-react";

import ProductList from "@/components/shared/product/ProductList";
import { ProductListSkeleton } from "@/components/shared/product/ProductSkeleton";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getCategoriesWithMeta,
  getLatestProducts,
} from "@/lib/actions/product.action";
import { cn, formatNumber } from "@/lib/utils";

async function CategoriesSection() {
  const categories = await getCategoriesWithMeta();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
          خرید بر اساس دسته‌بندی
        </h2>
        <Link
          href="/search"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          مشاهده همه
          <ArrowLeft className="size-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/search?category=${encodeURIComponent(cat.name)}`}
            className="group flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-border/70 bg-card p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-md"
          >
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-sky-500 sm:text-lg">
                {cat.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {formatNumber(cat.count)} محصول آماده ارسال
              </p>
              <span className="inline-flex items-center gap-1 pt-1 text-xs font-medium text-sky-500">
                مشاهده کالاها
                <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
              </span>
            </div>

            <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted/40 sm:size-24">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="96px"
                className="object-contain p-2 transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

async function LatestProductsSection() {
  const products = await getLatestProducts();

  return (
    <ProductList
      data={products}
      title="محصولات ویژه"
      limit={8}
      showCategories
    />
  );
}

export default function HomePage() {
  return (
    <div className="space-y-8 py-2 sm:space-y-10 sm:py-4">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-zinc-950 text-white shadow-lg">
        <Image
          src="/images/banner/b-01.png"
          alt="بنر فروشگاه ولورا"
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover opacity-85"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-l from-zinc-950/90 via-zinc-950/65 to-zinc-950/40"
        />

        <div className="relative z-10 flex flex-col items-start gap-5 px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <Badge className="gap-1.5 border border-sky-400/30 bg-sky-500/15 text-sky-300">
            <Sparkles className="size-3.5" />
            فروشگاه تخصصی کالای دیجیتال
          </Badge>

          <div className="max-w-xl space-y-3">
            <h1 className="text-2xl font-extrabold leading-snug tracking-tight sm:text-4xl">
              انتخاب هوشمندانه، با{" "}
              <span className="bg-gradient-to-l from-sky-300 to-blue-400 bg-clip-text text-transparent">
                ضمانت اصالت ولورا
              </span>
            </h1>
            <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">
              جدیدترین مدل‌های آیفون، مک‌بوک، کنسول‌های بازی PS5 و هدفون‌های
              حرفه‌ای را با قیمت به‌روز، گارانتی معتبر و ارسال سریع تهیه کنید.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/search"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-10 gap-2 rounded-xl bg-white px-5 font-semibold text-zinc-950 hover:bg-zinc-200",
              )}
            >
              مشاهده همه محصولات
              <ArrowLeft className="size-4" />
            </Link>
            <Link
              href="/search?category=%D9%85%D9%88%D8%A8%D8%A7%DB%8C%D9%84"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-10 rounded-xl border-white/25 bg-white/10 px-5 text-white hover:bg-white/20 hover:text-white",
              )}
            >
              گوشی‌های آیفون
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="grid grid-cols-1 gap-3 rounded-2xl border border-border/60 bg-card/60 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center justify-start gap-2 text-xs font-medium text-muted-foreground lg:justify-center sm:text-sm">
          <Truck className="size-4 shrink-0 text-sky-500" />
          <span>ارسال رایگان بالای ۵۰ میلیون</span>
        </div>
        <div className="flex items-center justify-start gap-2 text-xs font-medium text-muted-foreground lg:justify-center sm:text-sm">
          <PackageCheck className="size-4 shrink-0 text-sky-500" />
          <span>ضمانت اصالت و سلامت کالا</span>
        </div>
        <div className="flex items-center justify-start gap-2 text-xs font-medium text-muted-foreground lg:justify-center sm:text-sm">
          <RotateCcw className="size-4 shrink-0 text-sky-500" />
          <span>۷ روز ضمانت بازگشت</span>
        </div>
        <div className="flex items-center justify-start gap-2 text-xs font-medium text-muted-foreground lg:justify-center sm:text-sm">
          <Headphones className="size-4 shrink-0 text-sky-500" />
          <span>پشتیبانی تخصصی فروش</span>
        </div>
      </section>

      {/* Categories Showcase */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
        }
      >
        <CategoriesSection />
      </Suspense>

      {/* Featured Products */}
      <Suspense fallback={<ProductListSkeleton count={8} />}>
        <LatestProductsSection />
      </Suspense>
    </div>
  );
}

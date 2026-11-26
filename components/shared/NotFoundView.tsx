import Link from "next/link";
import { ArrowRight, Compass, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const QUICK_CATEGORIES = ["موبایل", "لپتاپ", "هدفون", "کنسول بازی"];

function NotFoundView() {
  return (
    <section className="relative flex w-full items-center justify-center py-10 sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_45%_at_50%_40%,rgba(56,189,248,0.12),transparent_70%)]"
      />

      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-border/80 bg-card/95 p-6 text-center shadow-lg shadow-black/5 backdrop-blur-xs dark:shadow-black/30 sm:p-10">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-sky-400/80 to-transparent"
        />

        <Badge
          variant="secondary"
          className="mx-auto gap-1.5 border border-border/60"
        >
          <Compass className="size-3.5 text-sky-500" aria-hidden="true" />
          خطای ۴۰۴ — مسیر یافت نشد
        </Badge>

        <p
          dir="ltr"
          className="mt-4 font-[family-name:var(--font-inter)] bg-gradient-to-b from-foreground via-foreground/80 to-muted-foreground/40 bg-clip-text text-6xl font-black tracking-tight text-transparent sm:text-7xl"
        >
          404
        </p>

        <h1 className="mt-3 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          صفحه یا محصول مورد نظر پیدا نشد
        </h1>

        <p className="mx-auto mt-2.5 max-w-md text-xs leading-6 text-muted-foreground sm:text-sm">
          ممکن است آدرس را اشتباه وارد کرده باشید یا کالا از فروشگاه حذف شده
          باشد. می‌توانید از مسیرهای زیر ادامه دهید:
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className={cn(buttonVariants({ size: "lg" }), "gap-2 rounded-xl")}
          >
            <ArrowRight className="size-4" aria-hidden="true" />
            بازگشت به صفحه اصلی
          </Link>
          <Link
            href="/search"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "gap-2 rounded-xl",
            )}
          >
            <Search className="size-4" aria-hidden="true" />
            جستجو در محصولات
          </Link>
        </div>

        <div className="mt-7 border-t border-border/60 pt-5">
          <p className="text-xs text-muted-foreground">دسترسی سریع:</p>
          <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2">
            {QUICK_CATEGORIES.map((category) => (
              <Link
                key={category}
                href={`/search?category=${encodeURIComponent(category)}`}
                className="rounded-full border border-border/70 bg-muted/40 px-3.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default NotFoundView;

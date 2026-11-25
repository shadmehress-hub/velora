import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card shadow-xs">
      <div className="relative aspect-square w-full bg-muted/40">
        <Skeleton className="h-full w-full rounded-none" />
        <Skeleton className="absolute top-3 right-3 h-5 w-14 rounded-md" />
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-5 w-3/4" />
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-5/6" />
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-3">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-14" />
        </div>
      </div>
    </div>
  );
}

export function ProductListSkeleton({
  count = 4,
  showTitle = true,
}: {
  count?: number;
  showTitle?: boolean;
}) {
  return (
    <section
      aria-label="در حال بارگذاری محصولات"
      className="my-4 space-y-4 sm:my-8 sm:space-y-6"
    >
      {showTitle && (
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <Skeleton className="h-7 w-40 sm:h-8" />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: count }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div
      aria-label="در حال بارگذاری جزئیات محصول"
      className="space-y-8 py-4 sm:py-6"
    >
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-2" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-2" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* 3-column Digikala-style layout skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
        {/* Column 1: Gallery */}
        <div className="lg:col-span-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border/70 bg-muted/30">
            <Skeleton className="h-full w-full rounded-none" />
            <Skeleton className="absolute top-3 right-3 h-5 w-16 rounded-4xl" />
          </div>
        </div>

        {/* Column 2: Product info */}
        <div className="flex flex-col gap-5 lg:col-span-5">
          <div className="space-y-3 border-b border-border/60 pb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-5 w-16 rounded-4xl" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-7 w-4/5 sm:h-8" />
            <Skeleton className="h-3.5 w-32" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <div className="grid grid-cols-2 gap-2.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="space-y-1.5 rounded-xl border border-border/60 bg-muted/25 px-3 py-2.5"
                >
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 border-t border-border/60 pt-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <Skeleton className="h-14 w-full rounded-xl" />
        </div>

        {/* Column 3: Seller / Buy Box */}
        <aside className="lg:col-span-3">
          <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-3.5">
              <div className="flex items-center gap-2.5">
                <Skeleton className="size-9 rounded-lg" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-5 w-20 rounded-4xl" />
            </div>

            <div className="border-b border-border/60 pb-3.5">
              <Skeleton className="h-4 w-4/5" />
            </div>

            <div className="space-y-1.5 border-b border-border/60 pb-3.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>

            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-6 w-32" />
            </div>

            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        </aside>
      </div>

      {/* Trust Badges Bar */}
      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border/60 bg-muted/20 p-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-center gap-2 py-1">
            <Skeleton className="size-5 rounded-md" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>

      {/* Specifications Table */}
      <section className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="overflow-hidden rounded-xl border border-border/70">
          <div className="divide-y divide-border/50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-3 gap-4 px-4 py-3 odd:bg-muted/20"
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="col-span-2 h-4 w-40" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="space-y-5 border-t border-border/60 pt-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-7 w-24 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

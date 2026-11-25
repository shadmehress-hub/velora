import { ProductListSkeleton } from "@/components/shared/product/ProductSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export function SearchSkeleton() {
  return (
    <div className="space-y-6 py-4 sm:py-6">
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-5 w-20 rounded-4xl" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="space-y-4 lg:col-span-3">
          <Skeleton className="h-64 w-full rounded-2xl" />
        </aside>
        <div className="lg:col-span-9">
          <ProductListSkeleton count={6} showTitle={false} />
        </div>
      </div>
    </div>
  );
}

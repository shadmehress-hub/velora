import { ProductListSkeleton } from "@/components/shared/product/ProductSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="space-y-8 py-2 sm:space-y-10 sm:py-4">
      <Skeleton className="h-64 w-full rounded-3xl sm:h-72" />
      <Skeleton className="h-14 w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>
      <ProductListSkeleton count={8} />
    </div>
  );
}

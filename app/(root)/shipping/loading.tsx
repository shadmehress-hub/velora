import { Skeleton } from "@/components/ui/skeleton";

export default function ShippingLoading() {
  return (
    <div className="space-y-6 py-4 sm:py-6">
      <Skeleton className="h-14 w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Skeleton className="h-96 w-full rounded-2xl lg:col-span-8" />
        <Skeleton className="h-72 w-full rounded-2xl lg:col-span-4" />
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCartsLoading() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-7 w-40" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

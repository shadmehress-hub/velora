import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentLoading() {
  return (
    <div className="mx-auto my-8 max-w-lg">
      <Skeleton className="h-96 w-full rounded-3xl" />
    </div>
  );
}

"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";

import { updateOrderStatusAction } from "@/lib/actions/admin.action";

const STATUS_CHOICES = [
  { value: "pending", label: "در انتظار پرداخت" },
  { value: "processing", label: "در حال پردازش" },
  { value: "shipped", label: "ارسال شده" },
  { value: "delivered", label: "تحویل شده" },
  { value: "cancelled", label: "لغو شده" },
];

function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = e.target.value;
    startTransition(async () => {
      await updateOrderStatusAction(orderId, nextStatus);
    });
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      {isPending && (
        <Loader2
          className="size-3.5 animate-spin text-muted-foreground"
          aria-hidden="true"
        />
      )}
      <select
        aria-label="تغییر وضعیت سفارش"
        value={currentStatus}
        disabled={isPending}
        onChange={handleChange}
        className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs font-medium text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50"
      >
        {STATUS_CHOICES.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default OrderStatusSelect;

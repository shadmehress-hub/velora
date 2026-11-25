"use client";

import { useTransition } from "react";
import {
  CheckCircle2,
  CreditCard,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { verifyMockPaymentAction } from "@/lib/actions/order.action";
import { formatPrice } from "@/lib/utils";
import type { OrderView } from "@/types/index";

function ZarinpalMockGateway({ order }: { order: OrderView }) {
  const [isPending, startTransition] = useTransition();

  const handleVerify = (succeeded: boolean) => {
    startTransition(async () => {
      await verifyMockPaymentAction(order.id, succeeded);
    });
  };

  return (
    <div className="mx-auto my-8 w-full max-w-lg overflow-hidden rounded-3xl border border-amber-500/40 bg-card text-card-foreground shadow-xl">
      {/* ZarinPal Sandbox Header */}
      <div className="flex items-center justify-between border-b border-amber-500/25 bg-gradient-to-l from-amber-500/15 via-amber-500/5 to-transparent px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500 text-zinc-950 shadow-xs">
            <CreditCard className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-foreground sm:text-base">
              درگاه پرداخت امن زرین‌پال
            </p>
            <p className="text-[11px] text-muted-foreground">
              محیط شبیه‌ساز تست (Sandbox)
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="border-amber-500/50 text-amber-600 dark:text-amber-400"
        >
          شاپرک
        </Badge>
      </div>

      {/* Payment Details */}
      <div className="space-y-5 p-6">
        <div className="space-y-3 rounded-2xl border border-border/70 bg-muted/25 p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">پذیرنده</span>
            <span className="font-bold text-foreground">فروشگاه ولورا (Velora)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">شماره سفارش</span>
            <span dir="ltr" className="font-mono text-xs font-medium">
              {order.id.slice(0, 12)}
            </span>
          </div>
          {order.paymentAuthority && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">کد تراکنش (Authority)</span>
              <span dir="ltr" className="font-mono text-xs font-medium">
                {order.paymentAuthority}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-border/60 pt-3">
            <span className="font-semibold text-foreground">مبلغ قابل پرداخت</span>
            <span className="text-lg font-extrabold tabular-nums text-amber-600 dark:text-amber-400">
              {formatPrice(order.totalPrice)}
            </span>
          </div>
        </div>

        {/* Simulated Card Preview */}
        <div className="space-y-2 rounded-2xl border border-border/60 bg-muted/15 p-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <ShieldCheck className="size-4 text-emerald-500" aria-hidden="true" />
            <span>کارت تستی آماده برای پرداخت آزمایشی</span>
          </div>
          <p dir="ltr" className="font-mono text-left text-xs text-foreground">
            6219 •••• •••• 1048 — CVV2: 412 — 1408/09
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button
            type="button"
            size="lg"
            disabled={isPending}
            onClick={() => handleVerify(true)}
            className="h-11 gap-2 bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="size-4" aria-hidden="true" />
            )}
            تایید و پرداخت موفق
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={isPending}
            onClick={() => handleVerify(false)}
            className="h-11 gap-2 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <XCircle className="size-4" aria-hidden="true" />
            انصراف از پرداخت
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ZarinpalMockGateway;

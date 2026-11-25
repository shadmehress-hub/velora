"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Loader2,
  MapPin,
  Truck,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createOrderAction,
  type OrderActionState,
} from "@/lib/actions/order.action";
import { cn, formatNumber, formatPrice } from "@/lib/utils";
import type { CartView } from "@/types/index";

const initialState: OrderActionState = {
  success: false,
  message: "",
};

function ShippingForm({
  cart,
  defaultName,
}: {
  cart: CartView;
  defaultName: string;
}) {
  const [state, formAction, isPending] = useActionState(
    createOrderAction,
    initialState,
  );
  const [paymentMethod, setPaymentMethod] = useState<"zarinpal" | "cod">(
    "zarinpal",
  );

  return (
    <div className="space-y-6 py-4 sm:py-6">
      {/* Header + 3-Step Progress */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            تکمیل اطلاعات ارسال و پرداخت
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            نشانی گیرنده و شیوه پرداخت را مشخص کنید
          </p>
        </div>

        <Link
          href="/cart"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ArrowRight className="size-4" aria-hidden="true" />
          بازگشت به سبد خرید
        </Link>
      </div>

      {/* Stepper */}
      <div
        aria-label="مراحل خرید"
        className="grid grid-cols-3 gap-2 rounded-2xl border border-border/70 bg-card p-3 text-xs sm:text-sm"
      >
        <div className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
          <span className="font-medium">۱. سبد خرید</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 rounded-xl bg-primary/10 py-1.5 font-bold text-foreground">
          <MapPin className="size-4 shrink-0 text-sky-500" aria-hidden="true" />
          <span>۲. آدرس و پرداخت</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
          <CreditCard className="size-4 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">۳. تایید و تکمیل</span>
          <span className="sm:hidden">۳. تکمیل</span>
        </div>
      </div>

      <form
        action={formAction}
        className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-8"
      >
        {/* Address & Payment Method */}
        <div className="space-y-6 lg:col-span-8">
          <section className="space-y-4 rounded-2xl border border-border/70 bg-card p-5 shadow-xs sm:p-6">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <MapPin className="size-4 text-sky-500" aria-hidden="true" />
              <h2 className="text-base font-bold text-foreground">
                مشخصات گیرنده و نشانی
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">نام و نام خانوادگی</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  defaultValue={defaultName}
                  placeholder="مثلاً علی رضایی"
                  required
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">شماره موبایل</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  dir="ltr"
                  placeholder="09123456789"
                  required
                  className="h-10 text-left tabular-nums"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="province">استان</Label>
                <Input
                  id="province"
                  name="province"
                  placeholder="تهران"
                  required
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">شهر</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="تهران"
                  required
                  className="h-10"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="postalCode">کد پستی (۱۰ رقم)</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  dir="ltr"
                  maxLength={10}
                  placeholder="1234567890"
                  required
                  className="h-10 text-left tabular-nums"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">نشانی کامل</Label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  placeholder="خیابان، کوچه، پلاک، واحد..."
                  required
                  className="w-full rounded-xl border border-input bg-transparent px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                />
              </div>
            </div>
          </section>

          {/* Payment Method */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-card p-5 shadow-xs sm:p-6">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <CreditCard className="size-4 text-sky-500" aria-hidden="true" />
              <h2 className="text-base font-bold text-foreground">
                شیوه پرداخت
              </h2>
            </div>

            <input type="hidden" name="paymentMethod" value={paymentMethod} />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("zarinpal")}
                aria-pressed={paymentMethod === "zarinpal"}
                className={cn(
                  "flex items-start gap-3 rounded-xl border p-4 text-right transition-all",
                  paymentMethod === "zarinpal"
                    ? "border-amber-500/70 bg-amber-500/10 ring-2 ring-amber-500/20"
                    : "border-border/70 bg-muted/20 hover:border-border",
                )}
              >
                <CreditCard
                  className="mt-0.5 size-5 shrink-0 text-amber-500"
                  aria-hidden="true"
                />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">
                    پرداخت آنلاین زرین‌پال
                  </p>
                  <p className="text-xs text-muted-foreground">
                    پرداخت امن با تمام کارت‌های عضو شتاب (شبیه‌ساز درگاه)
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                aria-pressed={paymentMethod === "cod"}
                className={cn(
                  "flex items-start gap-3 rounded-xl border p-4 text-right transition-all",
                  paymentMethod === "cod"
                    ? "border-sky-500/70 bg-sky-500/10 ring-2 ring-sky-500/20"
                    : "border-border/70 bg-muted/20 hover:border-border",
                )}
              >
                <Truck
                  className="mt-0.5 size-5 shrink-0 text-sky-500"
                  aria-hidden="true"
                />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">
                    پرداخت در محل
                  </p>
                  <p className="text-xs text-muted-foreground">
                    پرداخت با کارتخوان هنگام تحویل مرسوله
                  </p>
                </div>
              </button>
            </div>
          </section>

          {state.message && !state.success && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-xs font-medium text-destructive sm:text-sm"
            >
              <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
              <span>{state.message}</span>
            </div>
          )}
        </div>

        {/* Sticky Order Summary */}
        <aside className="lg:sticky lg:top-28 lg:col-span-4">
          <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-5 text-card-foreground shadow-xs">
            <h2 className="border-b border-border/60 pb-3 text-base font-bold">
              مرور سفارش ({formatNumber(cart.totalQty)} کالا)
            </h2>

            <div className="max-h-60 space-y-3 overflow-y-auto pl-1">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2.5 text-xs"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted/30">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="40px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="min-w-0">
                      <p
                        dir="auto"
                        className="truncate text-right font-medium text-foreground"
                      >
                        {item.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground tabular-nums">
                        {formatNumber(item.qty)} عدد
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 font-semibold tabular-nums">
                    {formatPrice(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 border-t border-border/60 pt-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">جمع کالاها</span>
                <span className="font-medium tabular-nums">
                  {formatPrice(cart.itemsPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">هزینه ارسال</span>
                <span
                  className={cn(
                    "font-medium tabular-nums",
                    cart.shippingPrice === 0 &&
                      "text-emerald-600 dark:text-emerald-400",
                  )}
                >
                  {cart.shippingPrice === 0
                    ? "رایگان"
                    : formatPrice(cart.shippingPrice)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border/60 pt-4">
              <span className="text-sm font-semibold">مبلغ قابل پرداخت</span>
              <span className="text-lg font-extrabold tabular-nums text-foreground">
                {formatPrice(cart.totalPrice)}
              </span>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isPending}
              className="h-10 w-full gap-2 font-semibold"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  در حال ثبت سفارش...
                </>
              ) : (
                <>
                  {paymentMethod === "zarinpal"
                    ? "ثبت سفارش و انتقال به درگاه"
                    : "ثبت نهایی سفارش"}
                  <ArrowLeft className="size-4" aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </aside>
      </form>
    </div>
  );
}

export default ShippingForm;

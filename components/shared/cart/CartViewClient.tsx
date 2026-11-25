"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  clearCart,
  removeItemFromCart,
  updateCartItemQty,
} from "@/lib/actions/cart.action";
import {
  cn,
  formatNumber,
  formatPrice,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/utils";
import type { CartView } from "@/types/index";

function CartViewClient({ cart }: { cart: CartView | null }) {
  const [isPending, startTransition] = useTransition();
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!cart || cart.items.length === 0) {
    return (
      <section className="mx-auto my-8 flex max-w-lg flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/50 px-6 py-14 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
          <ShoppingBag className="size-8" />
        </div>
        <h1 className="mt-5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          سبد خرید شما خالی است
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          می‌توانید برای مشاهده محصولات ویژه و افزودن کالا به سبد، به فروشگاه
          بازگردید.
        </p>
        <Link
          href="/"
          className={cn(buttonVariants({ size: "lg" }), "mt-6 gap-2")}
        >
          مشاهده محصولات
          <ArrowLeft className="size-4" />
        </Link>
      </section>
    );
  }

  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - cart.itemsPrice,
  );
  const freeShippingProgress = Math.min(
    100,
    Math.round((cart.itemsPrice / FREE_SHIPPING_THRESHOLD) * 100),
  );

  const handleQtyChange = (productId: string, nextQty: number) => {
    setErrorMessage(null);
    setPendingProductId(productId);
    startTransition(async () => {
      const res = await updateCartItemQty(productId, nextQty);
      if (!res.success) {
        setErrorMessage(res.message);
      }
      setPendingProductId(null);
    });
  };

  const handleRemove = (productId: string) => {
    setErrorMessage(null);
    setPendingProductId(productId);
    startTransition(async () => {
      const res = await removeItemFromCart(productId);
      if (!res.success) {
        setErrorMessage(res.message);
      }
      setPendingProductId(null);
    });
  };

  const handleClear = () => {
    setErrorMessage(null);
    setPendingProductId("ALL");
    startTransition(async () => {
      const res = await clearCart();
      if (!res.success) {
        setErrorMessage(res.message);
      }
      setPendingProductId(null);
    });
  };

  return (
    <div className="space-y-6 py-4 sm:py-6">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            سبد خرید
          </h1>
          <Badge variant="secondary" className="tabular-nums">
            {formatNumber(cart.totalQty)} کالا
          </Badge>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={handleClear}
          className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-4" />
          پاک کردن سبد
        </Button>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-xs font-medium text-destructive sm:text-sm"
        >
          {errorMessage}
        </div>
      )}

      {/* 2-Column Digikala-style Cart Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
        {/* Cart Items List */}
        <div className="space-y-4 lg:col-span-8">
          {/* Free shipping progress card */}
          <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <Truck className="size-4 shrink-0 text-sky-500" />
                {remainingForFreeShipping === 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400">
                    ارسال این سفارش برای شما رایگان است!
                  </span>
                ) : (
                  <span>
                    تا ارسال رایگان{" "}
                    <strong className="tabular-nums">
                      {formatPrice(remainingForFreeShipping)}
                    </strong>{" "}
                    باقی مانده
                  </span>
                )}
              </div>
              <span className="text-xs tabular-nums text-muted-foreground">
                {formatNumber(freeShippingProgress)}٪
              </span>
            </div>
            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-600 transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items */}
          <div className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs">
            {cart.items.map((item) => {
              const isItemBusy =
                isPending &&
                (pendingProductId === item.productId ||
                  pendingProductId === "ALL");

              return (
                <article
                  key={item.id}
                  className={cn(
                    "flex flex-col gap-4 p-4 transition-opacity sm:flex-row sm:items-center sm:justify-between sm:p-5",
                    isItemBusy && "opacity-60",
                  )}
                >
                  <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                    <Link
                      href={`/product/${item.slug}`}
                      className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted/30 sm:size-28"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 80px, 112px"
                        className="object-contain p-2 sm:p-2.5"
                      />
                    </Link>

                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                        <span>{item.brand}</span>
                        <span>•</span>
                        <span>{item.category}</span>
                      </div>

                      <Link
                        href={`/product/${item.slug}`}
                        dir="auto"
                        className="line-clamp-1 text-right text-sm font-semibold text-foreground transition-colors hover:text-primary sm:text-base"
                      >
                        {item.name}
                      </Link>

                      <p className="text-xs text-muted-foreground">
                        قیمت واحد:{" "}
                        <span className="font-medium tabular-nums text-foreground">
                          {formatPrice(item.price)}
                        </span>
                      </p>

                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck className="size-3.5" />
                        <span>گارانتی اصالت و سلامت فیزیکی کالا</span>
                      </div>
                    </div>
                  </div>

                  {/* Controls + Line Total */}
                  <div className="flex items-center justify-between gap-4 border-t border-border/50 pt-3 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
                    <div className="flex items-center gap-1 rounded-xl border border-border/80 bg-muted/30 p-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        disabled={isItemBusy || item.qty >= item.stock}
                        onClick={() =>
                          handleQtyChange(item.productId, item.qty + 1)
                        }
                        aria-label="افزایش تعداد"
                      >
                        <Plus className="size-3.5" />
                      </Button>

                      <span className="min-w-7 text-center text-sm font-bold tabular-nums">
                        {isItemBusy ? (
                          <Loader2 className="mx-auto size-3.5 animate-spin" />
                        ) : (
                          formatNumber(item.qty)
                        )}
                      </span>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        disabled={isItemBusy}
                        onClick={() =>
                          handleQtyChange(item.productId, item.qty - 1)
                        }
                        aria-label={
                          item.qty === 1 ? "حذف محصول" : "کاهش تعداد"
                        }
                        className={cn(
                          item.qty === 1 &&
                            "text-destructive hover:text-destructive",
                        )}
                      >
                        {item.qty === 1 ? (
                          <Trash2 className="size-3.5" />
                        ) : (
                          <Minus className="size-3.5" />
                        )}
                      </Button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold tabular-nums text-foreground">
                        {formatPrice(item.price * item.qty)}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        disabled={isItemBusy}
                        onClick={() => handleRemove(item.productId)}
                        aria-label="حذف از سبد خرید"
                        className="hidden text-muted-foreground hover:text-destructive sm:inline-flex"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Sticky Order Summary Box */}
        <aside className="lg:sticky lg:top-6 lg:col-span-4">
          <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-5 text-card-foreground shadow-xs">
            <h2 className="border-b border-border/60 pb-3 text-base font-bold">
              خلاصه سبد خرید
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  جمع کالاها ({formatNumber(cart.totalQty)})
                </span>
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
              <span className="text-lg font-extrabold tabular-nums text-foreground sm:text-xl">
                {formatPrice(cart.totalPrice)}
              </span>
            </div>

            <Link
              href="/shipping"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-10 w-full gap-2 font-semibold",
              )}
            >
              ادامه فرآیند خرید
              <ArrowLeft className="size-4" />
            </Link>

            <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
              کالاهای موجود در سبد شما تا زمان تکمیل خرید رزرو نمی‌شوند.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default CartViewClient;

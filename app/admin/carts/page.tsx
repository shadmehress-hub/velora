import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, User as UserIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminCarts } from "@/lib/actions/admin.action";
import { formatNumber, formatPrice } from "@/lib/utils";

async function AdminCartsContent() {
  const carts = await getAdminCarts();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            سبدهای خرید فعال
          </h1>
          <Badge variant="secondary" className="tabular-nums">
            {formatNumber(carts.length)} سبد
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground sm:text-sm">
          مشاهده کالاهای انتخاب‌شده توسط مشتریان و کاربران مهمان
        </p>
      </div>

      {carts.length > 0 ? (
        <div className="space-y-4">
          {carts.map((cart) => (
            <section
              key={cart.id}
              className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/25 px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <UserIcon className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {cart.user?.name || "کاربر مهمان"}
                      </span>
                      <Badge
                        variant={cart.isGuest ? "outline" : "secondary"}
                        className="text-[10px]"
                      >
                        {cart.isGuest ? "مهمان" : "عضو"}
                      </Badge>
                    </div>
                    <p
                      dir="ltr"
                      className="text-right text-xs text-muted-foreground"
                    >
                      {cart.user?.email || `Session: ${cart.sessionCartId.slice(0, 8)}...`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs sm:text-sm">
                  <span className="text-muted-foreground tabular-nums">
                    {formatNumber(cart.totalQty)} کالا
                  </span>
                  <span className="font-bold tabular-nums text-foreground">
                    {formatPrice(cart.totalPrice)}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-border/40 px-5">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted/30">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="40px"
                          className="object-contain p-1"
                        />
                      </div>
                      <Link
                        href={`/product/${item.slug}`}
                        dir="auto"
                        className="truncate text-right text-sm font-medium text-foreground hover:underline"
                      >
                        {item.name}
                      </Link>
                    </div>

                    <div className="flex items-center gap-3 text-xs tabular-nums">
                      <span className="text-muted-foreground">
                        {formatNumber(item.qty)} × {formatPrice(item.price)}
                      </span>
                      <span className="font-semibold text-foreground">
                        {formatPrice(item.qty * item.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
          <ShoppingCart
            className="size-8 text-muted-foreground"
            aria-hidden="true"
          />
          <p className="mt-3 text-sm font-medium text-foreground">
            در حال حاضر سبد خرید فعالی وجود ندارد
          </p>
        </div>
      )}
    </div>
  );
}

export default function AdminCartsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-80 w-full rounded-2xl" />}>
      <AdminCartsContent />
    </Suspense>
  );
}

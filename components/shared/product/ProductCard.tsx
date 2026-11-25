import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { formatNumber, formatPrice } from "@/lib/utils";
import type { Product } from "@/types/index";
import QuickAddButton from "./QuickAddButton";

function ProductCard({ product }: { product: Product }) {
  const isOutOfStock = product.stock <= 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card text-card-foreground shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-md">
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-square w-full overflow-hidden bg-muted/40"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute top-3 right-3 rounded-md border border-border/50 bg-background/85 px-2.5 py-0.5 text-xs font-medium text-foreground backdrop-blur-xs">
          {product.category}
        </span>
        {isOutOfStock && (
          <span className="absolute top-3 left-3 rounded-md bg-destructive/90 px-2.5 py-0.5 text-xs font-medium text-white">
            ناموجود
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>{product.brand}</span>
            {(product.numReviews ?? 0) > 0 && (
              <span className="inline-flex items-center gap-0.5 font-medium text-foreground tabular-nums">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                {formatNumber(product.rating ?? 0)}
                <span className="text-[11px] text-muted-foreground">
                  ({formatNumber(product.numReviews ?? 0)})
                </span>
              </span>
            )}
          </div>
          <span
            className={
              isOutOfStock
                ? "font-medium text-destructive"
                : "font-medium text-emerald-600 dark:text-emerald-400"
            }
          >
            {isOutOfStock ? "اتمام موجودی" : "موجود"}
          </span>
        </div>

        <Link
          href={`/product/${product.slug}`}
          dir="auto"
          className="line-clamp-1 text-right text-base font-semibold tracking-tight transition-colors group-hover:text-primary"
        >
          {product.name}
        </Link>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/50 pt-3">
          <span className="text-base font-bold tabular-nums text-foreground">
            {formatPrice(product.price)}
          </span>

          <QuickAddButton productId={product.id} disabled={isOutOfStock} />
        </div>
      </div>
    </article>
  );
}

export default ProductCard;

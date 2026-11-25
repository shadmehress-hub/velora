"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, LayoutGrid } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatNumber } from "@/lib/utils";
import type { Product } from "@/types/index";
import ProductCard from "./ProductCard";

interface ProductListProps {
  data: Product[];
  title?: string;
  limit?: number;
  showCategories?: boolean;
}

function ProductList({
  data,
  title,
  limit,
  showCategories = false,
}: ProductListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("همه");
  const [showAll, setShowAll] = useState(false);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(data.map((item) => item.category)));
    return ["همه", ...unique];
  }, [data]);

  const filteredData = useMemo(() => {
    if (selectedCategory === "همه") return data;
    return data.filter((item) => item.category === selectedCategory);
  }, [data, selectedCategory]);

  const effectiveLimit =
    !showAll && limit && limit > 0 ? limit : filteredData.length;
  const visibleData = filteredData.slice(0, effectiveLimit);
  const hasMore = Boolean(limit && limit > 0 && filteredData.length > limit);

  return (
    <section className="my-4 space-y-5 sm:my-8 sm:space-y-6">
      {(title || showCategories) && (
        <div className="flex flex-col gap-4 border-b border-border/60 pb-4 sm:flex-row sm:items-center sm:justify-between">
          {title && (
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {title}
              </h2>
              <Badge variant="secondary" className="tabular-nums">
                {formatNumber(filteredData.length)} کالا
              </Badge>
            </div>
          )}

          {showCategories && categories.length > 1 && (
            <div
              role="tablist"
              aria-label="فیلتر دسته‌بندی محصولات"
              className="flex flex-wrap items-center gap-1.5"
            >
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowAll(false);
                    }}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all sm:text-sm",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground shadow-xs"
                        : "border-border/70 bg-card text-muted-foreground hover:border-border hover:text-foreground",
                    )}
                  >
                    {category === "همه" && <LayoutGrid className="size-3.5" />}
                    <span>{category}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {visibleData.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {visibleData.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setShowAll((prev) => !prev)}
                className="gap-2 rounded-full px-6"
              >
                {showAll ? (
                  <>
                    نمایش کمتر
                    <ChevronUp className="size-4" />
                  </>
                ) : (
                  <>
                    مشاهده همه ({formatNumber(filteredData.length)} محصول)
                    <ChevronDown className="size-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground sm:p-10">
          محصولی یافت نشد.
        </div>
      )}
    </section>
  );
}

export default ProductList;

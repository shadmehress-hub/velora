import Link from "next/link";
import { LayoutGrid } from "lucide-react";

import { getCategoriesWithMeta } from "@/lib/actions/product.action";
import { formatNumber } from "@/lib/utils";

async function CategoryNav() {
  const categories = await getCategoriesWithMeta();

  return (
    <div className="border-t border-border/40 bg-muted/20">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 text-xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-2 sm:px-6 sm:text-sm lg:px-10">
        <Link
          href="/search"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium text-foreground transition-colors hover:bg-muted"
        >
          <LayoutGrid className="size-3.5 text-sky-500" />
          <span>همه محصولات</span>
        </Link>

        <span className="h-3.5 w-px shrink-0 bg-border/70" />

        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/search?category=${encodeURIComponent(category.name)}`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <span>{category.name}</span>
            <span className="text-[11px] tabular-nums text-muted-foreground/70">
              ({formatNumber(category.count)})
            </span>
          </Link>
        ))}

        <span className="h-3.5 w-px shrink-0 bg-border/70" />

        <Link
          href="/about"
          className="inline-flex shrink-0 items-center rounded-lg px-2.5 py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          درباره ما
        </Link>
      </div>
    </div>
  );
}

export default CategoryNav;

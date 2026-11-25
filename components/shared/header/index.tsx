import { Suspense } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Logo from "../Logo";
import CartButton from "./CartButton";
import CategoryNav from "./CategoryNav";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";
import UserButton from "./UserButton";

function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
        <Logo />

        {/* Desktop Search Bar */}
        <div className="order-3 w-full md:order-2 md:max-w-md md:flex-1 lg:max-w-lg">
          <Suspense fallback={<Skeleton className="h-9 w-full rounded-xl" />}>
            <SearchBar />
          </Suspense>
        </div>

        <nav className="order-2 flex items-center gap-1 sm:gap-2 md:order-3">
          <ThemeToggle />
          <Suspense
            fallback={
              <Link
                href="/cart"
                aria-label="سبد خرید"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                <ShoppingCart className="size-4" />
                <span className="hidden sm:inline">سبد خرید</span>
              </Link>
            }
          >
            <CartButton />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-7 w-9 rounded-lg sm:w-24" />}>
            <UserButton />
          </Suspense>
        </nav>
      </div>

      {/* Category Quick Navigation Bar */}
      <Suspense fallback={<div className="h-9 border-t border-border/40 bg-muted/20" />}>
        <CategoryNav />
      </Suspense>
    </header>
  );
}

export default Header;

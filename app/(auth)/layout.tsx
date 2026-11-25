import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

import Logo from "@/components/shared/Logo";
import { buttonVariants } from "@/components/ui/button";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden px-4 py-6 sm:px-6 sm:py-8">
      {/* Subtle ambient glow matching Velora ice-blue emblem */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,rgba(56,189,248,0.12),transparent_70%)] dark:bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,rgba(56,189,248,0.14),transparent_70%)]"
      />

      {/* Top bar */}
      <div className="flex w-full max-w-5xl items-center justify-between gap-2">
        <Logo />
        <Link
          href="/"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ArrowRight className="size-4" />
          بازگشت به فروشگاه
        </Link>
      </div>

      {/* Main auth card */}
      <main className="my-8 flex w-full flex-1 items-center justify-center">
        {children}
      </main>

      {/* Subtle footer trust line */}
      <footer className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5 text-sky-500" />
        <span>اتصال امن و رمزنگاری‌شده — فروشگاه ولورا</span>
      </footer>
    </div>
  );
}

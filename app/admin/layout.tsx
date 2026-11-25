import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, ShieldAlert, Store } from "lucide-react";

import { getServerSession } from "@/lib/session";
import AdminNav from "@/components/admin/AdminNav";
import Logo from "@/components/shared/Logo";
import ThemeToggle from "@/components/shared/header/ThemeToggle";
import UserButton from "@/components/shared/header/UserButton";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "پنل مدیریت",
};

function AdminShellSkeleton() {
  return (
    <div className="min-h-screen space-y-6 p-4 sm:p-6">
      <Skeleton className="h-16 w-full rounded-2xl" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-12">
        <Skeleton className="h-12 w-full rounded-2xl lg:col-span-3 lg:h-64" />
        <Skeleton className="h-96 w-full rounded-2xl lg:col-span-9" />
      </div>
    </div>
  );
}

async function AdminGate({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/signin?callbackUrl=/admin");
  }

  if (session.user.role !== "admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-4 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <ShieldAlert className="size-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">
            دسترسی غیرمجاز
          </h1>
          <p className="text-sm text-muted-foreground">
            فقط کاربران با نقش مدیر به این بخش دسترسی دارند.
          </p>
        </div>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
        >
          <ArrowRight className="size-4" />
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3">
            <Logo />
            <Badge
              variant="secondary"
              className="hidden border border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400 sm:inline-flex"
            >
              پنل مدیریت
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "gap-1.5",
              )}
            >
              <Store className="size-4" />
              <span className="hidden sm:inline">مشاهده فروشگاه</span>
            </Link>
            <ThemeToggle />
            <UserButton />
          </div>
        </div>
      </header>

      {/* Main Responsive Admin Area */}
      <div className="mx-auto grid w-full max-w-7xl flex-1 content-start grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-12 lg:items-start lg:px-10">
        <aside className="rounded-2xl border border-border/70 bg-card p-3 shadow-xs lg:sticky lg:top-24 lg:col-span-3 lg:p-4">
          <AdminNav />
        </aside>

        <main className="min-w-0 lg:col-span-9">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<AdminShellSkeleton />}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}

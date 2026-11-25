"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorViewProps {
  error: unknown;
  retry: () => void;
  homeHref?: string;
  homeLabel?: string;
}

function ErrorView({
  error,
  retry,
  homeHref = "/",
  homeLabel = "بازگشت به صفحه اصلی",
}: ErrorViewProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const digest =
    error instanceof Error &&
    "digest" in error &&
    typeof error.digest === "string"
      ? error.digest
      : null;

  return (
    <section className="relative flex w-full items-center justify-center py-10 sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_45%_at_50%_40%,rgba(239,68,68,0.10),transparent_70%)]"
      />

      <div
        role="alert"
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border/80 bg-card/95 p-6 text-center shadow-lg shadow-black/5 backdrop-blur-xs dark:shadow-black/30 sm:p-10"
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-destructive/75 to-transparent"
        />

        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-destructive/25 bg-destructive/10 text-destructive">
          <AlertTriangle className="size-7" aria-hidden="true" />
        </div>

        <Badge variant="destructive" className="mx-auto mt-4">
          خطای غیرمنتظره
        </Badge>

        <h1 className="mt-3 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          مشکلی در بارگذاری صفحه رخ داد
        </h1>

        <p className="mx-auto mt-2.5 max-w-md text-xs leading-6 text-muted-foreground sm:text-sm">
          ممکن است این خطا موقتی باشد. لطفاً دوباره تلاش کنید یا به صفحه اصلی
          بازگردید.
        </p>

        {digest && (
          <p
            dir="ltr"
            className="mt-3 inline-block rounded-lg border border-border/60 bg-muted/40 px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
          >
            Ref: {digest}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            type="button"
            size="lg"
            onClick={() => retry()}
            className="gap-2 rounded-xl"
          >
            <RotateCw className="size-4" aria-hidden="true" />
            تلاش مجدد
          </Button>
          <Link
            href={homeHref}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "gap-2 rounded-xl",
            )}
          >
            <Home className="size-4" aria-hidden="true" />
            {homeLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ErrorView;

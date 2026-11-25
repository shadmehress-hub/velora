import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/session";
import SignInForm from "@/components/shared/auth/SignInForm";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "ورود به حساب کاربری",
};

function SignInSkeleton() {
  return (
    <div className="w-full max-w-md space-y-6 rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
      <div className="space-y-2 text-center">
        <Skeleton className="mx-auto h-7 w-44" />
        <Skeleton className="mx-auto h-4 w-56" />
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

async function SignInContent({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  const session = await getServerSession();

  const safeCallbackUrl =
    callbackUrl &&
    callbackUrl.startsWith("/") &&
    !callbackUrl.startsWith("//")
      ? callbackUrl
      : "/";

  if (session?.user) {
    redirect(safeCallbackUrl);
  }

  return <SignInForm callbackUrl={safeCallbackUrl} />;
}

export default function SignInPage(props: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  return (
    <Suspense fallback={<SignInSkeleton />}>
      <SignInContent searchParams={props.searchParams} />
    </Suspense>
  );
}

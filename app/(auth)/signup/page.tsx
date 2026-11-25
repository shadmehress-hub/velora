import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/session";
import SignUpForm from "@/components/shared/auth/SignUpForm";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "ثبت‌نام در فروشگاه",
};

function SignUpSkeleton() {
  return (
    <div className="w-full max-w-md space-y-5 rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
      <div className="space-y-2 text-center">
        <Skeleton className="mx-auto h-7 w-40" />
        <Skeleton className="mx-auto h-4 w-56" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

async function SignUpContent() {
  const session = await getServerSession();
  if (session?.user) {
    redirect("/");
  }
  return <SignUpForm />;
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<SignUpSkeleton />}>
      <SignUpContent />
    </Suspense>
  );
}

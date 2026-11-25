"use client";

import ErrorView from "@/components/shared/ErrorView";

export default function RootError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <ErrorView error={error} retry={retry} />
    </div>
  );
}

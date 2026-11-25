"use client";

import ErrorView from "@/components/shared/ErrorView";

export default function StoreError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return <ErrorView error={error} retry={retry} />;
}

"use client";

import ErrorView from "@/components/shared/ErrorView";

export default function AdminError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <ErrorView
      error={error}
      retry={retry}
      homeHref="/admin"
      homeLabel="بازگشت به داشبورد"
    />
  );
}

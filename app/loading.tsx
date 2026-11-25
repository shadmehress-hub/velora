import Logo from "@/components/shared/Logo";

export default function GlobalLoading() {
  return (
    <div
      role="status"
      aria-label="در حال بارگذاری صفحه"
      className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-4"
    >
      <div className="animate-pulse">
        <Logo />
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
        <span className="size-2 animate-ping rounded-full bg-sky-500" />
        <span>در حال بارگذاری...</span>
      </div>
    </div>
  );
}

import Logo from "@/components/shared/Logo";
import NotFoundView from "@/components/shared/NotFoundView";

export default function GlobalNotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="mb-2">
        <Logo />
      </div>
      <NotFoundView />
    </div>
  );
}

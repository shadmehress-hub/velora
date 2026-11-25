import { Suspense } from "react";
import Link from "next/link";
import { RotateCcw, Search, Shield, User as UserIcon } from "lucide-react";

import { getServerSession } from "@/lib/session";
import ToggleRoleButton from "@/components/admin/ToggleRoleButton";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminUsers } from "@/lib/actions/admin.action";
import { cn, formatNumber } from "@/lib/utils";

const ROLE_TABS = [
  { value: "all", label: "همه" },
  { value: "admin", label: "مدیران" },
  { value: "user", label: "کاربران" },
];

async function AdminUsersContent({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const activeRole = sp.role || "all";

  const [users, session] = await Promise.all([
    getAdminUsers(q, activeRole),
    getServerSession(),
  ]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            مدیریت کاربران
          </h1>
          <Badge variant="secondary" className="tabular-nums">
            {formatNumber(users.length)} کاربر
          </Badge>
        </div>

        <div
          role="navigation"
          aria-label="فیلتر نقش کاربران"
          className="flex items-center gap-1.5"
        >
          {ROLE_TABS.map((tab) => {
            const isActive = activeRole === tab.value;
            const params = new URLSearchParams();
            if (q) params.set("q", q);
            if (tab.value !== "all") params.set("role", tab.value);
            const qs = params.toString();

            return (
              <Link
                key={tab.value}
                href={qs ? `/admin/users?${qs}` : "/admin/users"}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors sm:text-sm",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/70 bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Search Bar */}
      <form
        action="/admin/users"
        method="GET"
        className="flex flex-wrap items-center gap-2"
      >
        {activeRole !== "all" && (
          <input type="hidden" name="role" value={activeRole} />
        )}
        <div className="relative min-w-56 flex-1">
          <Label htmlFor="admin-user-search" className="sr-only">
            جستجوی کاربر
          </Label>
          <Search
            className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="admin-user-search"
            name="q"
            defaultValue={q}
            placeholder="جستجو بر اساس نام یا ایمیل..."
            className="h-9 pr-9"
          />
        </div>
        <Button type="submit" variant="outline" size="sm" className="h-9">
          جستجو
        </Button>
        {(q || activeRole !== "all") && (
          <Link
            href="/admin/users"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "h-9 gap-1",
            )}
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            پاک کردن
          </Link>
        )}
      </form>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <caption className="sr-only">جدول مدیریت کاربران ولورا</caption>
            <thead className="border-b border-border/60 bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  نام
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  ایمیل
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  نقش
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  سبد فعال
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  تاریخ عضویت
                </th>
                <th scope="col" className="px-4 py-3 text-left font-semibold">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {users.map((user) => {
                const isAdmin = user.role === "admin";
                const isSelf = session?.user?.id === user.id;

                return (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-muted/25"
                  >
                    <td className="px-4 py-3 font-semibold text-foreground">
                      {user.name || "بدون نام"}
                    </td>
                    <td
                      dir="ltr"
                      className="px-4 py-3 text-right text-xs text-muted-foreground sm:text-sm"
                    >
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={isAdmin ? "default" : "secondary"}
                        className="gap-1"
                      >
                        {isAdmin ? (
                          <>
                            <Shield className="size-3" aria-hidden="true" />
                            مدیر
                          </>
                        ) : (
                          <>
                            <UserIcon className="size-3" aria-hidden="true" />
                            کاربر
                          </>
                        )}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs tabular-nums text-muted-foreground">
                      {user.cartQty > 0
                        ? `${formatNumber(user.cartQty)} کالا`
                        : "خالی"}
                    </td>
                    <td className="px-4 py-3 text-xs tabular-nums text-muted-foreground">
                      {new Intl.DateTimeFormat("fa-IR").format(
                        new Date(user.createdAt),
                      )}
                    </td>
                    <td className="px-4 py-3 text-left">
                      <ToggleRoleButton
                        userId={user.id}
                        currentRole={user.role}
                        isSelf={isSelf}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {users.map((user) => {
          const isAdmin = user.role === "admin";
          const isSelf = session?.user?.id === user.id;

          return (
            <div
              key={user.id}
              className="space-y-3 rounded-2xl border border-border/70 bg-card p-4 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {user.name || "بدون نام"}
                  </p>
                  <p
                    dir="ltr"
                    className="truncate text-right text-xs text-muted-foreground"
                  >
                    {user.email}
                  </p>
                </div>
                <Badge
                  variant={isAdmin ? "default" : "secondary"}
                  className="shrink-0 gap-1"
                >
                  {isAdmin ? "مدیر" : "کاربر"}
                </Badge>
              </div>

              <div className="flex items-center justify-between border-t border-border/50 pt-3">
                <span className="text-xs tabular-nums text-muted-foreground">
                  سبد: {user.cartQty > 0 ? `${formatNumber(user.cartQty)} کالا` : "خالی"}
                </span>
                <ToggleRoleButton
                  userId={user.id}
                  currentRole={user.role}
                  isSelf={isSelf}
                />
              </div>
            </div>
          );
        })}
      </div>

      {users.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          کاربری با این مشخصات یافت نشد.
        </div>
      )}
    </div>
  );
}

export default function AdminUsersPage(props: {
  searchParams: Promise<{ q?: string; role?: string }>;
}) {
  return (
    <Suspense fallback={<Skeleton className="h-80 w-full rounded-2xl" />}>
      <AdminUsersContent searchParams={props.searchParams} />
    </Suspense>
  );
}

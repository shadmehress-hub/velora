import Link from "next/link";
import {
  ChevronDown,
  LayoutDashboard,
  LogIn,
  LogOut,
  PackageCheck,
  Shield,
  ShoppingBag,
  User as UserIcon,
} from "lucide-react";

import { getServerSession } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutUser } from "@/lib/actions/user.action";
import { cn } from "@/lib/utils";

async function UserButton() {
  const session = await getServerSession();

  if (!session?.user) {
    return (
      <Link
        href="/signin"
        aria-label="ورود به حساب کاربری"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "gap-1.5 border-border/80",
        )}
      >
        <LogIn className="size-4" />
        <span className="hidden sm:inline">ورود</span>
      </Link>
    );
  }

  const displayName = session.user.name || session.user.email || "کاربر";
  const initial = displayName.charAt(0).toUpperCase();
  const isAdmin = session.user.role === "admin";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            aria-label="منوی حساب کاربری"
            className="gap-2 rounded-full border-border/80 pr-1.5 pl-2.5"
          />
        }
      >
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-[11px] font-bold text-white shadow-xs">
          {initial}
        </span>
        <span className="hidden max-w-28 truncate text-xs font-medium sm:inline">
          {displayName}
        </span>
        <ChevronDown className="hidden size-3.5 text-muted-foreground sm:inline" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-60 rounded-xl p-1.5">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-2">
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-sm font-bold text-white shadow-xs">
                {initial}
              </span>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-foreground">
                    {session.user.name || "کاربر"}
                  </span>
                  <Badge
                    variant={isAdmin ? "default" : "secondary"}
                    className="gap-1 px-1.5 py-0 text-[10px]"
                  >
                    {isAdmin ? (
                      <>
                        <Shield className="size-2.5" />
                        مدیر
                      </>
                    ) : (
                      <>
                        <UserIcon className="size-2.5" />
                        کاربر
                      </>
                    )}
                  </Badge>
                </div>
                <p
                  dir="ltr"
                  className="truncate text-left text-xs font-normal text-muted-foreground"
                >
                  {session.user.email}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {isAdmin && (
          <DropdownMenuItem render={<Link href="/admin" className="w-full" />}>
            <LayoutDashboard />
            پنل مدیریت
          </DropdownMenuItem>
        )}

        <DropdownMenuItem render={<Link href="/orders" className="w-full" />}>
          <PackageCheck />
          سفارش‌های من
        </DropdownMenuItem>

        <DropdownMenuItem render={<Link href="/cart" className="w-full" />}>
          <ShoppingBag />
          سبد خرید من
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <form action={signOutUser} className="w-full">
          <DropdownMenuItem
            variant="destructive"
            render={<button type="submit" className="w-full" />}
          >
            <LogOut />
            خروج از حساب
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserButton;

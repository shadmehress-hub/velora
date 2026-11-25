"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ReceiptText,
  ShoppingCart,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

const ADMIN_LINKS = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "سفارش‌ها", icon: ReceiptText, exact: false },
  { href: "/admin/products", label: "محصولات", icon: Package, exact: false },
  {
    href: "/admin/products/new",
    label: "افزودن محصول",
    icon: PlusCircle,
    exact: true,
  },
  { href: "/admin/carts", label: "سبدهای فعال", icon: ShoppingCart, exact: false },
  { href: "/admin/users", label: "کاربران", icon: Users, exact: false },
];

function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="منوی پنل مدیریت"
      className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-col lg:items-stretch"
    >
      {ADMIN_LINKS.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname === item.href ||
            (pathname.startsWith(`${item.href}/`) &&
              item.href !== "/admin/products/new" &&
              pathname !== "/admin/products/new");

        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex min-h-10 shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-medium transition-colors sm:text-sm",
              isActive
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default AdminNav;

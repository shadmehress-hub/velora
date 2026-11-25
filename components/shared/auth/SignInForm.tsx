"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  signInWithCredentials,
  type AuthActionState,
} from "@/lib/actions/user.action";

const initialState: AuthActionState = {
  success: false,
  message: "",
};

function SignInForm({ callbackUrl = "/" }: { callbackUrl?: string }) {
  const [state, formAction, isPending] = useActionState(
    signInWithCredentials,
    initialState,
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border/80 bg-card/95 p-6 text-card-foreground shadow-lg shadow-black/5 backdrop-blur-xs dark:shadow-black/30 sm:p-8">
      {/* Subtle top accent line */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-sky-400/80 to-transparent"
      />

      <div className="space-y-2 text-center">
        <div className="mx-auto inline-flex items-center rounded-full border border-border/60 bg-muted/50 px-3 py-1 text-[11px] font-medium text-muted-foreground">
          خوش آمدید
        </div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          ورود به حساب کاربری
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          برای ادامه خرید و مدیریت سفارش‌ها وارد شوید
        </p>
      </div>

      <form action={formAction} className="mt-6 space-y-4">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />

        {/* Email field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-medium sm:text-sm">
            ایمیل
          </Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              dir="ltr"
              autoComplete="email"
              placeholder="name@example.com"
              required
              className="h-10 pl-9 pr-3 text-left"
            />
          </div>
        </div>

        {/* Password field with show/hide toggle */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-xs font-medium sm:text-sm">
            رمز عبور
          </Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              dir="ltr"
              autoComplete="current-password"
              placeholder="••••••"
              required
              className="h-10 px-9 text-left"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        {/* Error feedback */}
        {state.message && !state.success && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-xs font-medium text-destructive sm:text-sm"
          >
            <AlertCircle className="size-4 shrink-0" />
            <span>{state.message}</span>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          className="mt-2 h-10 w-full gap-2 font-semibold"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              در حال ورود...
            </>
          ) : (
            <>
              <LogIn className="size-4" />
              ورود به حساب
            </>
          )}
        </Button>
      </form>

      <p className="mt-5 text-center text-xs text-muted-foreground">
        حساب کاربری ندارید؟{" "}
        <Link
          href="/signup"
          className="font-semibold text-foreground underline-offset-4 hover:underline"
        >
          ثبت‌نام کنید
        </Link>
      </p>
    </div>
  );
}

export default SignInForm;

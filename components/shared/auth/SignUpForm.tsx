"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
  UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpUser, type AuthActionState } from "@/lib/actions/user.action";

const initialState: AuthActionState = {
  success: false,
  message: "",
};

function SignUpForm() {
  const [state, formAction, isPending] = useActionState(
    signUpUser,
    initialState,
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border/80 bg-card/95 p-6 text-card-foreground shadow-lg shadow-black/5 backdrop-blur-xs dark:shadow-black/30 sm:p-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-sky-400/80 to-transparent"
      />

      <div className="space-y-2 text-center">
        <div className="mx-auto inline-flex items-center rounded-full border border-border/60 bg-muted/50 px-3 py-1 text-[11px] font-medium text-muted-foreground">
          عضویت در ولورا
        </div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          ایجاد حساب کاربری
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          مشخصات خود را وارد کنید تا حساب شما ساخته شود
        </p>
      </div>

      <form action={formAction} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs font-medium sm:text-sm">
            نام و نام خانوادگی
          </Label>
          <div className="relative">
            <User className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="مثلاً علی محمدی"
              required
              className="h-10 pr-9 pl-3"
            />
          </div>
        </div>

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
              autoComplete="new-password"
              placeholder="حداقل ۵ کاراکتر"
              required
              className="h-10 px-9 text-left"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-xs font-medium sm:text-sm"
          >
            تکرار رمز عبور
          </Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              dir="ltr"
              autoComplete="new-password"
              placeholder="تکرار رمز عبور"
              required
              className="h-10 px-9 text-left"
            />
          </div>
        </div>

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
              در حال ثبت‌نام...
            </>
          ) : (
            <>
              <UserPlus className="size-4" />
              ایجاد حساب
            </>
          )}
        </Button>
      </form>

      <p className="mt-5 text-center text-xs text-muted-foreground">
        قبلاً ثبت‌نام کرده‌اید؟{" "}
        <Link
          href="/signin"
          className="font-semibold text-foreground underline-offset-4 hover:underline"
        >
          وارد شوید
        </Link>
      </p>
    </div>
  );
}

export default SignUpForm;

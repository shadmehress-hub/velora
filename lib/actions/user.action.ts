"use server";

import { hash } from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { signInFormSchema, signUpFormSchema } from "@/lib/validator";

export interface AuthActionState {
  success: boolean;
  message: string;
}

export async function signInWithCredentials(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signInFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "اطلاعات وارد شده معتبر نیست.",
    };
  }

  const rawCallback = formData.get("callbackUrl");
  const redirectTo =
    typeof rawCallback === "string" &&
    rawCallback.startsWith("/") &&
    !rawCallback.startsWith("//")
      ? rawCallback
      : "/";

  try {
    await signIn("credentials", {
      email: parsed.data.email.toLowerCase(),
      password: parsed.data.password,
      redirectTo,
    });

    return { success: true, message: "ورود با موفقیت انجام شد." };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: "ایمیل یا رمز عبور اشتباه است.",
      };
    }
    throw error;
  }
}

export async function signUpUser(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signUpFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "اطلاعات وارد شده معتبر نیست.",
    };
  }

  const normalizedEmail = parsed.data.email.toLowerCase();

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return {
        success: false,
        message: "کاربری با این ایمیل قبلاً ثبت‌نام کرده است.",
      };
    }

    const hashedPassword = await hash(parsed.data.password, 10);

    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: normalizedEmail,
        password: hashedPassword,
        role: "user",
      },
    });

    await signIn("credentials", {
      email: normalizedEmail,
      password: parsed.data.password,
      redirectTo: "/",
    });

    return { success: true, message: "ثبت‌نام با موفقیت انجام شد." };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: "ثبت‌نام انجام شد اما ورود خودکار با خطا مواجه شد.",
      };
    }
    throw error;
  }
}

export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}

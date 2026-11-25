"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";
import {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
} from "@/lib/utils";
import { cartItemInputSchema } from "@/lib/validator";
import type { CartItemView, CartView } from "@/types/index";

const SESSION_CART_COOKIE = "sessionCartId";

function calculateTotals(items: CartItemView[]) {
  const itemsPrice = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  const shippingPrice =
    itemsPrice === 0 || itemsPrice >= FREE_SHIPPING_THRESHOLD
      ? 0
      : STANDARD_SHIPPING_FEE;
  const totalPrice = itemsPrice + shippingPrice;

  return { itemsPrice, shippingPrice, totalPrice, totalQty };
}

async function findCart(userId?: string, sessionCartId?: string) {
  if (userId) {
    const userCart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: { product: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });
    if (userCart) return userCart;
  }

  if (sessionCartId) {
    return prisma.cart.findUnique({
      where: { sessionCartId },
      include: {
        items: {
          include: { product: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  return null;
}

async function getOrCreateCart() {
  const session = await auth();
  const userId = session?.user?.id;
  const cookieStore = await cookies();
  let sessionCartId = cookieStore.get(SESSION_CART_COOKIE)?.value;

  if (!sessionCartId) {
    sessionCartId = crypto.randomUUID();
    cookieStore.set(SESSION_CART_COOKIE, sessionCartId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  const existingCart = await findCart(userId, sessionCartId);
  if (existingCart) {
    if (userId && !existingCart.userId) {
      return prisma.cart.update({
        where: { id: existingCart.id },
        data: { userId },
        include: {
          items: {
            include: { product: true },
            orderBy: { createdAt: "asc" },
          },
        },
      });
    }
    return existingCart;
  }

  return prisma.cart.create({
    data: {
      userId: userId ?? null,
      sessionCartId,
    },
    include: {
      items: {
        include: { product: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function getMyCart(): Promise<CartView | null> {
  const session = await getServerSession();
  const userId = session?.user?.id;
  const cookieStore = await cookies();
  const sessionCartId = cookieStore.get(SESSION_CART_COOKIE)?.value;

  if (!userId && !sessionCartId) {
    return null;
  }

  const cart = await findCart(userId, sessionCartId);
  if (!cart) {
    return null;
  }

  const items: CartItemView[] = cart.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.product.name,
    slug: item.product.slug,
    image: item.product.image,
    brand: item.product.brand,
    category: item.product.category,
    price: item.product.price,
    stock: item.product.stock,
    qty: item.qty,
  }));

  const totals = calculateTotals(items);

  return {
    id: cart.id,
    items,
    ...totals,
  };
}

export async function addItemToCart(
  productId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const parsed = cartItemInputSchema.safeParse({ productId, qty: 1 });
    if (!parsed.success) {
      return { success: false, message: "محصول نامعتبر است." };
    }

    const product = await prisma.product.findUnique({
      where: { id: parsed.data.productId },
    });

    if (!product) {
      return { success: false, message: "محصول یافت نشد." };
    }

    if (product.stock <= 0) {
      return { success: false, message: "این محصول ناموجود است." };
    }

    const cart = await getOrCreateCart();
    const existingItem = cart.items.find(
      (item) => item.productId === product.id,
    );
    const nextQty = existingItem ? existingItem.qty + 1 : 1;

    if (nextQty > product.stock) {
      return {
        success: false,
        message: `حداکثر موجودی انبار (${product.stock} عدد) در سبد شما قرار دارد.`,
      };
    }

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { qty: nextQty },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          qty: 1,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/cart");
    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} به سبد خرید اضافه شد.`,
    };
  } catch {
    return {
      success: false,
      message: "خطا در افزودن محصول به سبد خرید.",
    };
  }
}

export async function updateCartItemQty(
  productId: string,
  qty: number,
): Promise<{ success: boolean; message: string }> {
  try {
    const parsed = cartItemInputSchema.safeParse({ productId, qty });
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message ?? "مقدار نامعتبر است.",
      };
    }

    const session = await auth();
    const cookieStore = await cookies();
    const sessionCartId = cookieStore.get(SESSION_CART_COOKIE)?.value;
    const cart = await findCart(session?.user?.id, sessionCartId);

    if (!cart) {
      return { success: false, message: "سبد خرید یافت نشد." };
    }

    const existingItem = cart.items.find(
      (item) => item.productId === parsed.data.productId,
    );

    if (!existingItem) {
      return { success: false, message: "این کالا در سبد خرید وجود ندارد." };
    }

    if (parsed.data.qty <= 0) {
      await prisma.cartItem.delete({
        where: { id: existingItem.id },
      });
    } else {
      if (parsed.data.qty > existingItem.product.stock) {
        return {
          success: false,
          message: `موجودی این کالا فقط ${existingItem.product.stock} عدد است.`,
        };
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { qty: parsed.data.qty },
      });
    }

    revalidatePath("/");
    revalidatePath("/cart");
    revalidatePath(`/product/${existingItem.product.slug}`);

    return { success: true, message: "سبد خرید به‌روزرسانی شد." };
  } catch {
    return { success: false, message: "خطا در به‌روزرسانی سبد خرید." };
  }
}

export async function removeItemFromCart(
  productId: string,
): Promise<{ success: boolean; message: string }> {
  return updateCartItemQty(productId, 0);
}

export async function clearCart(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const session = await auth();
    const cookieStore = await cookies();
    const sessionCartId = cookieStore.get(SESSION_CART_COOKIE)?.value;
    const cart = await findCart(session?.user?.id, sessionCartId);

    if (!cart) {
      return { success: true, message: "سبد خرید خالی است." };
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    revalidatePath("/");
    revalidatePath("/cart");

    return { success: true, message: "سبد خرید پاک شد." };
  } catch {
    return { success: false, message: "خطا در پاک کردن سبد خرید." };
  }
}

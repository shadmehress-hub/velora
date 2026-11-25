"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.action";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";
import { convertToPlainObject } from "@/lib/utils";
import { shippingAddressSchema } from "@/lib/validator";
import type { OrderView } from "@/types/index";

export interface OrderActionState {
  success: boolean;
  message: string;
}

export async function createOrderAction(
  _prevState: OrderActionState,
  formData: FormData,
): Promise<OrderActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/signin?callbackUrl=/shipping");
  }

  const parsed = shippingAddressSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    province: formData.get("province"),
    city: formData.get("city"),
    address: formData.get("address"),
    postalCode: formData.get("postalCode"),
    paymentMethod: formData.get("paymentMethod"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message:
        parsed.error.issues[0]?.message ?? "اطلاعات ارسال معتبر نیست.",
    };
  }

  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) {
    return {
      success: false,
      message: "سبد خرید شما خالی است.",
    };
  }

  const userId = session.user.id;
  let createdOrderId = "";

  try {
    createdOrderId = await prisma.$transaction(async (tx) => {
      // Re-verify live stock inside the transaction and decrement atomically
      for (const item of cart.items) {
        const dbProduct = await tx.product.findUnique({
          where: { id: item.productId },
        });
        if (!dbProduct || dbProduct.stock < item.qty) {
          throw new Error(
            `موجودی کالای «${item.name}» کافی نیست.`,
          );
        }

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.qty } },
        });
      }

      const isZarinpal = parsed.data.paymentMethod === "zarinpal";
      const authority = isZarinpal
        ? `ZP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
        : null;

      const order = await tx.order.create({
        data: {
          userId,
          fullName: parsed.data.fullName,
          phone: parsed.data.phone,
          province: parsed.data.province,
          city: parsed.data.city,
          address: parsed.data.address,
          postalCode: parsed.data.postalCode,
          paymentMethod: parsed.data.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          totalPrice: cart.totalPrice,
          isPaid: false,
          paymentAuthority: authority,
          status: isZarinpal ? "pending" : "processing",
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              name: item.name,
              slug: item.slug,
              image: item.image,
              price: item.price,
              qty: item.qty,
            })),
          },
        },
      });

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order.id;
    });
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.",
    };
  }

  updateTag("products");
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/cart");
  revalidatePath("/orders");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/admin/orders");

  if (parsed.data.paymentMethod === "zarinpal") {
    redirect(`/payment/${createdOrderId}`);
  }

  redirect(`/orders/${createdOrderId}?placed=cod`);
}

export async function verifyMockPaymentAction(
  orderId: string,
  succeeded: boolean,
) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/signin?callbackUrl=/payment/${orderId}`);
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (
    !order ||
    (order.userId !== session.user.id && session.user.role !== "admin")
  ) {
    redirect("/orders");
  }

  if (order.isPaid) {
    redirect(`/orders/${order.id}?payment=success`);
  }

  if (succeeded) {
    const refId = String(Math.floor(10000000 + Math.random() * 90000000));
    await prisma.order.update({
      where: { id: order.id },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentRefId: refId,
        status: "processing",
      },
    });

    revalidatePath("/orders");
    revalidatePath(`/orders/${order.id}`);
    revalidatePath("/admin");
    revalidatePath("/admin/orders");

    redirect(`/orders/${order.id}?payment=success`);
  }

  redirect(`/orders/${order.id}?payment=failed`);
}

export async function getMyOrders(): Promise<OrderView[]> {
  const session = await getServerSession();
  if (!session?.user?.id) {
    redirect("/signin?callbackUrl=/orders");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return convertToPlainObject(orders);
}

export async function getOrderById(orderId: string): Promise<OrderView | null> {
  const session = await getServerSession();
  if (!session?.user?.id) {
    redirect(`/signin?callbackUrl=/orders/${orderId}`);
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!order) return null;

  if (order.userId !== session.user.id && session.user.role !== "admin") {
    return null;
  }

  return convertToPlainObject(order);
}

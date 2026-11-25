"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";
import { convertToPlainObject } from "@/lib/utils";
import { insertProductSchema } from "@/lib/validator";

export interface AdminActionState {
  success: boolean;
  message: string;
}

async function requireAdminSession(deferToRequest = false) {
  const session = await (deferToRequest ? getServerSession() : auth());
  if (!session?.user || session.user.role !== "admin") {
    return null;
  }
  return session;
}

export async function getAdminOverview() {
  const session = await requireAdminSession(true);
  if (!session) redirect("/signin?callbackUrl=/admin");

  const [products, totalUsers, activeCarts, totalCartItems, orders] =
    await Promise.all([
      prisma.product.findMany({
        orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      }),
      prisma.user.count(),
      prisma.cart.count({
        where: { items: { some: {} } },
      }),
      prisma.cartItem.aggregate({
        _sum: { qty: true },
      }),
      prisma.order.findMany({
        select: {
          id: true,
          totalPrice: true,
          isPaid: true,
          status: true,
        },
      }),
    ]);

  const totalOrders = orders.length;
  const paidRevenue = orders
    .filter((o) => o.isPaid && o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totalPrice, 0);
  const pendingOrdersCount = orders.filter(
    (o) => o.status === "pending" || o.status === "processing",
  ).length;

  const totalProducts = products.length;
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;
  const lowStockCount = products.filter(
    (p) => p.stock > 0 && p.stock <= 3,
  ).length;
  const healthyStockCount = products.filter((p) => p.stock > 3).length;
  const lowStockProducts = products.filter((p) => p.stock <= 3);
  const totalUnitsInStock = products.reduce(
    (sum, p) => sum + Math.max(0, p.stock),
    0,
  );
  const inventoryValue = products.reduce(
    (sum, p) => sum + p.price * Math.max(0, p.stock),
    0,
  );

  // Category analytics
  const categoryMap = new Map<
    string,
    {
      name: string;
      productCount: number;
      stockUnits: number;
      inventoryValue: number;
      avgPrice: number;
    }
  >();

  for (const product of products) {
    const existing = categoryMap.get(product.category);
    const units = Math.max(0, product.stock);
    const value = product.price * units;

    if (existing) {
      existing.productCount += 1;
      existing.stockUnits += units;
      existing.inventoryValue += value;
      existing.avgPrice += product.price;
    } else {
      categoryMap.set(product.category, {
        name: product.category,
        productCount: 1,
        stockUnits: units,
        inventoryValue: value,
        avgPrice: product.price,
      });
    }
  }

  const categoryStats = Array.from(categoryMap.values()).map((cat) => ({
    ...cat,
    avgPrice: Math.round(cat.avgPrice / cat.productCount),
  }));

  return convertToPlainObject({
    totalProducts,
    totalUsers,
    activeCarts,
    totalCartUnits: totalCartItems._sum.qty ?? 0,
    totalOrders,
    paidRevenue,
    pendingOrdersCount,
    outOfStockCount,
    lowStockCount,
    healthyStockCount,
    totalUnitsInStock,
    inventoryValue,
    lowStockProducts,
    categoryStats,
    topValueProducts: [...products]
      .sort((a, b) => b.price * b.stock - a.price * a.stock)
      .slice(0, 5),
  });
}

export interface AdminProductFilter {
  q?: string;
  category?: string;
  stock?: string;
  sort?: string;
}

export async function getAdminProducts(filter: AdminProductFilter = {}) {
  const session = await requireAdminSession(true);
  if (!session) redirect("/signin?callbackUrl=/admin/products");

  const products = await prisma.product.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
  });

  const categories = Array.from(new Set(products.map((p) => p.category)));
  const q = filter.q?.trim().toLowerCase() ?? "";
  const category = filter.category?.trim() ?? "همه";
  const stockFilter = filter.stock ?? "all";
  const sort = filter.sort ?? "newest";

  const filtered = products.filter((p) => {
    if (category && category !== "همه" && p.category !== category) {
      return false;
    }
    if (stockFilter === "in" && p.stock <= 3) return false;
    if (stockFilter === "low" && (p.stock <= 0 || p.stock > 3)) return false;
    if (stockFilter === "out" && p.stock > 0) return false;

    if (q) {
      const match = [p.name, p.category, p.brand, p.slug]
        .join(" ")
        .toLowerCase()
        .includes(q);
      if (!match) return false;
    }
    return true;
  });

  if (sort === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "stock-asc") {
    filtered.sort((a, b) => a.stock - b.stock);
  }

  return convertToPlainObject({
    products: filtered,
    categories,
    counts: {
      all: products.length,
      inStock: products.filter((p) => p.stock > 3).length,
      low: products.filter((p) => p.stock > 0 && p.stock <= 3).length,
      out: products.filter((p) => p.stock <= 0).length,
    },
  });
}

export async function getAdminProductById(id: string) {
  const session = await requireAdminSession(true);
  if (!session) redirect("/signin?callbackUrl=/admin/products");

  const product = await prisma.product.findUnique({ where: { id } });
  return product ? convertToPlainObject(product) : null;
}

export async function getAdminUsers(q?: string, role?: string) {
  const session = await requireAdminSession(true);
  if (!session) redirect("/signin?callbackUrl=/admin/users");

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      carts: {
        select: {
          items: {
            select: { qty: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const query = q?.trim().toLowerCase() ?? "";
  const filtered = users
    .filter((user) => {
      if (role && role !== "all" && user.role !== role) return false;
      if (query) {
        const text = `${user.name ?? ""} ${user.email}`.toLowerCase();
        if (!text.includes(query)) return false;
      }
      return true;
    })
    .map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      cartQty: user.carts.reduce(
        (sum, c) => sum + c.items.reduce((s, item) => s + item.qty, 0),
        0,
      ),
    }));

  return convertToPlainObject(filtered);
}

export async function getAdminCarts() {
  const session = await requireAdminSession(true);
  if (!session) redirect("/signin?callbackUrl=/admin/carts");

  const carts = await prisma.cart.findMany({
    where: { items: { some: {} } },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: {
        include: { product: true },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const formatted = carts.map((cart) => {
    const totalQty = cart.items.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.qty,
      0,
    );

    return {
      id: cart.id,
      user: cart.user,
      isGuest: !cart.user,
      sessionCartId: cart.sessionCartId,
      totalQty,
      totalPrice,
      updatedAt: cart.updatedAt,
      items: cart.items.map((item) => ({
        id: item.id,
        name: item.product.name,
        slug: item.product.slug,
        image: item.product.image,
        price: item.product.price,
        qty: item.qty,
      })),
    };
  });

  return convertToPlainObject(formatted);
}

function parseProductFormData(formData: FormData) {
  const rawPrice = Number(formData.get("price"));
  const rawStock = Number(formData.get("stock"));

  return insertProductSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    category: formData.get("category"),
    brand: formData.get("brand"),
    image: formData.get("image"),
    description: formData.get("description"),
    price: Number.isFinite(rawPrice) ? rawPrice : -1,
    stock: Number.isFinite(rawStock) ? rawStock : -1,
  });
}

function invalidateProductCaches(slug?: string) {
  updateTag("products");
  if (slug) {
    updateTag(`product-${slug}`);
  }
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
}

export async function adjustProductStockAction(
  productId: string,
  delta: number,
): Promise<AdminActionState> {
  const session = await requireAdminSession();
  if (!session) {
    return { success: false, message: "شما دسترسی مدیریت ندارید." };
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return { success: false, message: "محصول یافت نشد." };
  }

  const nextStock = Math.max(0, product.stock + delta);
  await prisma.product.update({
    where: { id: productId },
    data: { stock: nextStock },
  });

  invalidateProductCaches(product.slug);
  revalidatePath(`/product/${product.slug}`);

  return {
    success: true,
    message: `موجودی به ${nextStock} عدد تغییر یافت.`,
  };
}

export async function createProductAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const session = await requireAdminSession();
  if (!session) {
    return { success: false, message: "شما دسترسی مدیریت ندارید." };
  }

  const parsed = parseProductFormData(formData);
  if (!parsed.success) {
    return {
      success: false,
      message:
        parsed.error.issues[0]?.message ?? "اطلاعات محصول معتبر نیست.",
    };
  }

  const existingSlug = await prisma.product.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existingSlug) {
    return {
      success: false,
      message: "محصولی با این اسلاگ قبلاً ثبت شده است.",
    };
  }

  await prisma.product.create({
    data: parsed.data,
  });

  invalidateProductCaches(parsed.data.slug);
  redirect("/admin/products");
}

export async function updateProductAction(
  productId: string,
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const session = await requireAdminSession();
  if (!session) {
    return { success: false, message: "شما دسترسی مدیریت ندارید." };
  }

  const parsed = parseProductFormData(formData);
  if (!parsed.success) {
    return {
      success: false,
      message:
        parsed.error.issues[0]?.message ?? "اطلاعات محصول معتبر نیست.",
    };
  }

  const existing = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!existing) {
    return { success: false, message: "محصول مورد نظر یافت نشد." };
  }

  const duplicateSlug = await prisma.product.findFirst({
    where: {
      slug: parsed.data.slug,
      NOT: { id: productId },
    },
  });
  if (duplicateSlug) {
    return {
      success: false,
      message: "محصول دیگری با این اسلاگ وجود دارد.",
    };
  }

  await prisma.product.update({
    where: { id: productId },
    data: parsed.data,
  });

  invalidateProductCaches(existing.slug);
  if (parsed.data.slug !== existing.slug) {
    updateTag(`product-${parsed.data.slug}`);
  }
  revalidatePath(`/product/${parsed.data.slug}`);
  redirect("/admin/products");
}

export async function deleteProductAction(
  productId: string,
): Promise<AdminActionState> {
  const session = await requireAdminSession();
  if (!session) {
    return { success: false, message: "شما دسترسی مدیریت ندارید." };
  }

  const existing = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!existing) {
    return { success: false, message: "محصول یافت نشد." };
  }

  await prisma.product.delete({
    where: { id: productId },
  });

  invalidateProductCaches(existing.slug);
  return { success: true, message: "محصول با موفقیت حذف شد." };
}

export async function toggleUserRoleAction(
  targetUserId: string,
): Promise<AdminActionState> {
  const session = await requireAdminSession();
  if (!session) {
    return { success: false, message: "شما دسترسی مدیریت ندارید." };
  }

  if (session.user.id === targetUserId) {
    return {
      success: false,
      message: "نمی‌توانید نقش حساب کاربری خودتان را تغییر دهید.",
    };
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });
  if (!targetUser) {
    return { success: false, message: "کاربر یافت نشد." };
  }

  const nextRole = targetUser.role === "admin" ? "user" : "admin";
  await prisma.user.update({
    where: { id: targetUserId },
    data: { role: nextRole },
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin");

  return {
    success: true,
    message: `نقش کاربر به ${nextRole === "admin" ? "مدیر" : "کاربر"} تغییر یافت.`,
  };
}

export async function getAdminOrders(status?: string) {
  const session = await requireAdminSession(true);
  if (!session) redirect("/signin?callbackUrl=/admin/orders");

  const where =
    status && status !== "all" ? { status } : undefined;

  const orders = await prisma.order.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return convertToPlainObject(orders);
}

const VALID_ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export async function updateOrderStatusAction(
  orderId: string,
  nextStatus: string,
): Promise<AdminActionState> {
  const session = await requireAdminSession();
  if (!session) {
    return { success: false, message: "شما دسترسی مدیریت ندارید." };
  }

  if (!VALID_ORDER_STATUSES.includes(nextStatus)) {
    return { success: false, message: "وضعیت سفارش نامعتبر است." };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    return { success: false, message: "سفارش یافت نشد." };
  }

  const wasCancelled = order.status === "cancelled";
  const willCancel = nextStatus === "cancelled";

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: {
        status: nextStatus,
        ...(nextStatus === "delivered" && !order.isPaid
          ? { isPaid: true, paidAt: new Date() }
          : {}),
      },
    });

    // Restore stock if cancelling a non-cancelled order
    if (!wasCancelled && willCancel) {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.qty } },
        });
      }
    }
  });

  if (!wasCancelled && willCancel) {
    updateTag("products");
    revalidatePath("/");
    revalidatePath("/search");
    revalidatePath("/admin/products");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);

  return {
    success: true,
    message: "وضعیت سفارش به‌روزرسانی شد.",
  };
}

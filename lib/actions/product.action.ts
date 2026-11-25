import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { convertToPlainObject } from "@/lib/utils";

export async function getLatestProducts(limit?: number) {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const data = await prisma.product.findMany({
    ...(limit ? { take: limit } : {}),
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
  });
  return convertToPlainObject(data);
}

export async function getProductsBySlug({ slug }: { slug: string }) {
  "use cache";
  cacheLife("hours");
  cacheTag("products", `product-${slug}`);

  const product = await prisma.product.findUnique({
    where: {
      slug,
    },
  });
  return product ? convertToPlainObject(product) : null;
}

export interface ProductFilterParams {
  q?: string;
  category?: string;
  brand?: string;
  sort?: string;
  inStock?: boolean;
}

export async function getFilteredProducts(params: ProductFilterParams) {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const q = params.q?.trim().toLowerCase() ?? "";
  const category = params.category?.trim() ?? "";
  const brand = params.brand?.trim() ?? "";
  const sort = params.sort ?? "newest";
  const inStockOnly = Boolean(params.inStock);

  const allProducts = await prisma.product.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
  });

  const filtered = allProducts.filter((product) => {
    if (category && category !== "همه" && product.category !== category) {
      return false;
    }
    if (brand && brand !== "همه" && product.brand !== brand) {
      return false;
    }
    if (inStockOnly && product.stock <= 0) {
      return false;
    }
    if (q) {
      const haystack = [
        product.name,
        product.description,
        product.category,
        product.brand,
        product.slug,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) {
        return false;
      }
    }
    return true;
  });

  if (sort === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === "stock") {
    filtered.sort((a, b) => b.stock - a.stock);
  }

  return convertToPlainObject(filtered);
}

export async function getCategoriesWithMeta() {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const products = await prisma.product.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
  });

  const map = new Map<
    string,
    { name: string; count: number; image: string }
  >();

  for (const product of products) {
    const existing = map.get(product.category);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(product.category, {
        name: product.category,
        count: 1,
        image: product.image,
      });
    }
  }

  return Array.from(map.values());
}

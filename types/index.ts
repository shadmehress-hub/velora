import type { z } from "zod";
import { insertProductSchema } from "@/lib/validator";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating?: number;
  numReviews?: number;
  createdAt: Date | string;
  updatedAt?: Date | string;
};

export interface CartItemView {
  id: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  qty: number;
}

export interface CartView {
  id: string;
  items: CartItemView[];
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  totalQty: number;
}

export interface OrderItemView {
  id: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  qty: number;
}

export interface OrderView {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt: Date | string | null;
  paymentAuthority: string | null;
  paymentRefId: string | null;
  status: string;
  createdAt: Date | string;
  items: OrderItemView[];
  user?: {
    name: string | null;
    email: string;
  };
}

export interface ReviewView {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: Date | string;
  user: {
    name: string | null;
  };
}

export interface RatingDistributionItem {
  stars: number;
  count: number;
  percent: number;
}

export interface ReviewAIAnalysis {
  summary: string;
  pros: string[];
  cons: string[];
  recommendation: string;
  satisfactionPercent: number;
  source: "gemini" | "velora-smart";
}

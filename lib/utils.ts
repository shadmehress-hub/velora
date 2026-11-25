export { cn } from "cn";

export const FREE_SHIPPING_THRESHOLD = 50_000_000;
export const STANDARD_SHIPPING_FEE = 250_000;

export const ORDER_STATUS_META: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "در انتظار پرداخت", variant: "secondary" },
  processing: { label: "در حال پردازش", variant: "default" },
  shipped: { label: "ارسال شده", variant: "outline" },
  delivered: { label: "تحویل شده", variant: "default" },
  cancelled: { label: "لغو شده", variant: "destructive" },
};

export function formatPrice(price: number) {
  return `${new Intl.NumberFormat("fa-IR").format(price)} تومان`;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

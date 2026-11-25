import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Headphones,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Star,
  Store,
  Truck,
  XCircle,
} from "lucide-react";

import AddToCart from "@/components/shared/product/AddToCart";
import ProductCard from "@/components/shared/product/ProductCard";
import ProductReviewsSection from "@/components/shared/product/ProductReviewsSection";
import { ProductDetailSkeleton } from "@/components/shared/product/ProductSkeleton";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getMyCart } from "@/lib/actions/cart.action";
import {
  getLatestProducts,
  getProductsBySlug,
} from "@/lib/actions/product.action";
import { formatNumber, formatPrice } from "@/lib/utils";

async function ProductDetailContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, latestProducts, cart] = await Promise.all([
    getProductsBySlug({ slug }),
    getLatestProducts(5),
    getMyCart(),
  ]);

  if (!product) {
    notFound();
  }

  const existingCartItem = cart?.items.find(
    (item) => item.productId === product.id,
  );
  const existingQty = existingCartItem?.qty ?? 0;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;
  const relatedProducts = latestProducts
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  return (
    <div className="space-y-8 py-4 sm:py-6">
      {/* Breadcrumb */}
      <nav
        aria-label="مسیر صفحه"
        className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground sm:text-sm"
      >
        <Link href="/" className="transition-colors hover:text-foreground">
          فروشگاه ولورا
        </Link>
        <span className="text-border">/</span>
        <Link
          href={`/search?category=${encodeURIComponent(product.category)}`}
          className="transition-colors hover:text-foreground"
        >
          {product.category}
        </Link>
        <span className="text-border">/</span>
        <span className="font-medium text-foreground">{product.name}</span>
      </nav>

      {/* Digikala-style 3-column layout: Gallery (4) | Info (5) | Buy Box (3) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
        {/* Column 1 (Right in RTL): Product Image Gallery */}
        <div className="lg:col-span-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border/70 bg-muted/30">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-contain p-8 sm:p-10"
            />

            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="shadow-xs">
                {product.category}
              </Badge>
            </div>

            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/65 backdrop-blur-xs">
                <span className="rounded-xl bg-destructive px-5 py-2 text-sm font-bold text-white shadow-md">
                  ناموجود
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Column 2 (Center): Title, Highlights & Description */}
        <div className="flex flex-col gap-5 lg:col-span-5">
          <div className="space-y-2 border-b border-border/60 pb-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>برند:</span>
              <Badge variant="outline">{product.brand}</Badge>
              <span>•</span>
              <span>دسته‌بندی: {product.category}</span>
            </div>

            <h1
              dir="auto"
              className="text-right text-xl font-bold leading-snug tracking-tight text-foreground sm:text-2xl"
            >
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <p dir="ltr" className="text-right">
                {product.slug}
              </p>
              <a
                href="#reviews"
                className="inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-sky-500"
              >
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                <span className="tabular-nums">
                  {product.numReviews > 0
                    ? formatNumber(product.rating)
                    : "بدون امتیاز"}
                </span>
                <span className="text-muted-foreground tabular-nums">
                  ({formatNumber(product.numReviews)} دیدگاه)
                </span>
              </a>
            </div>
          </div>

          {/* Key Highlights (ویژگی‌ها) */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground">
              ویژگی‌های اصلی
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              <HighlightBox label="برند" value={product.brand} />
              <HighlightBox label="دسته‌بندی" value={product.category} />
              <HighlightBox
                label="وضعیت انبار"
                value={isOutOfStock ? "ناموجود" : "موجود در انبار"}
              />
              <HighlightBox label="تعداد موجودی" value={`${product.stock} عدد`} />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 border-t border-border/60 pt-4">
            <h2 className="text-sm font-semibold text-foreground">
              معرفی محصول
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              {product.description}
            </p>
          </div>

          {/* Return policy note */}
          <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-muted/25 p-3 text-xs leading-6 text-muted-foreground">
            <RotateCcw className="mt-0.5 size-4 shrink-0 text-foreground/70" />
            <span>
              امکان برگشت کالا با دلیل «انصراف از خرید» تنها در صورتی مورد قبول
              است که پلمب کالا باز نشده باشد.
            </span>
          </div>
        </div>

        {/* Column 3 (Left in RTL): Sticky Seller / Buy Box */}
        <aside className="lg:sticky lg:top-6 lg:col-span-3">
          <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-5 text-card-foreground shadow-xs">
            {/* Seller info */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Store className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    فروشگاه ولورا
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    عملکرد: عالی
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="text-[11px]">
                فروشنده رسمی
              </Badge>
            </div>

            {/* Guarantee */}
            <div className="flex items-center gap-2.5 border-b border-border/60 pb-3.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 shrink-0 text-foreground/80" />
              <span>گارانتی اصالت و سلامت فیزیکی کالا</span>
            </div>

            {/* Shipping / Stock status */}
            <div className="flex items-start gap-2.5 border-b border-border/60 pb-3.5 text-xs">
              {isOutOfStock ? (
                <>
                  <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                  <span className="font-medium text-destructive">
                    در حال حاضر این کالا ناموجود است
                  </span>
                </>
              ) : (
                <>
                  <Truck className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <div className="space-y-0.5">
                    <p className="font-medium text-foreground">
                      موجود در انبار ولورا
                    </p>
                    <p className="text-muted-foreground">
                      ارسال سریع به سراسر کشور
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Low stock urgency */}
            {isLowStock && (
              <p className="text-xs font-medium text-destructive">
                تنها {product.stock} عدد در انبار باقی مانده!
              </p>
            )}

            {/* Price */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-muted-foreground">قیمت فروشنده</span>
              <span className="text-lg font-extrabold tabular-nums text-foreground sm:text-xl">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* CTA */}
            <AddToCart
              productId={product.id}
              stock={product.stock}
              initialQty={existingQty}
            />
          </div>
        </aside>
      </div>

      {/* Digikala-style Trust Badges Bar */}
      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border/60 bg-muted/20 p-4 sm:grid-cols-4">
        <TrustBadge
          icon={<Truck className="size-5" />}
          label="امکان تحویل اکسپرس"
        />
        <TrustBadge
          icon={<Headphones className="size-5" />}
          label="پشتیبانی همه‌روزه"
        />
        <TrustBadge
          icon={<RotateCcw className="size-5" />}
          label="۷ روز ضمانت بازگشت کالا"
        />
        <TrustBadge
          icon={<PackageCheck className="size-5" />}
          label="ضمانت اصل بودن کالا"
        />
      </div>

      {/* Specifications Table */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
          مشخصات فنی
        </h2>
        <div className="overflow-hidden rounded-xl border border-border/70">
          <div className="divide-y divide-border/50">
            <SpecRow label="نام محصول" value={product.name} />
            <SpecRow label="برند" value={product.brand} />
            <SpecRow label="دسته‌بندی" value={product.category} />
            <SpecRow
              label="وضعیت موجودی"
              value={isOutOfStock ? "ناموجود" : `موجود (${product.stock} عدد)`}
            />
            <SpecRow label="شناسه کالا" value={product.slug} />
          </div>
        </div>
      </section>

      {/* Reviews & AI Summary Section */}
      <ProductReviewsSection productId={product.id} productSlug={product.slug} />

      {/* Related Products (reusing ProductCard) */}
      {relatedProducts.length > 0 && (
        <section className="space-y-5 border-t border-border/60 pt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
              محصولات مشابه
            </h2>
            <Link
              href="/"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              مشاهده همه
              <ArrowLeft className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function HighlightBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/25 px-3 py-2.5">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate text-xs font-semibold text-foreground sm:text-sm">
        {value}
      </p>
    </div>
  );
}

function TrustBadge({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center justify-start gap-2.5 py-1 text-xs font-medium text-muted-foreground sm:justify-center sm:text-sm">
      <span className="shrink-0 text-foreground/80">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-4 px-4 py-3 text-xs sm:text-sm odd:bg-muted/20">
      <span className="text-muted-foreground">{label}</span>
      <span
        dir="auto"
        className="col-span-2 min-w-0 break-words text-right font-medium text-foreground"
      >
        {value}
      </span>
    </div>
  );
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductsBySlug({ slug });

  if (!product) {
    return {
      title: "محصول یافت نشد",
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | Velora`,
      description: product.description,
      images: [{ url: product.image, alt: product.name }],
    },
  };
}

export default function ProductPage(props: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailContent params={props.params} />
    </Suspense>
  );
}

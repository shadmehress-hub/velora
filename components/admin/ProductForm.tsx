"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Images,
  Loader2,
  Save,
  Wand2,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createProductAction,
  updateProductAction,
  type AdminActionState,
} from "@/lib/actions/admin.action";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/types/index";

const initialState: AdminActionState = {
  success: false,
  message: "",
};

const CATEGORY_PRESETS = ["موبایل", "لپتاپ", "هدفون", "کنسول بازی"];

const GALLERY_GROUPS = [
  {
    label: "موبایل",
    images: [
      "/images/mobile/01.png",
      "/images/mobile/03.png",
      "/images/mobile/04.png",
      "/images/mobile/05.png",
      "/images/mobile/06.png",
      "/images/mobile/09.png",
      "/images/mobile/10.png",
      "/images/mobile/11.png",
      "/images/mobile/12.png",
    ],
  },
  {
    label: "لپتاپ",
    images: [
      "/images/macbook/01.png",
      "/images/macbook/02.png",
      "/images/macbook/03.png",
      "/images/macbook/04.png",
      "/images/macbook/05.png",
      "/images/macbook/06.png",
      "/images/macbook/07.png",
      "/images/macbook/09.png",
      "/images/macbook/10.png",
    ],
  },
  {
    label: "هدفون",
    images: [
      "/images/headphone/03.png",
      "/images/headphone/04.png",
      "/images/headphone/06.png",
      "/images/headphone/07.png",
      "/images/headphone/09.png",
      "/images/headphone/10.png",
    ],
  },
  {
    label: "کنسول بازی (PS5)",
    images: Array.from({ length: 8 }, (_, i) => `/images/ps5/0${i + 1}.jpg`),
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function ProductForm({ product }: { product?: Product }) {
  const isEdit = Boolean(product);
  const actionFn = product
    ? updateProductAction.bind(null, product.id)
    : createProductAction;

  const [state, formAction, isPending] = useActionState(actionFn, initialState);
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [category, setCategory] = useState(product?.category ?? "موبایل");
  const [priceValue, setPriceValue] = useState(
    String(product?.price ?? 0),
  );
  const [image, setImage] = useState(
    product?.image ?? "/images/mobile/01.png",
  );
  const [showGallery, setShowGallery] = useState(false);

  const numericPrice = Number(priceValue);
  const formattedPricePreview =
    Number.isFinite(numericPrice) && numericPrice >= 0
      ? formatPrice(numericPrice)
      : "مقدار نامعتبر";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {isEdit ? `ویرایش ${product?.name}` : "افزودن محصول جدید"}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            مشخصات محصول را وارد کنید؛ تغییرات بلافاصله در فروشگاه اعمال
            می‌شوند.
          </p>
        </div>
        <Link
          href="/admin/products"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <ArrowRight className="size-4" aria-hidden="true" />
          بازگشت به لیست
        </Link>
      </div>

      <form
        action={formAction}
        className="space-y-6 rounded-2xl border border-border/70 bg-card p-5 shadow-xs sm:p-6"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">نام محصول</Label>
            <Input
              id="name"
              name="name"
              dir="auto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً iPhone 16 Pro"
              required
              className="h-10 text-right"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="slug">اسلاگ (آدرس URL)</Label>
              <button
                type="button"
                onClick={() => setSlug(slugify(name))}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-500 hover:underline"
              >
                <Wand2 className="size-3" aria-hidden="true" />
                تولید از نام
              </button>
            </div>
            <Input
              id="slug"
              name="slug"
              dir="ltr"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="iphone-16-pro"
              required
              className="h-10 text-left"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">دسته‌بندی</Label>
            <Input
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="موبایل"
              required
              className="h-10"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {CATEGORY_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setCategory(preset)}
                  className={cn(
                    "rounded-md border px-2 py-0.5 text-[11px] transition-colors",
                    category === preset
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/70 bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Brand */}
          <div className="space-y-2">
            <Label htmlFor="brand">برند</Label>
            <Input
              id="brand"
              name="brand"
              defaultValue={product?.brand ?? "Apple"}
              placeholder="Apple"
              required
              className="h-10"
            />
          </div>

          {/* Price with live formatted preview */}
          <div className="space-y-2">
            <Label htmlFor="price">قیمت (تومان)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min={0}
              dir="ltr"
              value={priceValue}
              onChange={(e) => setPriceValue(e.target.value)}
              aria-describedby="price-preview"
              required
              className="h-10 text-left tabular-nums"
            />
            <p
              id="price-preview"
              className="text-xs font-medium text-sky-600 dark:text-sky-400"
            >
              نمایش در فروشگاه: {formattedPricePreview}
            </p>
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <Label htmlFor="stock">موجودی انبار (عدد)</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              min={0}
              dir="ltr"
              defaultValue={product?.stock ?? 1}
              required
              className="h-10 text-left tabular-nums"
            />
          </div>
        </div>

        {/* Image path + visual gallery picker */}
        <div className="space-y-4 rounded-xl border border-border/60 bg-muted/20 p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 sm:items-center">
            <div className="space-y-2 sm:col-span-9">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label htmlFor="image">مسیر تصویر محصول</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  aria-expanded={showGallery}
                  onClick={() => setShowGallery((prev) => !prev)}
                  className="gap-1.5"
                >
                  <Images className="size-3.5" aria-hidden="true" />
                  {showGallery ? "بستن گالری تصاویر" : "انتخاب از گالری تصاویر"}
                </Button>
              </div>
              <Input
                id="image"
                name="image"
                dir="ltr"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="/images/mobile/01.png"
                required
                className="h-10 bg-background text-left"
              />
            </div>

            <div className="flex justify-center sm:col-span-3">
              <div className="relative size-24 overflow-hidden rounded-xl border border-border/70 bg-background">
                {image.startsWith("/") ? (
                  <Image
                    src={image}
                    alt="پیش‌نمایش تصویر"
                    fill
                    sizes="96px"
                    className="object-contain p-2"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-[11px] text-muted-foreground">
                    پیش‌نمایش
                  </span>
                )}
              </div>
            </div>
          </div>

          {showGallery && (
            <div className="space-y-3 border-t border-border/50 pt-3">
              {GALLERY_GROUPS.map((group) => (
                <div key={group.label} className="space-y-1.5">
                  <p className="text-xs font-semibold text-muted-foreground">
                    {group.label}
                  </p>
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                    {group.images.map((imgPath) => {
                      const isSelected = image === imgPath;
                      return (
                        <button
                          key={imgPath}
                          type="button"
                          onClick={() => setImage(imgPath)}
                          aria-label={`انتخاب تصویر ${imgPath}`}
                          aria-pressed={isSelected}
                          className={cn(
                            "relative aspect-square overflow-hidden rounded-lg border bg-background p-1 transition-all",
                            isSelected
                              ? "border-sky-500 ring-2 ring-sky-500/30"
                              : "border-border/70 hover:border-foreground/40",
                          )}
                        >
                          <Image
                            src={imgPath}
                            alt={imgPath}
                            fill
                            sizes="64px"
                            className="object-contain p-1"
                          />
                          {isSelected && (
                            <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-sky-500 text-white">
                              <Check className="size-2.5" aria-hidden="true" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">توضیحات محصول</Label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={product?.description ?? ""}
            placeholder="توضیحات کوتاه و کاربردی درباره ویژگی‌های محصول..."
            required
            className="w-full rounded-xl border border-input bg-transparent px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          />
        </div>

        {state.message && !state.success && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-xs font-medium text-destructive sm:text-sm"
          >
            <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
            <span>{state.message}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border/60 pt-4">
          <Link
            href="/admin/products"
            className={buttonVariants({ variant: "outline" })}
          >
            انصراف
          </Link>
          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                در حال ذخیره...
              </>
            ) : (
              <>
                <Save className="size-4" aria-hidden="true" />
                {isEdit ? "ذخیره تغییرات" : "ثبت محصول"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;

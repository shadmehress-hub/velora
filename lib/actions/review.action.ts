"use server";

import { cacheLife, cacheTag, revalidatePath, updateTag } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { convertToPlainObject } from "@/lib/utils";
import { insertReviewSchema } from "@/lib/validator";
import type {
  RatingDistributionItem,
  ReviewAIAnalysis,
  ReviewView,
} from "@/types/index";

export interface ReviewActionState {
  success: boolean;
  message: string;
}

export async function getPublicProductReviews(productId: string): Promise<{
  reviews: ReviewView[];
  averageRating: number;
  totalReviews: number;
  distribution: RatingDistributionItem[];
}> {
  "use cache";
  cacheLife("hours");
  cacheTag("reviews", `reviews-${productId}`);

  const reviews = await prisma.review.findMany({
    where: { productId },
    include: {
      user: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? Number(
          (
            reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
          ).toFixed(1),
        )
      : 0;

  const distribution: RatingDistributionItem[] = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percent =
      totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { stars: star, count, percent };
  });

  return convertToPlainObject({
    reviews,
    averageRating,
    totalReviews,
    distribution,
  });
}

async function recalculateProductRating(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  productId: string,
) {
  const agg = await tx.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await tx.product.update({
    where: { id: productId },
    data: {
      rating: Number((agg._avg.rating ?? 0).toFixed(1)),
      numReviews: agg._count.rating,
    },
  });
}

export async function upsertReviewAction(
  _prevState: ReviewActionState,
  formData: FormData,
): Promise<ReviewActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      message: "برای ثبت دیدگاه ابتدا وارد حساب کاربری خود شوید.",
    };
  }

  const parsed = insertReviewSchema.safeParse({
    productId: formData.get("productId"),
    rating: Number(formData.get("rating")),
    title: formData.get("title"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "اطلاعات دیدگاه معتبر نیست.",
    };
  }

  const product = await prisma.product.findUnique({
    where: { id: parsed.data.productId },
  });

  if (!product) {
    return { success: false, message: "محصول یافت نشد." };
  }

  const userId = session.user.id;

  const verifiedOrder = await prisma.order.findFirst({
    where: {
      userId,
      status: { not: "cancelled" },
      items: { some: { productId: product.id } },
    },
    select: { id: true },
  });

  await prisma.$transaction(async (tx) => {
    await tx.review.upsert({
      where: {
        productId_userId: {
          productId: product.id,
          userId,
        },
      },
      update: {
        rating: parsed.data.rating,
        title: parsed.data.title,
        comment: parsed.data.comment,
        isVerifiedPurchase: Boolean(verifiedOrder),
      },
      create: {
        productId: product.id,
        userId,
        rating: parsed.data.rating,
        title: parsed.data.title,
        comment: parsed.data.comment,
        isVerifiedPurchase: Boolean(verifiedOrder),
      },
    });

    await recalculateProductRating(tx, product.id);
  });

  updateTag("products");
  updateTag(`product-${product.slug}`);
  updateTag(`reviews-${product.id}`);
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath(`/product/${product.slug}`);

  return {
    success: true,
    message: "دیدگاه شما با موفقیت ثبت شد.",
  };
}

export async function deleteReviewAction(
  reviewId: string,
): Promise<ReviewActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "دسترسی غیرمجاز." };
  }

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: { product: { select: { id: true, slug: true } } },
  });

  if (!review) {
    return { success: false, message: "دیدگاه یافت نشد." };
  }

  if (
    review.userId !== session.user.id &&
    session.user.role !== "admin"
  ) {
    return { success: false, message: "اجازه حذف این دیدگاه را ندارید." };
  }

  await prisma.$transaction(async (tx) => {
    await tx.review.delete({ where: { id: reviewId } });
    await recalculateProductRating(tx, review.productId);
  });

  updateTag("products");
  updateTag(`product-${review.product.slug}`);
  updateTag(`reviews-${review.product.id}`);
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath(`/product/${review.product.slug}`);

  return { success: true, message: "دیدگاه حذف شد." };
}

const POSITIVE_THEMES: Array<{ keywords: string[]; label: string }> = [
  { keywords: ["کیفیت", "ساخت", "بدنه", "تیتانیوم", "جنس"], label: "کیفیت ساخت بالا و طراحی بدنه" },
  { keywords: ["باتری", "شارژ", "دوام"], label: "شارژدهی و عملکرد مطلوب باتری" },
  { keywords: ["دوربین", "عکس", "فیلم", "تصویر"], label: "عملکرد قوی دوربین و ثبت تصاویر باکیفیت" },
  { keywords: ["صفحه", "نمایشگر", "روشن", "oled", "روان"], label: "صفحه‌نمایش باکیفیت و روان" },
  { keywords: ["سرعت", "پردازش", "پردازنده", "سریع", "عملکرد"], label: "سرعت پردازش بالا و عملکرد روان" },
  { keywords: ["صدا", "نویز", "بیس", "میکروفن", "مکالمه"], label: "شفافیت صدا و حذف نویز موثر" },
  { keywords: ["سبک", "راحت", "خوش‌دست", "باریک"], label: "طراحی سبک و ارگونومی مناسب" },
];

const NEGATIVE_THEMES: Array<{ keywords: string[]; label: string }> = [
  { keywords: ["قیمت", "گران", "هزینه"], label: "قیمت نسبتاً بالا در مقایسه با رقبا" },
  { keywords: ["شارژر", "آداپتور", "لوازم"], label: "عدم وجود شارژر یا لوازم جانبی کامل در جعبه" },
  { keywords: ["داغ", "گرما", "حرارت"], label: "گرم شدن بدنه در کارهای سنگین طولانی" },
  { keywords: ["وزن", "سنگین"], label: "وزن نسبتاً بالا در استفاده طولانی‌مدت" },
  { keywords: ["موجود", "کمیاب", "سخت"], label: "محدودیت موجودی در برخی رنگ‌ها و کانفیگ‌ها" },
];

function buildSmartLocalAnalysis(
  productName: string,
  reviews: Array<{
    rating: number;
    title: string;
    comment: string;
    isVerifiedPurchase: boolean;
  }>,
): ReviewAIAnalysis {
  const total = reviews.length;
  const avg =
    total > 0
      ? Number(
          (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1),
        )
      : 0;
  const satisfiedCount = reviews.filter((r) => r.rating >= 4).length;
  const satisfactionPercent =
    total > 0 ? Math.round((satisfiedCount / total) * 100) : 0;
  const verifiedCount = reviews.filter((r) => r.isVerifiedPurchase).length;

  const combinedText = reviews
    .map((r) => `${r.title} ${r.comment}`)
    .join(" ")
    .toLowerCase();

  const pros = POSITIVE_THEMES.filter((t) =>
    t.keywords.some((kw) => combinedText.includes(kw)),
  )
    .map((t) => t.label)
    .slice(0, 4);

  if (pros.length === 0 && avg >= 3.5) {
    pros.push("رضایت کلی کاربران از عملکرد واقعی محصول");
    pros.push("ارزش خرید مناسب در رده‌ی قیمتی خود");
  }

  const cons = NEGATIVE_THEMES.filter((t) =>
    t.keywords.some((kw) => combinedText.includes(kw)),
  )
    .map((t) => t.label)
    .slice(0, 3);

  if (cons.length === 0 && reviews.some((r) => r.rating <= 3)) {
    cons.push("برخی کاربران انتظار امکانات بیشتری در این بازه قیمتی داشتند");
  }

  const summary =
    avg >= 4.2
      ? `بر اساس تحلیل ${total} دیدگاه ثبت‌شده${verifiedCount > 0 ? ` (${verifiedCount} خریدار تاییدشده)` : ""}، محصول ${productName} با میانگین امتیاز ${avg} از ۵ رضایت بسیار بالایی را بین کاربران کسب کرده است.`
      : avg >= 3.2
        ? `بر اساس ${total} دیدگاه ثبت‌شده، ${productName} عملکرد متعادلی با میانگین ${avg} از ۵ دارد و بیشتر کاربران تجربه مثبتی گزارش کرده‌اند.`
        : `بر اساس ${total} دیدگاه ثبت‌شده، نظرات درباره ${productName} متفاوت است و میانگین امتیاز ${avg} از ۵ ثبت شده است.`;

  const recommendation =
    satisfactionPercent >= 75
      ? "پیشنهاد خرید: با توجه به نرخ رضایت بالا، این محصول گزینه‌ای مطمئن برای خرید است."
      : satisfactionPercent >= 50
        ? "پیشنهاد خرید: پیش از خرید، نقاط ضعف ذکرشده توسط کاربران را با نیاز خود مطابقت دهید."
        : "پیشنهاد خرید: بهتر است پیش از تصمیم نهایی، گزینه‌های مشابه در این دسته‌بندی را نیز بررسی کنید.";

  return {
    summary,
    pros,
    cons,
    recommendation,
    satisfactionPercent,
    source: "velora-smart",
  };
}

const GEMINI_REVIEW_MODELS = [
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-flash-lite-latest",
] as const;

export async function analyzeProductReviewsAI(
  productId: string,
): Promise<{ success: boolean; analysis?: ReviewAIAnalysis; message?: string }> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, name: true },
  });

  if (!product) {
    return { success: false, message: "محصول یافت نشد." };
  }

  const reviews = await prisma.review.findMany({
    where: { productId },
    select: {
      rating: true,
      title: true,
      comment: true,
      isVerifiedPurchase: true,
    },
    orderBy: { createdAt: "desc" },
    take: 25,
  });

  if (reviews.length === 0) {
    return {
      success: false,
      message: "هنوز دیدگاهی برای تحلیل هوش مصنوعی ثبت نشده است.",
    };
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (apiKey) {
    const prompt = `Analyze these Persian customer reviews for "${product.name}" and return ONLY valid JSON with keys:
{
  "summary": "2-sentence Persian overview",
  "pros": ["up to 4 short Persian pros"],
  "cons": ["up to 3 short Persian cons (empty array if none)"],
  "recommendation": "1 concise Persian buying recommendation sentence",
  "satisfactionPercent": number (0-100)
}
Reviews:
${reviews.map((r, i) => `${i + 1}. (${r.rating}/5) ${r.title}: ${r.comment}`).join("\n")}`;

    for (const model of GEMINI_REVIEW_MODELS) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: AbortSignal.timeout(4500),
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: "application/json" },
            }),
          },
        );

        if (!response.ok) continue;

        const json = await response.json();
        const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (typeof rawText !== "string") continue;

        const cleaned = rawText
          .replace(/^```(?:json)?\s*|\s*```$/g, "")
          .trim();
        const parsed = JSON.parse(cleaned);
        if (parsed?.summary && Array.isArray(parsed?.pros)) {
          return {
            success: true,
            analysis: {
              summary: String(parsed.summary),
              pros: parsed.pros.slice(0, 4).map(String),
              cons: Array.isArray(parsed.cons)
                ? parsed.cons.slice(0, 3).map(String)
                : [],
              recommendation: String(parsed.recommendation ?? ""),
              satisfactionPercent: Math.min(
                100,
                Math.max(0, Number(parsed.satisfactionPercent) || 0),
              ),
              source: "gemini",
            },
          };
        }
      } catch {
        // Try next Gemini Flash model or fall back cleanly below
      }
    }
  }

  return {
    success: true,
    analysis: buildSmartLocalAnalysis(product.name, reviews),
  };
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Headphones,
  Layers,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getCategoriesWithMeta } from "@/lib/actions/product.action";
import { cn, formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "درباره ما",
  description:
    "آشنایی با فروشگاه تخصصی کالای دیجیتال ولورا؛ عرضه محصولات منتخب اپل و تجهیزات صوتی مدرن با ضمانت اصالت.",
};

const CORE_VALUES = [
  {
    icon: ShieldCheck,
    title: "ضمانت اصالت ۱۰۰٪ کالا",
    description:
      "تمامی محصولات با بررسی سلامت فیزیکی، پلمب اصلی و کد اصالت معتبر عرضه می‌شوند.",
  },
  {
    icon: Truck,
    title: "ارسال سریع و مطمئن",
    description:
      "بسته‌بندی ایمن و ارسال اکسپرس به سراسر کشور؛ رایگان برای سفارش‌های بالای ۵۰ میلیون تومان.",
  },
  {
    icon: RotateCcw,
    title: "۷ روز ضمانت بازگشت",
    description:
      "در صورت وجود هرگونه مغایرت فنی یا ظاهری، تا ۷ روز امکان بازگشت بی‌قیدوشرط دارید.",
  },
  {
    icon: Headphones,
    title: "پشتیبانی و مشاوره تخصصی",
    description:
      "تیم فنی ولورا پیش و پس از خرید همراه شماست تا بهترین انتخاب متناسب با نیازتان را داشته باشید.",
  },
];

export default async function AboutPage() {
  const categories = await getCategoriesWithMeta();
  const totalProducts = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="space-y-10 py-4 sm:space-y-12 sm:py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-zinc-950 text-white shadow-lg">
        <Image
          src="/images/banner/b-01.png"
          alt="درباره فروشگاه ولورا"
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover opacity-75"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-l from-zinc-950/95 via-zinc-950/75 to-zinc-950/45"
        />

        <div className="relative z-10 flex flex-col items-start gap-5 px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <Badge className="gap-1.5 border border-sky-400/30 bg-sky-500/15 text-sky-300">
            <Sparkles className="size-3.5" aria-hidden="true" />
            درباره فروشگاه ولورا (Velora)
          </Badge>

          <div className="max-w-2xl space-y-3">
            <h1 className="text-2xl font-extrabold leading-snug tracking-tight sm:text-4xl">
              ترکیب زیبایی،{" "}
              <span className="bg-gradient-to-l from-sky-300 to-blue-400 bg-clip-text text-transparent">
                اصالت و فناوری روز دنیا
              </span>
            </h1>
            <p className="text-sm leading-7 text-zinc-300 sm:text-base sm:leading-8">
              ولورا با هدف ارائه‌ی تجربه‌ای شفاف، سریع و مطمئن در خرید محصولات
              تخصصی دیجیتال راه‌اندازی شده است. تمرکز ما بر عرضه‌ی جدیدترین
              گوشی‌های هوشمند، مک‌بوک‌ها، کنسول‌های بازی PS5 و هدفون‌های حرفه‌ای
              با قیمت به‌روز و تضمین اصالت است.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/search"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-10 gap-2 rounded-xl bg-white px-5 font-semibold text-zinc-950 hover:bg-zinc-200",
              )}
            >
              مشاهده محصولات فروشگاه
              <ArrowLeft className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-10 rounded-xl border-white/25 bg-white/10 px-5 text-white hover:bg-white/20 hover:text-white",
              )}
            >
              صفحه اصلی
            </Link>
          </div>
        </div>
      </section>

      {/* Store Stats */}
      <section aria-labelledby="about-stats-heading">
        <h2 id="about-stats-heading" className="sr-only">
          آمار فروشگاه ولورا
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatBox
            icon={<Layers className="size-5 text-sky-500" />}
            value={`${formatNumber(totalProducts)}+`}
            label="محصول منتخب و به‌روز"
          />
          <StatBox
            icon={<Award className="size-5 text-emerald-500" />}
            value={formatNumber(categories.length)}
            label="دسته‌بندی تخصصی دیجیتال"
          />
          <StatBox
            icon={<CheckCircle2 className="size-5 text-violet-500" />}
            value="۱۰۰٪"
            label="تضمین اصالت و سلامت کالا"
          />
          <StatBox
            icon={<RotateCcw className="size-5 text-amber-500" />}
            value="۷ روز"
            label="ضمانت بازگشت کالا"
          />
        </div>
      </section>

      {/* Why Velora */}
      <section aria-labelledby="values-heading" className="space-y-5">
        <div className="space-y-1.5">
          <h2
            id="values-heading"
            className="text-xl font-bold tracking-tight text-foreground sm:text-2xl"
          >
            چرا خرید از ولورا؟
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            اصولی که در تمام مراحل انتخاب، بسته‌بندی و ارسال به آن‌ها پایبندیم
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CORE_VALUES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-xs"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-foreground sm:text-base">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-6 text-muted-foreground sm:text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-border/70 bg-muted/30 p-6 sm:flex-row sm:items-center sm:p-8">
        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-foreground sm:text-xl">
            آماده انتخاب محصول بعدی خود هستید؟
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            جدیدترین مدل‌های ۲۰۲۶ اپل و تجهیزات صوتی را همین حالا مقایسه و
            انتخاب کنید.
          </p>
        </div>
        <Link
          href="/search"
          className={cn(buttonVariants({ size: "lg" }), "shrink-0 gap-2")}
        >
          شروع جستجو
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}

function StatBox({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border/70 bg-card p-5 text-center shadow-xs">
      <div className="flex size-10 items-center justify-center rounded-xl bg-muted/60">
        {icon}
      </div>
      <p className="text-xl font-extrabold tabular-nums text-foreground sm:text-2xl">
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

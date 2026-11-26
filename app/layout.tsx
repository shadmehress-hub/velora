import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { vazirmatnVariable } from "next-persian-fonts/vazirmatn-variable";

import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: false,
});

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.AUTH_URL ??
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Velora | فروشگاه تخصصی کالای دیجیتال",
    template: "%s | Velora",
  },
  description:
    "فروشگاه اینترنتی ولورا؛ عرضه جدیدترین مدل‌های آیفون، مک‌بوک، کنسول‌های بازی PS5 و هدفون‌های حرفه‌ای با ضمانت اصالت کالا و ارسال سریع.",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "Velora",
    title: "Velora | فروشگاه تخصصی کالای دیجیتال",
    description:
      "فروشگاه اینترنتی ولورا؛ عرضه جدیدترین مدل‌های آیفون، مک‌بوک، کنسول‌های بازی PS5 و هدفون‌های حرفه‌ای با ضمانت اصالت کالا.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      suppressHydrationWarning
      lang="fa"
      dir="rtl"
      className={cn(
        "antialiased",
        vazirmatnVariable.variable,
        inter.variable,
        "font-sans",
      )}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <ThemeProvider
          defaultTheme="light"
          enableSystem
          attribute="class"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

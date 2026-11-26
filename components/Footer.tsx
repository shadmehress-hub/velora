import Link from "next/link";
import Logo from "./shared/Logo";

async function Footer() {
  "use cache";
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 w-full border-t border-border/60 bg-muted/20">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-10">
        <div className="space-y-3 sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="text-xs leading-6 text-muted-foreground sm:text-sm">
            فروشگاه اینترنتی ولورا؛ عرضه‌کننده محصولات منتخب دیجیتال، آیفون،
            مک‌بوک، کنسول‌های بازی PS5 و تجهیزات صوتی با ضمانت اصالت کالا.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground">دسته‌بندی‌ها</h3>
          <ul className="space-y-2 text-xs text-muted-foreground sm:text-sm">
            <li>
              <Link
                href="/search?category=%D9%85%D9%88%D8%A8%D8%A7%DB%8C%D9%84"
                className="transition-colors hover:text-foreground"
              >
                موبایل
              </Link>
            </li>
            <li>
              <Link
                href="/search?category=%D9%84%D9%BE%D8%AA%D8%A7%D9%BE"
                className="transition-colors hover:text-foreground"
              >
                لپتاپ
              </Link>
            </li>
            <li>
              <Link
                href="/search?category=%D9%87%D8%AF%D9%81%D9%88%D9%86"
                className="transition-colors hover:text-foreground"
              >
                هدفون
              </Link>
            </li>
            <li>
              <Link
                href="/search?category=%DA%A9%D9%86%D8%B3%D9%88%D9%84%20%D8%A8%D8%A7%D8%B2%DB%8C"
                className="transition-colors hover:text-foreground"
              >
                کنسول بازی
              </Link>
            </li>
            <li>
              <Link
                href="/search"
                className="transition-colors hover:text-foreground"
              >
                همه محصولات
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground">خدمات مشتریان</h3>
          <ul className="space-y-2 text-xs text-muted-foreground sm:text-sm">
            <li>
              <Link
                href="/about"
                className="transition-colors hover:text-foreground"
              >
                درباره ما
              </Link>
            </li>
            <li>
              <Link
                href="/cart"
                className="transition-colors hover:text-foreground"
              >
                سبد خرید
              </Link>
            </li>
            <li>
              <Link
                href="/signin"
                className="transition-colors hover:text-foreground"
              >
                ورود به حساب
              </Link>
            </li>
            <li>
              <Link
                href="/signup"
                className="transition-colors hover:text-foreground"
              >
                ایجاد حساب کاربری
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground">مزایای خرید</h3>
          <ul className="space-y-2 text-xs text-muted-foreground sm:text-sm">
            <li>ارسال رایگان سفارش‌های بالای ۵۰ میلیون تومان</li>
            <li>۷ روز ضمانت بازگشت کالا</li>
            <li>تضمین اصالت و سلامت فیزیکی</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-muted-foreground sm:px-6 sm:text-sm lg:px-10">
          © {currentYear} Velora Store — تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}

export default Footer;

import { z } from "zod";

export const insertProductSchema = z.object({
  name: z.string().trim().min(3, "نام محصول باید حداقل ۳ کاراکتر باشد"),
  slug: z
    .string()
    .trim()
    .min(3, "اسلاگ باید حداقل ۳ کاراکتر باشد")
    .regex(/^[a-z0-9-]+$/, "اسلاگ فقط می‌تواند شامل حروف کوچک انگلیسی، عدد و خط تیره باشد"),
  category: z.string().trim().min(2, "دسته‌بندی الزامی است"),
  description: z.string().trim().min(5, "توضیحات باید حداقل ۵ کاراکتر باشد"),
  image: z.string().trim().min(1, "تصویر محصول الزامی است"),
  price: z.number().int("قیمت باید عدد صحیح باشد").nonnegative("قیمت نمی‌تواند منفی باشد"),
  brand: z.string().trim().min(2, "برند الزامی است"),
  stock: z.number().int("موجودی باید عدد صحیح باشد").nonnegative("موجودی نمی‌تواند منفی باشد"),
});

export const signInFormSchema = z.object({
  email: z.string().trim().email("ایمیل وارد شده معتبر نیست"),
  password: z.string().min(5, "رمز عبور باید حداقل ۵ کاراکتر باشد"),
});

export const signUpFormSchema = z
  .object({
    name: z.string().trim().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
    email: z.string().trim().email("ایمیل وارد شده معتبر نیست"),
    password: z.string().min(5, "رمز عبور باید حداقل ۵ کاراکتر باشد"),
    confirmPassword: z
      .string()
      .min(5, "تکرار رمز عبور باید حداقل ۵ کاراکتر باشد"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن مطابقت ندارند",
    path: ["confirmPassword"],
  });

export const cartItemInputSchema = z.object({
  productId: z.string().trim().min(1, "شناسه محصول الزامی است"),
  qty: z.number().int("تعداد باید عدد صحیح باشد").min(0, "تعداد نمی‌تواند منفی باشد"),
});

export const shippingAddressSchema = z.object({
  fullName: z.string().trim().min(3, "نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد"),
  phone: z
    .string()
    .trim()
    .regex(/^09\d{9}$/, "شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد"),
  province: z.string().trim().min(2, "استان الزامی است"),
  city: z.string().trim().min(2, "شهر الزامی است"),
  address: z.string().trim().min(10, "آدرس دقیق باید حداقل ۱۰ کاراکتر باشد"),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "کد پستی باید دقیقاً ۱۰ رقم انگلیسی باشد"),
  paymentMethod: z.enum(["zarinpal", "cod"], {
    error: "روش پرداخت نامعتبر است",
  }),
});

export const insertReviewSchema = z.object({
  productId: z.string().trim().min(1, "شناسه محصول الزامی است"),
  rating: z
    .number()
    .int("امتیاز باید عدد صحیح باشد")
    .min(1, "لطفاً امتیازی بین ۱ تا ۵ انتخاب کنید")
    .max(5, "امتیاز نمی‌تواند بیشتر از ۵ باشد"),
  title: z
    .string()
    .trim()
    .min(3, "عنوان نظر باید حداقل ۳ کاراکتر باشد")
    .max(80, "عنوان نظر حداکثر ۸۰ کاراکتر می‌تواند باشد"),
  comment: z
    .string()
    .trim()
    .min(10, "متن نظر باید حداقل ۱۰ کاراکتر باشد")
    .max(1000, "متن نظر حداکثر ۱۰۰۰ کاراکتر می‌تواند باشد"),
});

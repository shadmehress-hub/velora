import { prisma } from "../lib/prisma";

import data from "./products";
import userData from "./users";

const SAMPLE_REVIEWS = [
  {
    productSlug: "iphone-17-pro-max",
    userEmail: "user@velora.ir",
    rating: 5,
    title: "کیفیت ساخت و دوربین بی‌نظیر",
    comment:
      "بدنه تیتانیومی بسیار باکیفیت و خوش‌دست هست. دوربین تله‌فوتو و صفحه‌نمایش فوق‌العاده روان کار می‌کنند و باتری به راحتی یک روز کامل دوام می‌آورد.",
    isVerifiedPurchase: true,
  },
  {
    productSlug: "iphone-17-pro-max",
    userEmail: "shadmehress@gmail.com",
    rating: 4,
    title: "پرچمدار عالی با قیمت بالا",
    comment:
      "سرعت پردازش بی‌نظیر است و نمایشگر روشنایی عالی دارد، فقط قیمت در بازار نسبتاً بالا است و شارژر در جعبه نیست.",
    isVerifiedPurchase: false,
  },
  {
    productSlug: "iphone-17-air",
    userEmail: "user@velora.ir",
    rating: 5,
    title: "فوق‌العاده باریک و سبک",
    comment:
      "وزن کم و ضخامت باریک این مدل حس متفاوتی می‌دهد. نمایشگر OLED روشنایی بالایی دارد و عملکرد روزمره بسیار سریع است.",
    isVerifiedPurchase: true,
  },
  {
    productSlug: "macbook-pro-16-m5",
    userEmail: "user@velora.ir",
    rating: 5,
    title: "هیولای تدوین و برنامه‌نویسی",
    comment:
      "تراشه M5 در رندرینگ و کامپایل پروژه‌های سنگین فوق‌العاده سریع عمل می‌کند و اصلا داغ نمی‌شود. صفحه نمایش هم بی‌رقیب است.",
    isVerifiedPurchase: true,
  },
  {
    productSlug: "macbook-air-13-m4",
    userEmail: "shadmehress@gmail.com",
    rating: 5,
    title: "بهترین لپتاپ دانشجویی و کار روزمره",
    comment:
      "بی‌صدا، سبک و شارژدهی باتری عالی. برای برنامه‌نویسی وب و کارهای روزانه سرعتش فوق‌العاده است.",
    isVerifiedPurchase: true,
  },
  {
    productSlug: "sony-wh-1000xm6",
    userEmail: "user@velora.ir",
    rating: 5,
    title: "حذف نویز استودیویی واقعی",
    comment:
      "کیفیت صدا و بیس فوق‌العاده تمیز است و حذف نویز در مترو و محیط کار تقریبا تمام صداهای مزاحم را حذف می‌کند.",
    isVerifiedPurchase: true,
  },
  {
    productSlug: "airpods-max-usb-c",
    userEmail: "shadmehress@gmail.com",
    rating: 4,
    title: "لوکس با صدای فضایی عالی",
    comment:
      "جنس بدنه آلومینیومی و کیفیت صدای فضایی بی‌نظیر است، فقط در استفاده طولانی کمی وزن بالایی دارد.",
    isVerifiedPurchase: false,
  },
];

async function main() {
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();

  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  await prisma.product.createMany({ data: data.products });
  await prisma.user.createMany({ data: userData.users });

  const [products, users] = await Promise.all([
    prisma.product.findMany({ select: { id: true, slug: true } }),
    prisma.user.findMany({ select: { id: true, email: true } }),
  ]);

  const productBySlug = new Map(products.map((p) => [p.slug, p.id]));
  const userByEmail = new Map(users.map((u) => [u.email, u.id]));

  const reviewRows = SAMPLE_REVIEWS.flatMap((review) => {
    const productId = productBySlug.get(review.productSlug);
    const userId = userByEmail.get(review.userEmail);
    if (!productId || !userId) return [];
    return [
      {
        productId,
        userId,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        isVerifiedPurchase: review.isVerifiedPurchase,
      },
    ];
  });

  if (reviewRows.length > 0) {
    await prisma.review.createMany({ data: reviewRows });
  }

  const touchedProductIds = Array.from(new Set(reviewRows.map((r) => r.productId)));
  for (const productId of touchedProductIds) {
    const agg = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: Number((agg._avg.rating ?? 0).toFixed(1)),
        numReviews: agg._count.rating,
      },
    });
  }

  console.log(
    `Seed complete: ${data.products.length} products, ${userData.users.length} users, ${reviewRows.length} reviews.`,
  );
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

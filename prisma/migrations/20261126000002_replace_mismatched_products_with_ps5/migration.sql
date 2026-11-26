-- Fix all remaining product image/title/description mismatches and replace redundant/mismatched items with PS5 products

-- 1. Fix mismatched Mobile items (accurate photos matching model & camera layout)
UPDATE "Product"
SET
  "description" = 'عملکرد روان با پردازنده‌ی قوی و دوربین دوگانه‌ی باکیفیت برای استفاده‌ی روزمره.',
  "image" = '/images/mobile/01.png',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'iphone-13';

UPDATE "Product"
SET
  "image" = '/images/mobile/03.png',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'iphone-14';

UPDATE "Product"
SET
  "description" = 'کیفیت ساخت بالا با جزیره پویا، دوربین سه‌گانه و صفحه‌نمایش روان ۱۲۰ هرتز.',
  "image" = '/images/mobile/04.png',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'iphone-14-pro';

UPDATE "Product"
SET
  "description" = 'نسل جدید با طراحی بهبود‌یافته، جزیره پویا و عملکرد سریع‌تر در کارهای روزمره.',
  "image" = '/images/mobile/05.png',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'iphone-15';

UPDATE "Product"
SET
  "description" = 'بدنه‌ی تیتانیومی سبک‌تر و پردازنده‌ی جدیدتر برای تجربه‌ی نرم‌تر و سریع‌تر.',
  "image" = '/images/mobile/06.png',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'iphone-15-pro';

UPDATE "Product"
SET
  "image" = '/images/mobile/09.png',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'iphone-17-pro-max';

UPDATE "Product"
SET
  "description" = 'فوق‌العاده باریک و سبک با ماژول دوربین تک‌لنزی مدرن، نمایشگر OLED روان و عملکرد بی‌نقص روزمره.',
  "image" = '/images/mobile/10.png',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'iphone-17-air';

-- 2. Fix mismatched MacBook items (chassis & generation alignment, remove Windows laptop & duplicate bezel)
UPDATE "Product"
SET
  "description" = 'طراحی جدید تخت با صفحه‌نمایش روشن‌تر و عمر باتری بیشتر.',
  "image" = '/images/macbook/07.png',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'macbook-air-m2';

UPDATE "Product"
SET
  "image" = '/images/macbook/02.png',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'macbook-air-m1';

UPDATE "Product"
SET
  "description" = 'مجهز به تاچ‌بار و مناسب برای کارهای برنامه‌نویسی و طراحی سبک.',
  "image" = '/images/macbook/05.png',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'macbook-pro-13-m2';

UPDATE "Product"
SET
  "description" = 'قدرت بالا در رنگ Space Black برای کارهای سنگین‌تر و تدوین ویدیو.',
  "image" = '/images/macbook/01.png',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'macbook-pro-14-m3-pro';

UPDATE "Product"
SET
  "description" = 'تجربه‌ی کاری پایدار با درگاه‌های کامل، سیستم خنک‌کننده‌ی بهتر و عملکرد قوی.',
  "image" = '/images/macbook/04.png',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'macbook-pro-16-m2-pro';

UPDATE "Product"
SET
  "image" = '/images/macbook/09.png',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'macbook-pro-16-m5';

-- 3. Align remaining Headphones with exact visible brands & clean wireless image
UPDATE "Product"
SET
  "name" = 'Sennheiser HD 450BT',
  "slug" = 'sennheiser-hd-450bt',
  "description" = 'هدفون بی‌سیم تاشو و قابل‌حمل سنهایزر با حذف نویز فعال و کنترل‌های ساده روی بدنه.',
  "image" = '/images/headphone/04.png',
  "price" = 12400000,
  "brand" = 'Sennheiser',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'wireless-headphones-a4';

UPDATE "Product"
SET
  "name" = 'Razer Opus Wireless',
  "slug" = 'razer-opus-wireless',
  "description" = 'هدفون بی‌سیم ریزر با صدای استودیویی THX، میکروفن داخلی باکیفیت و مناسب برای مکالمه و جلسات آنلاین.',
  "image" = '/images/headphone/06.png',
  "price" = 11500000,
  "brand" = 'Razer',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'wireless-headphones-a6';

UPDATE "Product"
SET
  "name" = 'Rode NTH-100',
  "slug" = 'rode-nth-100',
  "description" = 'هدفون استودیویی حرفه‌ای رُد با درایورهای دقیق، بالشتک‌های راحت آلکانتارا و طراحی ارگونومیک برای تدوین و مانیتورینگ صدا.',
  "image" = '/images/headphone/07.png',
  "price" = 13800000,
  "brand" = 'Rode',
  "stock" = 4,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'wireless-headphones-a7';

UPDATE "Product"
SET
  "image" = '/images/headphone/03.png',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'wireless-headphones-a3';

-- 4. Replace mismatched/redundant products with PlayStation 5 (PS5) ecosystem products
UPDATE "Product"
SET
  "name" = 'پایه شارژر دوگانه DualSense PS5',
  "slug" = 'ps5-dualsense-charging-station',
  "category" = 'کنسول بازی',
  "description" = 'داک شارژ رسمی سونی با قابلیت شارژ همزمان دو کنترلر بی‌سیم DualSense بدون نیاز به اتصال مستقیم به کنسول.',
  "image" = '/images/ps5/07.jpg',
  "price" = 5800000,
  "brand" = 'Sony',
  "stock" = 8,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'wireless-headphones-a1';

UPDATE "Product"
SET
  "name" = 'PlayStation 5 Slim (Standard Edition)',
  "slug" = 'ps5-slim-standard',
  "category" = 'کنسول بازی',
  "description" = 'نسخه‌ی اسلیم پلی‌استیشن ۵ دارای درایو دیسک Ultra HD Blu-ray، حافظه ۱ ترابایت SSD و طراحی باریک‌تر و سبک‌تر.',
  "image" = '/images/ps5/02.jpg',
  "price" = 225000000,
  "brand" = 'Sony',
  "stock" = 6,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'iphone-se-3rd-gen';

UPDATE "Product"
SET
  "name" = 'هدست بی‌سیم PlayStation Pulse Elite',
  "slug" = 'ps5-pulse-elite-headset',
  "category" = 'کنسول بازی',
  "description" = 'هدست بی‌سیم رسمی پلی‌استیشن ۵ با درایورهای Planar Magnetic، صدای سه‌بعدی Tempest و میکروفون جمع‌شونده.',
  "image" = '/images/ps5/05.jpg',
  "price" = 34900000,
  "brand" = 'Sony',
  "stock" = 5,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'wireless-headphones-a8';

UPDATE "Product"
SET
  "name" = 'پلی‌استیشن پورتال (PlayStation Portal)',
  "slug" = 'ps5-playstation-portal',
  "category" = 'کنسول بازی',
  "description" = 'دستگاه استریم دستی رسمی سونی برای اجرای بازی‌های PS5 روی نمایشگر ۸ اینچی Full HD با کنترلر یکپارچه DualSense.',
  "image" = '/images/ps5/06.jpg',
  "price" = 62500000,
  "brand" = 'Sony',
  "stock" = 4,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'wireless-headphones-a2';

UPDATE "Product"
SET
  "name" = 'PlayStation 5 Pro (2TB)',
  "slug" = 'ps5-pro-2tb',
  "category" = 'کنسول بازی',
  "description" = 'کنسول بازی نسل نهمی سونی با پردازشگر گرافیکی ارتقایافته، رهگیری پرتو پیشرفته و ۲ ترابایت حافظه SSD فوق‌سریع.',
  "image" = '/images/ps5/01.jpg',
  "price" = 425000000,
  "brand" = 'Sony',
  "stock" = 4,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'iphone-12-mini';

INSERT INTO "Product" ("id", "name", "slug", "category", "description", "image", "price", "brand", "stock", "updatedAt")
SELECT
  '13',
  'PlayStation 5 Pro (2TB)',
  'ps5-pro-2tb',
  'کنسول بازی',
  'کنسول بازی نسل نهمی سونی با پردازشگر گرافیکی ارتقایافته، رهگیری پرتو پیشرفته و ۲ ترابایت حافظه SSD فوق‌سریع.',
  '/images/ps5/01.jpg',
  425000000,
  'Sony',
  4,
  CURRENT_TIMESTAMP
WHERE EXISTS (SELECT 1 FROM "Product")
  AND NOT EXISTS (SELECT 1 FROM "Product" WHERE "id" = '13' OR "slug" = 'ps5-pro-2tb');

UPDATE "Product"
SET
  "name" = 'دسته بازی بی‌سیم DualSense PS5',
  "slug" = 'ps5-dualsense-controller',
  "category" = 'کنسول بازی',
  "description" = 'کنترلر اصلی پلی‌استیشن ۵ با بازخورد لمسی دقیق (Haptic Feedback)، تریگرهای تطبیق‌پذیر و تاچ‌پد یکپارچه.',
  "image" = '/images/ps5/04.jpg',
  "price" = 14500000,
  "brand" = 'Sony',
  "stock" = 10,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'macbook-pro-14-m1-pro';

UPDATE "Product"
SET
  "name" = 'PlayStation 5 Slim (Digital Edition)',
  "slug" = 'ps5-slim-digital',
  "category" = 'کنسول بازی',
  "description" = 'نسخه‌ی تمام‌دیجیتال پلی‌استیشن ۵ اسلیم بدون درایو دیسک با ۱ ترابایت حافظه پرسرعت و اجرای بازی‌ها با نرخ ۱۲۰ فریم.',
  "image" = '/images/ps5/03.jpg',
  "price" = 213000000,
  "brand" = 'Sony',
  "stock" = 5,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'iphone-13-pro';

UPDATE "Product"
SET
  "name" = 'دسته حرفه‌ای DualSense Edge PS5',
  "slug" = 'ps5-dualsense-edge',
  "category" = 'کنسول بازی',
  "description" = 'کنترلر حرفه‌ای و قابل شخصی‌سازی پلی‌استیشن ۵ با دکمه‌های پشتی قابل تنظیم و ماژول‌های آنالوگ دقیق.',
  "image" = '/images/ps5/08.jpg',
  "price" = 47500000,
  "brand" = 'Sony',
  "stock" = 3,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'wireless-headphones-a5';

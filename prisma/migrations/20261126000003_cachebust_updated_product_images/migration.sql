-- Cache-bust updated product images with unique filenames so Vercel Edge /_next/image CDN serves fresh assets
UPDATE "Product" SET "image" = '/images/mobile/iphone-13.png', "updatedAt" = CURRENT_TIMESTAMP WHERE "slug" = 'iphone-13';
UPDATE "Product" SET "image" = '/images/mobile/iphone-14.png', "updatedAt" = CURRENT_TIMESTAMP WHERE "slug" = 'iphone-14';
UPDATE "Product" SET "image" = '/images/mobile/iphone-14-pro.png', "updatedAt" = CURRENT_TIMESTAMP WHERE "slug" = 'iphone-14-pro';
UPDATE "Product" SET "image" = '/images/mobile/iphone-15.png', "updatedAt" = CURRENT_TIMESTAMP WHERE "slug" = 'iphone-15';
UPDATE "Product" SET "image" = '/images/mobile/iphone-15-pro.png', "updatedAt" = CURRENT_TIMESTAMP WHERE "slug" = 'iphone-15-pro';
UPDATE "Product" SET "image" = '/images/mobile/iphone-17-pro-max.png', "updatedAt" = CURRENT_TIMESTAMP WHERE "slug" = 'iphone-17-pro-max';
UPDATE "Product" SET "image" = '/images/mobile/iphone-17-air.png', "updatedAt" = CURRENT_TIMESTAMP WHERE "slug" = 'iphone-17-air';

UPDATE "Product" SET "image" = '/images/macbook/macbook-air-m2.png', "updatedAt" = CURRENT_TIMESTAMP WHERE "slug" = 'macbook-air-m2';
UPDATE "Product" SET "image" = '/images/macbook/macbook-pro-16-m5.png', "updatedAt" = CURRENT_TIMESTAMP WHERE "slug" = 'macbook-pro-16-m5';

UPDATE "Product"
SET
  "image" = '/images/headphone/wireless-a3.png',
  "brand" = 'Velora',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'wireless-headphones-a3';

-- Restore iPhone 14 if missing from an already-populated database
INSERT INTO "Product" ("id", "name", "slug", "category", "description", "image", "price", "brand", "stock", "updatedAt")
SELECT
  '10',
  'iPhone 14',
  'iphone-14',
  'موبایل',
  'سرعت بالا، شارژدهی مناسب و دوربین دقیق برای عکس‌های روزمره.',
  '/images/mobile/iphone-14.png',
  165000000,
  'Apple',
  8,
  CURRENT_TIMESTAMP
WHERE EXISTS (SELECT 1 FROM "Product")
  AND NOT EXISTS (SELECT 1 FROM "Product" WHERE "id" = '10' OR "slug" = 'iphone-14');

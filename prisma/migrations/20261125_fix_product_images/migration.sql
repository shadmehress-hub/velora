-- Fix duplicate product images for items 25-32
UPDATE "Product" SET image = '/images/mobile/09.png'   WHERE slug = 'iphone-17-pro-max';
UPDATE "Product" SET image = '/images/mobile/10.png'   WHERE slug = 'iphone-17-air';
UPDATE "Product" SET image = '/images/mobile/11.png'   WHERE slug = 'iphone-17';
UPDATE "Product" SET image = '/images/mobile/12.png'   WHERE slug = 'iphone-16';
UPDATE "Product" SET image = '/images/macbook/09.png'  WHERE slug = 'macbook-pro-16-m5';
UPDATE "Product" SET image = '/images/macbook/10.png'  WHERE slug = 'macbook-air-13-m4';
UPDATE "Product" SET image = '/images/headphone/09.png' WHERE slug = 'airpods-max-usb-c';
UPDATE "Product" SET image = '/images/headphone/10.png' WHERE slug = 'sony-wh-1000xm6';

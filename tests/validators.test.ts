import assert from "node:assert/strict";
import { describe, it } from "node:test";

import data from "../data/products";
import {
  cartItemInputSchema,
  insertProductSchema,
  insertReviewSchema,
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
} from "../lib/validator";

describe("insertProductSchema", () => {
  it("validates every seeded product in data/products.ts", () => {
    assert.ok(data.products.length >= 32);
    for (const product of data.products) {
      const result = insertProductSchema.safeParse(product);
      assert.equal(
        result.success,
        true,
        `Expected ${product.slug} to pass validation`,
      );
    }
  });

  it("rejects invalid slug, negative price, or short name", () => {
    const result = insertProductSchema.safeParse({
      name: "ab",
      slug: "Invalid Slug!",
      category: "موبایل",
      description: "توضیح کوتاه تست",
      image: "/images/mobile/01.png",
      price: -100,
      brand: "Apple",
      stock: 2,
    });
    assert.equal(result.success, false);
  });
});

describe("auth schemas", () => {
  it("validates signInFormSchema with valid email and password", () => {
    const ok = signInFormSchema.safeParse({
      email: "shadmehress@gmail.com",
      password: "12345",
    });
    assert.equal(ok.success, true);

    const bad = signInFormSchema.safeParse({
      email: "not-an-email",
      password: "123",
    });
    assert.equal(bad.success, false);
  });

  it("rejects mismatched confirmPassword in signUpFormSchema", () => {
    const mismatch = signUpFormSchema.safeParse({
      name: "علی محمدی",
      email: "ali@example.com",
      password: "password123",
      confirmPassword: "different123",
    });
    assert.equal(mismatch.success, false);

    const match = signUpFormSchema.safeParse({
      name: "علی محمدی",
      email: "ali@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
    assert.equal(match.success, true);
  });
});

describe("cartItemInputSchema", () => {
  it("accepts zero qty (removal) and rejects negative qty", () => {
    assert.equal(
      cartItemInputSchema.safeParse({ productId: "prod-1", qty: 0 }).success,
      true,
    );
    assert.equal(
      cartItemInputSchema.safeParse({ productId: "prod-1", qty: -1 }).success,
      false,
    );
  });
});

describe("shippingAddressSchema", () => {
  it("validates Iranian mobile number and 10-digit postal code", () => {
    const ok = shippingAddressSchema.safeParse({
      fullName: "مهدی رضایی",
      phone: "09123456789",
      province: "تهران",
      city: "تهران",
      address: "خیابان ولیعصر، کوچه بهار، پلاک ۱۲",
      postalCode: "1234567890",
      paymentMethod: "zarinpal",
    });
    assert.equal(ok.success, true);

    const badPhone = shippingAddressSchema.safeParse({
      fullName: "مهدی رضایی",
      phone: "02112345678",
      province: "تهران",
      city: "تهران",
      address: "خیابان ولیعصر، کوچه بهار، پلاک ۱۲",
      postalCode: "12345",
      paymentMethod: "cod",
    });
    assert.equal(badPhone.success, false);
  });
});

describe("insertReviewSchema", () => {
  it("enforces rating 1..5 and minimum title/comment length", () => {
    const ok = insertReviewSchema.safeParse({
      productId: "1",
      rating: 5,
      title: "کیفیت عالی",
      comment: "بسیار محصول باکیفیت و خوش‌ساختی است.",
    });
    assert.equal(ok.success, true);

    const badRating = insertReviewSchema.safeParse({
      productId: "1",
      rating: 6,
      title: "عنوان",
      comment: "بسیار محصول باکیفیت و خوش‌ساختی است.",
    });
    assert.equal(badRating.success, false);
  });
});

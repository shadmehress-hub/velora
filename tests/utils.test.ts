import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  convertToPlainObject,
  formatNumber,
  formatPrice,
  FREE_SHIPPING_THRESHOLD,
  ORDER_STATUS_META,
  STANDARD_SHIPPING_FEE,
} from "../lib/utils";

describe("formatting utilities", () => {
  it("formats prices in Persian digits with Toman suffix", () => {
    const result = formatPrice(130000000);
    assert.ok(result.endsWith("تومان"));
    assert.ok(result.includes("۱۳۰"));
  });

  it("formats numbers using fa-IR locale", () => {
    assert.equal(formatNumber(24), "۲۴");
  });

  it("converts nested objects to plain JSON objects", () => {
    const date = new Date("2026-11-25T12:00:00.000Z");
    const plain = convertToPlainObject({ id: "1", createdAt: date });
    assert.equal(plain.id, "1");
    assert.equal(typeof plain.createdAt, "string");
  });
});

describe("store constants and order status metadata", () => {
  it("has positive shipping threshold and fee", () => {
    assert.ok(FREE_SHIPPING_THRESHOLD > 0);
    assert.ok(STANDARD_SHIPPING_FEE > 0);
  });

  it("defines labels for all core order statuses", () => {
    for (const status of [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ]) {
      assert.ok(ORDER_STATUS_META[status]?.label);
    }
  });
});

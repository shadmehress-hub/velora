import "dotenv/config";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { after, describe, it } from "node:test";
import { compare } from "bcryptjs";

import { analyzeProductReviewsAI } from "../lib/actions/review.action";
import { prisma } from "../lib/prisma";

describe("database and assets integrity", () => {
  after(async () => {
    await prisma.$disconnect();
  });

  it("connects to database and passes health query", async () => {
    const res = await prisma.$queryRaw`SELECT 1 as ok`;
    assert.ok(Array.isArray(res) && res.length === 1);
  });

  it("has all 32 seeded products with valid public image files on disk", async () => {
    const products = await prisma.product.findMany();
    assert.ok(products.length >= 32, `Expected >= 32 products, got ${products.length}`);

    for (const product of products) {
      assert.ok(product.price >= 0, `Invalid price for ${product.slug}`);
      assert.ok(product.stock >= 0, `Invalid stock for ${product.slug}`);
      assert.ok(product.image.startsWith("/"), `Invalid image path for ${product.slug}`);

      const diskPath = path.join(process.cwd(), "public", product.image);
      assert.equal(
        fs.existsSync(diskPath),
        true,
        `Missing image on disk: ${diskPath}`,
      );
    }
  });

  it("has valid seeded Admin and User credentials", async () => {
    const admin = await prisma.user.findUnique({
      where: { email: "shadmehress@gmail.com" },
    });
    assert.ok(admin, "Admin user should exist");
    assert.equal(admin.role, "admin");
    assert.ok(admin.password);
    assert.equal(await compare("13821382", admin.password), true);

    const user = await prisma.user.findUnique({
      where: { email: "user@velora.ir" },
    });
    assert.ok(user, "Regular user should exist");
    assert.equal(user.role, "user");
    assert.ok(user.password);
    assert.equal(await compare("12345", user.password), true);
  });

  it("has synced review counts and ratings on products", async () => {
    const reviews = await prisma.review.findMany();
    assert.ok(reviews.length >= 7, "Expected >= 7 seeded reviews");

    const iphone17ProMax = await prisma.product.findUnique({
      where: { slug: "iphone-17-pro-max" },
      include: { reviews: true },
    });
    assert.ok(iphone17ProMax);
    assert.equal(iphone17ProMax.numReviews, iphone17ProMax.reviews.length);
    assert.ok(iphone17ProMax.rating > 0);
  });

  it("runs AI review analysis cleanly on seeded product reviews", async () => {
    const product = await prisma.product.findUnique({
      where: { slug: "iphone-17-pro-max" },
    });
    assert.ok(product);

    const result = await analyzeProductReviewsAI(product.id);
    assert.equal(result.success, true);
    assert.ok(result.analysis);
    assert.ok(result.analysis.summary.length > 10);
    assert.ok(result.analysis.pros.length > 0);
    assert.ok(result.analysis.satisfactionPercent >= 0);
    assert.ok(result.analysis.satisfactionPercent <= 100);
  });
});

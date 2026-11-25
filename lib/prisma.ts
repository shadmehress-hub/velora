import path from "node:path";
import { PrismaClient } from "./generated/prisma/client";

function resolveDatasourceUrl() {
  const url = process.env.DATABASE_URL;
  if (!url || !url.startsWith("file:./")) return url;

  const relativePath = url.slice("file:./".length);
  return `file:${path.resolve(process.cwd(), "prisma", relativePath)}`;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const cachedPrisma =
  globalForPrisma.prisma &&
  "cart" in globalForPrisma.prisma &&
  "order" in globalForPrisma.prisma &&
  "review" in globalForPrisma.prisma
    ? globalForPrisma.prisma
    : undefined;

export const prisma =
  cachedPrisma ??
  new PrismaClient({
    datasourceUrl: resolveDatasourceUrl(),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

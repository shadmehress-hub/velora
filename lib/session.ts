import { connection } from "next/server";

import { auth } from "@/auth";

/**
 * Reads the Auth.js session after awaiting `connection()` so Next.js Cache
 * Components prerendering stops before `@auth/core` calls `crypto.getRandomValues()`.
 */
export async function getServerSession() {
  await connection();
  return auth();
}

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.AUTH_URL ??
    "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/about", "/search", "/product/"],
      disallow: [
        "/admin",
        "/api",
        "/cart",
        "/orders",
        "/shipping",
        "/payment",
        "/signin",
        "/signup",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

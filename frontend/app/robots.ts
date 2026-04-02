import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/dashboard/",
          "/api/",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/verify-email",
          "/share/",
          "/download/",
          "/auth/oauth-callback",
        ],
      },
    ],
    sitemap: "https://promptforgeai.dev/sitemap.xml",
    host: "https://promptforgeai.dev",
  };
}

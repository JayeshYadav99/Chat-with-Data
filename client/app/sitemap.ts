import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://chat-with-data-bice.vercel.app";
  const currentDate = new Date().toISOString();

  // Define your static routes here
  const routes = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 1,
    },
  ];

  return routes;
}

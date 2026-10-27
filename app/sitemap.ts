import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/pricing";

const PROYECTOS = [
  "flowbill",
  "agenda-pro",
  "ventachat-ai",
  "insightai-dashboard",
  "minimo-studio",
  "ecommerce",
  "plataforma-educativa",
  "rpg",
  "faebo",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date();

  const estaticas: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: ahora,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/cotizar`,
      lastModified: ahora,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: ahora,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: ahora,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: ahora,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/privacidad`,
      lastModified: ahora,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terminos`,
      lastModified: ahora,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const proyectos: MetadataRoute.Sitemap = PROYECTOS.map((slug) => ({
    url: `${SITE_URL}/projects/${slug}`,
    lastModified: ahora,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...estaticas, ...proyectos];
}

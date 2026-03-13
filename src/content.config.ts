import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    lang: z.enum(['es', 'en']),
    category: z.enum(['Logbook: Tech', 'Escala Kardashov', 'El Gran Silencio', 'Deep Cosmos']),
    pubDate: z.date(),
    tags: z.array(z.string()),
    translationId: z.string()
  })
});

export const collections = {
  'blog': blogCollection,
};

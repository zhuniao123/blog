import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

export const BLOG_PATH = "src/data/blog";
export const PROMPT_PATH = "src/data/prompts";

const assetReference = z.string().refine(
  value => value.startsWith("/") || z.string().url().safeParse(value).success,
  {
    message: "Expected an absolute URL or a site-root asset path.",
  }
);

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

const prompts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${PROMPT_PATH}` }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    lang: z.enum(["zh", "en"]).default("zh"),
    sourceDate: z.date(),
    sourcePlatform: z.string().default("x"),
    sourceUrl: z.string().url(),
    prompt: z.string(),
    summary: z.string(),
    tags: z.array(z.string()).default(["prompt"]),
    sampleImages: z.array(z.string().url()).default([]),
    archivedImages: z.array(assetReference).default([]),
    coverImage: assetReference.optional(),
    storage: z
      .object({
        provider: z.enum(["local", "r2", "external"]),
        path: z.string(),
      })
      .optional(),
  }),
});

export const collections = { blog, prompts };

// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
const site = process.env.SITE_URL ?? 'https://your-project.pages.dev';

export default defineConfig({
  site,
  integrations: [mdx(), sitemap()],
  adapter: cloudflare(),
});
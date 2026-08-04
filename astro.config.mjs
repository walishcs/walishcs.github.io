import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';
import { defineConfig } from 'astro/config';

const skipKeystatic = process.env.SKIP_KEYSTATIC === 'true';

export default defineConfig({
  site: 'https://walishcs.github.io',
  output: 'static',
  devToolbar: { enabled: false },
  integrations: [
    react(),
    markdoc(),
    sitemap(),
    ...(skipKeystatic ? [] : [keystatic()]),
  ],
});

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at localhost:4321
npm run build     # Build for production (output to ./dist)
npm run preview   # Preview production build locally
npx astro check   # Type-check .astro files
```

There are no test commands configured.

## Architecture

This is **Karscale** — a bilingual (Spanish/English) astronomy/science blog built with Astro 6, deployed on Vercel.

### Routing & i18n

All pages live under `src/pages/[lang]/` and support `lang = "es" | "en"`. The root `src/pages/index.astro` redirects to the default language. Language switcher in the nav automatically swaps `/es/` ↔ `/en/` in the current URL path.

Blog post routes follow the pattern `/{lang}/blog/{category}/{subcategory}/{slug}` — this structure is derived from the file path in `src/content/blog/{lang}/{category}/{subcategory}/{slug}.mdx`.

### Content Collections

Defined in `src/content.config.ts`. The single `blog` collection uses a glob loader over `src/content/blog/**/*.{md,mdx}`. Required frontmatter fields: `title`, `lang`, `pubDate`, `description`, `buttonText`, `imageUrl`, `tags`, `translationId`.

The `translationId` field links Spanish/English pairs of the same article.

### Blog Taxonomy

`src/utils/blog.ts` parses the content ID (file path) into `{ category, subcategory, slug }`. The category drives visual styling in the blog post layout:
- `great-silence` → rounded card with gradient background + `blog-prose-silence` prose class
- `logbook-tech` → left border with electricCyan accent
- anything else → plain layout

### Rendering mode

The Astro config uses `output: 'server'` with the Vercel adapter, but most pages opt into static rendering with `export const prerender = true`. The API route (`src/pages/api/subscribe.ts`) stays server-rendered (`prerender = false`).

### Styling

Tailwind CSS v4 via `@tailwindcss/vite`. Theme tokens are defined in `src/styles/global.css` under `@theme`:
- `--color-primary`: `#8B5CF6` (purple)
- `--color-secondary`: `#06B6D4` (cyan)
- Fonts: `Space Grotesk` (heading), `Inter` (body)

Custom prose variants `.blog-prose` and `.blog-prose-silence`, plus `.signal-callout` and `.signal-grid`, are defined in `global.css` for use inside MDX content.

### React Components

Interactive visuals (`src/components/visuals/`) are React components used inside MDX files with `client:visible` directive. GSAP is used for animations (orbit animations on the homepage via `src/scripts/home-orbits.ts`).

### Subscription API

`src/pages/api/subscribe.ts` integrates with Buttondown. Requires the `BUTTONDOWN_API_KEY` environment variable on the server. Accepts both `application/json` and `multipart/form-data`.

### Adding a new blog post

Create `src/content/blog/{lang}/{category}/{subcategory}/{slug}.mdx` with the required frontmatter. To add a bilingual pair, create matching files in both `en/` and `es/` directories with the same `translationId` value.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `npm run dev`
- **Build:** `npm run build`
- **Lint:** `npx eslint .`
- No test framework configured.

## Architecture

Next.js 16 portfolio site using App Router, React 19, TypeScript, Tailwind CSS 4, and Motion for animations.

**Path alias:** `@/*` maps to `./src/*`

### Key directories

- `src/app/` — App Router pages and root layout
- `src/components/` — React components; `ui/` contains shadcn primitives (CVA variants, Radix-UI)
- `src/data/projects.ts` — Project entries array (the content source)
- `src/types/project.ts` — `Project` type definition
- `src/lib/utils.ts` — `cn()` class merging utility (clsx + tailwind-merge)

### Core component

`Bookshelf` (`src/components/bookshelf.tsx`) — the main interactive UI. Horizontal scrolling bookshelf that expands project spines on hover/click, revealing details and media. Uses Motion for animations and `MediaViewer` for image/video galleries.

### Styling

- Dark mode forced via `dark` class on `<html>`
- OKLCH color tokens defined as CSS variables in `globals.css` using Tailwind v4 `@theme` block
- Fonts: Sora (headings), Geist Sans/Mono (body)

### Patterns

- `"use client"` on all interactive components; pages are server components
- shadcn components use CVA for variants and Radix `asChild` for composition
- Simple data-driven flow: project data → props → components
- Local state via `useState` only; no global state management

### shadcn config

`components.json` — new-york style, Lucide icons, RSC enabled. Add components via `npx shadcn@latest add <component>`.

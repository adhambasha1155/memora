# Memora — Phase 6 Handoff

## Project Overview
Memora is a Next.js 14 platform for creating cinematic, shareable memory/occasion websites targeting the Egyptian market.

## Tech Stack
- **Framework**: Next.js 14 App Router + TypeScript
- **Auth + DB**: Supabase (project ID: `mnczgimctmifrqnqjbxe`)
- **Storage**: Cloudflare R2 (bucket: `memora-media`, public URL: `https://pub-8d17e259e3fe40ccb76fd5f2f36e63e4.r2.dev`)
- **Styling**: `<style jsx>` with CSS variables on main pages, Tailwind on birthday template
- **Fonts**: Cormorant Garamond + DM Sans (main), Playfair Display + Plus Jakarta Sans (birthday template)
- **Deployment**: Vercel (not yet deployed)

## CSS Variables (never change)
```
--main-rose: #c2185b
--dark-plum: #2c1a20
--warm-white: #fdf5f7
--rose-blush: #f9e4ec
--dusty-rose: #8a6470
--rose-dark: #7a1733
```

## Project Structure
```
memora/                          ← project root (C:\Users\adham\prog2\memora\memora)
├── app/
│   ├── (auth)/
│   │   ├── signup/page.tsx      ← combined signin/signup page (has Loading)
│   │   ├── forgot-password/page.tsx (has Loading + auth check)
│   │   └── reset-password/page.tsx
│   ├── auth/callback/route.ts   ← Google OAuth callback
│   ├── api/
│   │   ├── test-r2/route.ts     ← R2 test route (working ✓)
│   │   └── r2/presign/route.ts  ← presigned URL API for uploads
│   ├── create/[templateId]/page.tsx  ← create site form (Phase 5 done)
│   ├── edit/[siteId]/page.tsx        ← edit site form (Phase 5 done)
│   ├── dashboard/page.tsx            ← user dashboard (has Loading)
│   ├── lib/
│   │   ├── supabase.ts          ← Supabase client
│   │   └── r2.ts                ← R2 upload utilities
│   ├── pick/page.tsx            ← template picker with animated Playful preview
│   ├── templates/birthday/      ← birthday template (DEMO DATA — not wired yet)
│   │   ├── page.tsx             ← redirects to /templates/birthday/invitation
│   │   ├── invitation/page.tsx
│   │   ├── journey/page.tsx
│   │   ├── gift-box/page.tsx
│   │   ├── wishes/page.tsx
│   │   └── gallery/page.tsx     ← accessible from gift-box only (not in nav)
│   ├── s/                       ← PHASE 6: slug routing (NOT BUILT YET)
│   ├── globals.css
│   ├── layout.tsx               ← has viewport meta + all Google Fonts
│   ├── loading.tsx              ← branded loading component (Memora logo + progress bar)
│   └── page.tsx                 ← landing page
├── components/
│   └── ConnectedNav.tsx         ← 4-item bottom nav for birthday template
│                                   links to /templates/birthday/* (demo only)
├── public/
│   └── memora-logo.png
├── .env.local                   ← never committed
├── tailwind.config.ts           ← birthday template colors
├── tsconfig.json
└── package.json
```

## Supabase Schema

### profiles table
| column | type |
|--------|------|
| id | uuid (= auth.users.id) |
| email | text |
| username | text (unique, used in URLs) |
| display_name | text |
| avatar_url | text |

### sites table (CURRENT — missing some columns, need migration below)
| column | type |
|--------|------|
| id | uuid |
| user_id | uuid |
| template_id | integer (1=Cinematic, 2=Romantic, 3=Playful, 4=Elegant, 5=Minimal) |
| slug | text (unique per user) |
| occasion | text |
| recipient_name | text |
| sender_name | text |
| message | text |
| music_url | text |
| is_published | boolean |
| view_count | integer |
| created_at | timestamptz |
| updated_at | timestamptz |

### MIGRATION NEEDED — run in Supabase SQL editor first:
```sql
alter table public.sites
  add column if not exists invite_heading text,
  add column if not exists invite_subtitle text,
  add column if not exists invite_countdown_label text,
  add column if not exists invite_button_text text,
  add column if not exists gift_subtitle text,
  add column if not exists gift_message text,
  add column if not exists bg_color text default '#fadadd',
  add column if not exists text_color text default '#70585b',
  add column if not exists accent_color text default '#70585b',
  add column if not exists date text,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();
```

### media table (need to verify schema — run query below)
```sql
select column_name, data_type 
from information_schema.columns 
where table_name = 'media'
order by ordinal_position;
```
Expected columns: id, site_id, file_url, file_type ('journey_photo' | 'gallery_photo'), order_index, title, date, caption

### MIGRATION for media (if title/date/caption missing):
```sql
alter table public.media
  add column if not exists title text,
  add column if not exists date text,
  add column if not exists caption text;
```

## Phase 5 — What's Done (Create/Edit)

### Create page (`app/create/[templateId]/page.tsx`)
- 6 tabs: Info, Journey, Gallery, Message, Music, Design
- Info: recipient name, sender name, occasion, date, slug (manual), invitation page text (heading, subtitle, countdown label, button text)
- Journey: milestone cards with photo upload + title/date/caption per photo
- Gallery & Gift: gift box subtitle + reveal message, gallery photos with title/caption
- Message: personal letter textarea
- Music: optional URL
- Design: background color, text color, accent color with palette + custom picker + live preview
- R2 upload: browser → presign API → R2 directly
- Split screen desktop (form left, preview right with watermark protection)
- Mobile: full-screen tabs + sticky save bar + bottom sheet preview
- Auth guard: redirects to /signup if not logged in
- Loading: branded Loading component

### Edit page (`app/edit/[siteId]/page.tsx`)
- Same UI as create but loads existing site data on mount
- Fetches site by siteId + user_id (security check)
- Pre-fills all form fields from Supabase
- Loads existing media from media table
- Uses update not upsert
- Slug is read-only
- Redirects to /dashboard if site not found or not owner

### Presign API (`app/api/r2/presign/route.ts`)
- POST with { key, contentType }
- Validates user owns the key (key must start with users/{userId}/)
- Returns { presignedUrl, publicUrl }

## Phase 6 — What Needs to Be Built

### Goal
Wire the birthday template pages to real Supabase data so users can view their created sites at a public URL.

### URL Structure
```
localhost:3000/s/birthday-aria  ← view site by slug
```
Route: `app/s/[slug]/page.tsx`

### What the route should do:
1. Fetch site by slug from Supabase
2. Check template_id → route to correct template renderer
3. For template_id === 3 (Playful/Birthday): render the full birthday experience
4. Increment view_count

### Birthday template pages to wire (currently all use hardcoded demo data):

**invitation/page.tsx** — replace:
- "Aria's Magic Day" → recipient_name
- "Happy Birthday Aria!" → invite_heading or `Happy ${occasion} ${recipient_name}!`
- Subtitle text → invite_subtitle
- "The Magic Begins In..." → invite_countdown_label
- "Enter the Magic" button → invite_button_text
- Countdown target date → date field
- Background → bg_color
- Text → text_color
- Accent → accent_color

**journey/page.tsx** — replace:
- Hardcoded milestones → media table rows where file_type = 'journey_photo'
- Each has: imgSrc (file_url), title, date, caption

**gift-box/page.tsx** — replace:
- "Tap the magical box to reveal your birthday surprise!" → gift_subtitle
- After opening → show gallery photos (media where file_type = 'gallery_photo')
- Each gallery photo has: imgSrc, title, caption

**wishes/page.tsx** — replace:
- "Dearest Aria," → recipient_name
- Letter text → message field
- Make a wish form → save to a new `wishes` table (optional)

### ConnectedNav update
Currently links to `/templates/birthday/*` (demo).
For real sites, should link to `/s/${slug}/journey`, `/s/${slug}/gift-box` etc.
OR keep birthday template at `/templates/birthday/` for demo and create a separate set of pages under `/s/[slug]/` that render the real data.

### Recommended approach — Two separate rendering paths:
```
/templates/birthday/*     ← demo/preview (keep as is)
/s/[slug]/                ← real user sites with data from Supabase
  ├── page.tsx            ← redirects to /s/[slug]/invitation
  ├── invitation/page.tsx ← real data
  ├── journey/page.tsx    ← real data
  ├── gift-box/page.tsx   ← real data
  └── wishes/page.tsx     ← real data
```

### Shared data fetcher to create:
```typescript
// app/lib/getSiteBySlug.ts
export async function getSiteBySlug(slug: string) {
  // fetch site + media from Supabase
  // return { site, journeyPhotos, galleryPhotos }
}
```

### Publishing flow (also Phase 6):
- Dashboard "Publish" button → sets is_published = true
- Only published sites are viewable at /s/[slug]
- Unpublished → show "This site is not published yet" message

## Key Rules (NEVER break these)
1. Never use `.single()` — always use `.maybeSingle()`
2. Always add `'use client'` to pages with hooks
3. Never use `Math.random()` in JSX
4. Never change colors, layout or CSS unless explicitly asked
5. `<style jsx>` doesn't work on mobile in dev mode — works fine on Vercel production
6. `@/*` maps to project root (not app/) in tsconfig paths
7. ConnectedNav is at `components/ConnectedNav.tsx` (root level)
8. Loading component at `app/loading.tsx` — use `import Loading from '@/app/loading'`

## Environment Variables (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
CLOUDFLARE_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=memora-media
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-8d17e259e3fe40ccb76fd5f2f36e63e4.r2.dev
```

## Pending After Phase 6
- Phase 7: Remaining templates (Cinematic, Romantic, Elegant, Minimal)
- Phase 8: Paymob payments (one-time payment per site in EGP)
- Phase 9: Deploy to Vercel
- Phase 10: Custom subdomain routing (username.memora.com/slug)

## Updates Since Last Handoff

### Create page — Publish & Share button fix
The `PreviewCards` component has a "Publish & Share →" button that was a placeholder.
Fix applied: add `useRouter` inside `PreviewCards` and set `onClick`:
- **For now** (before Phase 6): `onClick={() => router.push('/dashboard')}`
- **After Phase 6**: change to `onClick={() => router.push(\`/s/${form.slug}\`)}`

```tsx
function PreviewCards({ form, journeyPhotos, galleryPhotos }) {
  const router = useRouter()  // add this
  // ...
  <button onClick={() => router.push('/dashboard')}>
    Publish & Share →
  </button>
}
```

### TODO after Phase 6 is built
- Update "Publish & Share" button in `PreviewCards` to go to `/s/${form.slug}`
- Update dashboard "Copy link" to use real public URL (`/s/${site.slug}`)
- Add "Publish" toggle button in dashboard or edit page (sets is_published = true)

### media table — confirmed columns after migration
id, site_id, file_url, file_type, order_index, created_at, title, date, caption

### sites table — confirmed columns after migration
All original columns + invite_heading, invite_subtitle, invite_countdown_label,
invite_button_text, gift_subtitle, gift_message, bg_color, text_color, accent_color,
date, created_at, updated_at

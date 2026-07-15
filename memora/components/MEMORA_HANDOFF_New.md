# Memora — Project Handoff

Paste this at the start of a new chat to bring the assistant up to speed.

---

## 1. What Memora is

A Next.js 14 (App Router) + TypeScript platform for building **cinematic, shareable memory/occasion websites**. Target market: Egypt. Built by Adham Basha (Computer & Communications Engineering, Alexandria University).

A user picks a template, fills in text + photos + music, publishes, and shares a link like `memora.com/s/their-slug`. Anonymous visitors can open it with no account.

---

## 2. Stack & services

| Thing | Detail |
|---|---|
| Framework | Next.js 14, App Router, TypeScript |
| Styling | `<style jsx>` blocks + Tailwind utility classes on public pages |
| Database / Auth | Supabase — project ref `mnczgimctmifrqnqjbxe` |
| File storage | Cloudflare R2 — bucket `memora-media` |
| Deployment | Not yet deployed. Currently localhost + a VS Code devtunnel. |
| Payments | Not built yet (planned: Paymob, EGP) |

**Path alias:** `@/*` maps to the project root.

### Environment variables (`.env.local`)

Names only — values live in the local file.

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL          <-- still a devtunnel URL; must become the real domain at deploy
CLOUDFLARE_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME=memora-media
NEXT_PUBLIC_R2_PUBLIC_URL     <-- no trailing slash; client code slices this prefix off to get R2 keys
```

Not yet added (needed only when the expiry/cron system is switched on):
```
SUPABASE_SERVICE_ROLE_KEY     <-- server-only, NEVER prefix with NEXT_PUBLIC_
CRON_SECRET
```

**Security note:** the R2 secret access key was pasted into a chat during development. Worth rotating in the Cloudflare dashboard as good hygiene.

---

## 3. Design system — do not drift from this

**Rule: never change colors or layout unless explicitly asked.**

### Fonts
- **Dashboard / create / edit / landing:** Cormorant Garamond (headings) + DM Sans (body)
- **Public site pages (`/s/[slug]/*`):** Playfair Display (headings) + Plus Jakarta Sans (body)

### CSS variables (app chrome)
```
--main-rose:  #c2185b
--rose-dark:  #7a1733
--rose-blush: #f9e4ec
--warm-white: #fdf5f7
--dark-plum:  #2c1a20
--dusty-rose: #8a6470
```

### Public page theming
Every `/s/[slug]/*` page reads three per-site colors from the DB with these fallbacks:
```ts
const bg     = s.bg_color     || '#fadadd'
const text   = s.text_color   || '#70585b'
const accent = s.accent_color || '#70585b'
```
Visual language: ambient blurred colour blobs, frosted-glass panels, a pill-shaped floating top bar, photos with a slight tilt that straightens on hover.

---

## 4. Code conventions (learned the hard way)

- **Always `.maybeSingle()`**, never `.single()`.
- **Supabase clients — pick the right one:**
  - `createBrowserClient` (`app/lib/supabase.ts`) → client components only
  - `createServerSupabaseClient` (`app/lib/supabase-server.ts`) → API routes / server components. Reads the session from cookies. **Using the browser client in an API route returns 401 because it can't see auth cookies.**
  - `createAdminClient` (`app/lib/supabase-admin.ts`) → cron jobs only. Service-role key, bypasses RLS.
- **API routes must be `app/api/<name>/route.ts`** — the folder is the URL segment, the file must literally be `route.ts`. A file named `presign.ts` or a folder typo'd `predesign` gives a silent **404**.
- `'use client'` on any page using hooks.
- Never `Math.random()` directly in JSX.
- Restart the dev server after touching `NEXT_PUBLIC_*` vars — they're baked in at start time.

---

## 5. Data model

### `sites`
Core: `id`, `user_id`, `slug`, `template_id`, `is_published`, `view_count`, `purchased`, `created_at`, `updated_at`

Content: `occasion`, `recipient_name`, `sender_name`, `message`, `date`, `music_url`

Invitation text: `invite_heading`, `invite_subtitle`, `invite_countdown_label`, `invite_button_text`

Gift box: `gift_subtitle`, `gift_message`

Design: `bg_color`, `text_color`, `accent_color`

Group template (applied): `crew_heading`, `crew_subtitle`, `gallery_heading`, `gallery_subtitle`

### `media`
`id`, `site_id`, `file_url`, `file_type`, `order_index`, `title`, `date`, `caption`

`file_type` values in use: `journey_photo`, `gallery_photo`, and (planned) `member_photo`.

### `wishes`
`id`, `site_id`, `name`, `message`, `created_at` — visitor-submitted messages. RLS allows anyone to insert/select on published sites.

### `profiles`
Account info. Has some duplicate RLS policies — messy but harmless.

### RLS summary
- `sites`: public SELECT where `is_published = true`, or owner. INSERT/UPDATE/DELETE owner-only.
- `media`: public SELECT. INSERT/DELETE gated on owning the parent site.
- `wishes`: anyone can insert/select on published sites.

### RPC
`increment_view_count(site_id_arg uuid)` — `security definer`, only increments if `is_published = true`.

---

## 6. Storage split

| Where | What |
|---|---|
| **Cloudflare R2** | The actual image files, nothing else |
| **Supabase** | All text, plus the R2 public URL stored in `media.file_url` |

R2 key pattern:
```
users/{userId}/sites/{siteSlug}/{timestamp}-{random}.webp
```

**Upload flow:** browser compresses the image (`browser-image-compression`, max 0.5 MB / 1920px, converted to WebP) → `POST /api/r2/presign` returns a presigned PUT URL → browser PUTs the file straight to R2 → the returned public URL is stored in `media.file_url`.

**R2 bucket CORS** must allow `["GET", "PUT", "HEAD"]` with `AllowedHeaders: ["*"]`. GET-only causes the upload PUT to be blocked.

**Deletion is wired up:** removing a photo in create/edit, and deleting a whole site from the dashboard, both call `POST /api/r2/delete` so files don't orphan in the bucket.

Videos are **not** supported — the file inputs are `accept="image/*"`.

---

## 7. Route map

### App (authenticated)
```
/                       landing
/dashboard              site list, publish toggle, copy link, delete
/pick                   template picker
/create/[templateId]    create flow
/edit/[siteId]          edit flow
```

Create/edit tabs: **Info · Journey · Gallery · Message · Music · Design**

Photo limits (enforced on both pages):
```ts
const MAX_JOURNEY_PHOTOS = 5
const MAX_GALLERY_PHOTOS = 10
```
Live counter (`3 / 5`), warning banner, and a disabled "Limit reached (N max)" button when full.

### Public site — birthday template (`template_id = 3`)
```
/s/[slug]                   root: checks is_published, calls increment_view_count, redirects to the entry page
/s/[slug]/layout.tsx        SHARED — owns ConnectedNav + the <audio> element
/s/[slug]/invitation        countdown, heading, CTA
/s/[slug]/journey           milestone timeline (journey_photo)
/s/[slug]/gift-box          tap-to-open box, then gallery carousel (gallery_photo)
/s/[slug]/wishes            the letter + visitor wish form + wish list
/s/[slug]/not-published
```

Nav bar: `Home · Story · 🎵 · Gift · Wish`

### Global
`components/Sidebar.tsx` — slide-out drawer, hamburger at `top: 18px; right: 18px`, no circle, 3 bare rose lines. Mounted in `app/layout.tsx`, so it appears on **every** page including public site pages. That's intentional: a logged-in owner viewing their own site sees their sidebar. Not a security leak.

---

## 8. The shared layout (important — read before touching)

`app/s/[slug]/layout.tsx` exists so that **`ConnectedNav` and its `<audio>` element stay mounted across tab navigation.** Next.js swaps only `{children}` between nested routes, so music keeps playing and doesn't restart when the visitor moves between Invitation → Journey → Gift → Wishes.

**The layout must NOT do its own `is_published` redirect check.**

An earlier version did, and it caused a bug where a freshly published site still redirected to `/not-published`. The `useEffect` only depended on `[slug]`, so `pathname` was stale-closured to the first mount and never re-evaluated on navigation. Redirect logic lives in `app/s/[slug]/page.tsx` and in each individual tab page, where it is already correct. **Do not re-add it to the layout.**

### Known tradeoff (accepted, not a bug)

The layout fetches the site row, and each page *also* fetches it independently. Consequences:

1. **2 Supabase reads per page load** instead of 1. Fine at current scale.
2. **Minor loading flicker** — the nav and the page content resolve at slightly different times.
3. **Publish/access logic is duplicated across 5 files** (layout + 4 pages). Any *new* rule (e.g. the expiry check) would need adding in several places. This is the cost that actually matters long-term.

**R2 / photo loading is NOT affected.** The layout renders no images. Photo requests are driven purely by `<img src={file_url}>` tags in each page and happen exactly once per page view, unchanged. The duplication costs one extra lightweight text-row query, nothing image-related.

The proper fix, if it ever matters: lift all site fetching into the layout and share it down via React Context. Deliberately deferred.

---

## 9. Music (done, with hard platform limits)

`app/lib/music.ts` exports `getMusicType()`, `buildSpotifyEmbedUrl()`, `buildSoundCloudEmbedUrl()`.

`ConnectedNav` owns the audio. When `musicUrl` is passed, the nav grid goes from 4 to 5 columns and a `music_note` Material Symbols icon (not an emoji — an emoji can't inherit the nav's colour) sits **in the middle**.

| Type | Behaviour |
|---|---|
| **Direct MP3/WAV** | True hidden background playback. Starts muted-autoplay (always permitted), the icon toggles real mute/unmute. This is the only one that works the way we actually want. |
| **Spotify** | Tapping the icon reveals a small 300×80 widget. **Two hard limits, neither fixable in code:** (1) cross-origin iframes require the play tap to land *inside* their own player, so no autoplay; (2) the embed plays only a **~30 second preview** unless the visitor is logged into Spotify Premium in that browser. |
| **SoundCloud** | Same reveal pattern, but plays **full tracks** for anonymous listeners. More reliable than Spotify. |

**Recommendation for the ideal experience:** host an owned/licensed MP3 through the existing R2 pipeline. Converting Spotify/SoundCloud streams to MP3 is DRM circumvention and won't be assisted with.

---

## 10. In progress — Team / Group template

Started, not finished.

### Decisions locked in
- **Creator uploads everyone.** No self-contribution flow.
- **Occasion: general/flexible** (works for a class, a team, a farewell).
- **Group photo gallery replaces the gift box.** The timeline is dropped; gallery captions absorb it. This keeps the nav at 4 tabs + music, matching the existing 5-column grid with zero layout change.

### Shape
```
template_id = 6   ("Team")
Tabs: Home · Crew · 🎵 · Gallery · Wall
Routes: /s/[slug]/cover, /crew, /gallery, /wall
```

**Crew is the centerpiece.** Birthday's emotional beat is a *timeline* (one person, over time). A group's beat is a *grid* (many people, at once). That inversion is the whole template.

### Data model — nothing new needed
A crew member is just a `media` row:

| column | holds |
|---|---|
| `file_type` | `'member_photo'` |
| `title` | member's name |
| `caption` | role / one-liner |
| `order_index` | display order |

`recipient_name` becomes the **group name** ("Class of 2028"). No new table, no new member column.

### Migration — APPLIED ✅
```sql
alter table sites
  add column if not exists crew_heading text,
  add column if not exists crew_subtitle text,
  add column if not exists gallery_heading text,
  add column if not exists gallery_subtitle text;
```
All four columns verified present on `sites`.

**`media.file_type` — verified ✅** It is `text`, `NOT NULL`, no default, and the `media` table has **no CHECK constraints at all**. `'member_photo'` inserts cleanly. Nothing to work around.

### Files already delivered
| File | State |
|---|---|
| `app/s/[slug]/crew/page.tsx` | **New.** Staggered grid reveal (55ms apart, capped at 14), alternating tilt straightening on hover, 2-line caption clamp with a More toggle (no modal — works on touch), `prefers-reduced-motion` respected. |
| `components/ConnectedNav.tsx` | Rewritten to be **variant-aware** via a `NAV_CONFIGS` map (`birthday` \| `group`). Also exports `NAV_KEYS`. |
| `app/s/[slug]/layout.tsx` | Picks `variant` from `template_id === 6`, passes it to ConnectedNav. Needed because the old hardcoded `NAV_KEYS` list meant a group site rendered **no nav bar and no music at all**. |
| `app/s/[slug]/page.tsx` | `ENTRY_BY_TEMPLATE` map routes template 6 → `/cover`, everything else → `/invitation`. |

### Still to build
1. `app/s/[slug]/cover/page.tsx` — invitation, adapted for a group name
2. `app/s/[slug]/gallery/page.tsx` — gift-box's opened carousel, without the box
3. `app/s/[slug]/wall/page.tsx` — wishes, with a masonry feel
4. **Create/edit tab set for template 6** — the real lift. Needs a Crew tab (member name + role fields instead of milestone title/date), `MAX_CREW_MEMBERS ≈ 30`, and the upload loop should be **parallelized** — 30 photos uploading sequentially will feel broken.
5. Add to `SiteData` in `app/lib/getSiteBySlug.ts`:
   ```ts
   crew_heading: string | null
   crew_subtitle: string | null
   gallery_heading: string | null
   gallery_subtitle: string | null
   ```
6. `TEMPLATE_NAMES` on create + edit pages: add `6: 'Team'`
7. Add template 6 to `app/pick/page.tsx`

---

## 11. Deferred — expiry / payment system

Designed and built, but **the user has NOT added these files to the project.** Nothing runs until a cron trigger is configured, so leaving it idle is harmless.

**Already applied to the DB:** `sites.purchased boolean not null default false`

Files generated but not installed:
- `app/lib/supabase-admin.ts` — service-role client (bypasses RLS; required because cron runs with no user session)
- `app/api/cleanup-expired/route.ts` — POST, protected by `Authorization: Bearer ${CRON_SECRET}`. Finds sites where `purchased = false` and `created_at` older than 2 days, then deletes R2 files → `media` rows → `wishes` rows → `sites` row.
- Dashboard shows an amber "Expires in X days unless purchased" banner. **Informational only.**

**Security decision:** a self-serve "Mark as purchased" button was built and then **removed**, because any user could click it and skip payment. `purchased` must only ever be set by a payment webhook (server-to-server) or manually in Supabase. Do not re-add a user-clickable version.

Also pending: `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`, and a `vercel.json` cron config.

---

## 12. Deferred — SEO / Open Graph

Built, then **reverted.**

`generateMetadata` can't be exported from a `'use client'` file, so the layout was split into a Server Component (metadata) + a client component (nav/music). During that work a publish-redirect bug surfaced. The OG code was almost certainly **not** the cause — the real culprit was the duplicate redirect check in the layout (see §8) — but the user chose to revert OG anyway and fix the redirect separately.

**If OG is resumed:** the split approach was correct. It also needs a fallback `public/og-default.png` (1200×630) and `NEXT_PUBLIC_SITE_URL` pointed at the real production domain.

**Delete if still present:** `components/SiteMusicNav.tsx`, `app/lib/supabase-public.ts` — both existed only for OG.

---

## 13. Share-link lifecycle

1. Owner copies the link from the dashboard: `${window.location.origin}/s/${slug}`
2. The messaging app (WhatsApp/iMessage) fetches the URL server-side to build a preview card. *This is what OG tags would populate — currently reverted, so links share bare.*
3. Recipient taps → `app/s/[slug]/page.tsx` checks `is_published`, calls `increment_view_count`, redirects to the template's entry page.
4. The layout mounts and persists (nav + audio). Each page fetches its own data and loads photos directly from R2.
5. Works for **anonymous visitors** — the `sites` RLS SELECT policy allows public reads where `is_published = true`.

---

## 14. Gotchas / past incidents worth not repeating

- **A page file once contained another page's code.** `wishes/page.tsx` was accidentally holding Journey's code, so `/wishes` rendered the Journey timeline. If a route renders the wrong content, check the file's default export name first.
- **`predesign` vs `presign`** — a folder typo caused a 404 that looked like a code bug.
- **Browser Supabase client in an API route** → always 401. Use the server client.
- **R2 CORS set to GET-only** → uploads blocked with an opaque CORS error.
- **Create page's `handleSave` was silently dropping fields** — it saved only 8 of ~18 columns, so invitation text and design colours never persisted. Fixed; both create and edit now write the full set.
- **The `occasion` field** appears in: dashboard card title, journey top bar (`{recipient_name}'s {occasion}`), and as the invitation heading *fallback* when `invite_heading` is empty.

---

## 15. Suggested next steps

1. Finish the group template's `cover` / `gallery` / `wall` pages. (The DB migration is already applied.)
2. Build the create/edit tab set for template 6 — with parallelized uploads.
3. Mobile polish pass across the whole `/s/[slug]/*` flow on a real phone.
4. Deploy to Vercel + custom domain, and swap `NEXT_PUBLIC_SITE_URL` off the devtunnel.
5. Payment gateway (Paymob) → then wire up the expiry/cleanup system.
6. Revisit Open Graph once deployed.

# Memora — Full Project Handoff

## What is Memora?
A platform where users create personalized, cinematic, interactive memory/occasion websites and share them via a unique link. Think a beautiful scrapbook that feels like a mini movie experience. No coding required for the end user.

---

## Tech Stack
```
Frontend + Backend  → Next.js 14 (App Router) + TypeScript
Styling             → Tailwind CSS
Database            → Supabase (PostgreSQL) — stores text data
File Storage        → Cloudflare R2 — stores photos, videos, music
Authentication      → Supabase Auth
Deployment          → Vercel
Payment Gateway     → Paymob (EGP payments, Egyptian market)
```

---

## Business Model
```
One time payment per site (no subscription)
├── Standard template  → X EGP per site
└── Custom design      → X + Y EGP (user contacts owner directly,
                         owner designs it manually as a service)

No site limit per user (they pay per site anyway)
50MB storage per site
Photos auto-compressed before upload (max 1920px, 80% quality)
Sites live forever after payment
```

---

## Architecture
```
Text data (names, messages, slugs, settings) → Supabase PostgreSQL
Media files (photos, videos, music)          → Cloudflare R2
Auth (login, signup, sessions)               → Supabase Auth
```

### URL Structure
```
Main platform:
memora.com                        → Landing page
memora.com/signup                 → Signup
memora.com/login                  → Login
memora.com/dashboard              → User dashboard (protected)
memora.com/pick                   → Template picker (protected)
memora.com/create/[templateId]    → Create form (protected)
memora.com/edit/[siteId]          → Edit form (protected)

User generated sites:
adham.memora.com                  → Adham's public profile
adham.memora.com/birthday-sina    → Published memory site
adham.memora.com/graduation-2025  → Another site by Adham
```

### Subdomain System
```
On signup → user picks a username (e.g. adham)
→ becomes their permanent subdomain: adham.memora.com
→ username is unique, lowercase, no spaces
→ checked in real time during signup
→ cannot be changed after (like GitHub)
→ all their sites live under this subdomain
```

---

## Database Tables (Supabase)

### users
```
├── id
├── email
├── username          → becomes their subdomain
└── created_at
```

### sites
```
├── id
├── user_id           → links to users table
├── template_id       → which of the 5 templates
├── slug              → e.g. "birthday-sina"
├── occasion          → e.g. "Birthday"
├── recipient_name    → e.g. "Sina"
├── sender_name       → e.g. "Adham"
├── message           → the personal text
├── music_url         → YouTube link or R2 file URL
├── is_published      → true/false
├── view_count        → increments on every visit
├── created_at
└── updated_at
```

### media
```
├── id
├── site_id           → links to sites table
├── file_url          → R2 public URL
├── file_type         → "photo" or "video"
├── order_index       → for drag to reorder
└── created_at
```

---

## Cloudflare R2 Storage Structure
```
r2-bucket/
├── adham/
│   ├── birthday-sina/
│   │   ├── photo1.jpg
│   │   ├── photo2.jpg
│   │   └── video1.mp4
│   └── graduation-2025/
│       └── photo1.jpg
└── john/
    └── anniversary/
        └── photo1.jpg
```

### Storage Logic
```
Free R2 tier      → 10GB/month
Storage per site  → 50MB max
Compression       → auto compress photos > 2MB
                    max 1920px width, 80% quality
                    before uploading to R2
```

---

## Templates
```
5 fixed cinematic templates (no user customization):
1. Cinematic   → dark, dramatic, emotional
2. Romantic    → soft, warm, elegant
3. Playful     → bright, fun, energetic
4. Elegant     → minimal, clean, sophisticated
5. Minimal     → ultra clean, text focused

Each template has:
├── A card on the picker page
│   (frozen snapshot of the hero section)
├── A full cinematic demo (preview mode)
├── A create/edit form (split screen)
└── The generated output site
```

---

## Form (Create / Edit) — Split Screen
```
Left side  → form inputs
Right side → simplified live preview
             (not full animations, just a styled snapshot
              showing name, message, photo thumbnails,
              template mood/colors)

The form is the same page for create and edit
Edit page  → all fields preloaded with existing data
```

### Form Fields
```
Step 1 — Basics
├── Recipient's name
├── Your name (sender)
└── Occasion (dropdown + custom option)

Step 2 — Message
└── Large textarea with emoji picker + character counter

Step 3 — Media
└── Drag & drop upload (photos + videos)
    reorderable, thumbnail previews, progress bar

Step 4 — Music
└── Toggle: YouTube link OR upload file

Step 5 — Site link
└── adham.memora.com/[slug]
    real time availability check
```

---

## Auto Save System
```
User edits anything → auto saved to Supabase every few seconds
No save button needed (like Notion)
Published link always serves latest version
No need to republish after edits
```

---

## Dashboard (memora.com/dashboard)
```
┌─────────────────────────────────────────┐
│  Hi Adham 👋                            │
├─────────────────────────────────────────┤
│  Your sites                             │
│                                         │
│  [Birthday Sina]    [Anniversary Mom]   │
│   ↗ adham.memora.com/birthday-sina      │
│   👁 243 views   ✏ Edit   🗑 Delete     │
│                                         │
├─────────────────────────────────────────┤
│          + Create new Memora            │
└─────────────────────────────────────────┘

Features:
✓ View count per site
✓ Copy link button
✓ Edit → reopens form with data preloaded
✓ Delete → confirmation modal (cannot be undone)
✓ + Create new Memora → goes to template picker
```

---

## Published Site (adham.memora.com/birthday-sina)
```
✓ Cinematic intro animation on first load
✓ Background music (with mute button)
✓ Smooth scroll between sections
✓ Photos & videos with entrance animations
✓ Fully mobile optimized
✓ Subtle "Made with Memora" badge in corner
  → clicking it goes to memora.com
✓ Viewable by anyone (no login needed)
✓ Editable only by the owner (logged in)
✓ View count increments on every visit
```

---

## Public Profile (adham.memora.com)
```
✓ Lists all of adham's published sites
✓ Profile picture + username
✓ Each site shown as a card with preview thumbnail
✓ Viewable by anyone
```

---

## Auth Flow
```
Signup:
├── Google OAuth (one click)
├── OR Email + Username + Password
├── Username real time availability check
│   shows: "✓ adham.memora.com is yours"
└── On success → redirect to dashboard

Login:
├── Google OAuth
├── Email + Password
├── Forgot password link
└── On success → redirect to dashboard

Protected routes (login required):
├── /dashboard
├── /pick
├── /create/[templateId]
└── /edit/[siteId]

Public routes (no login needed):
├── memora.com (landing)
├── memora.com/login
├── memora.com/signup
├── adham.memora.com (profile)
└── adham.memora.com/[slug] (published site)
```

---

## Landing Page (memora.com)
```
1. Cinematic hero
   → animated background (particles, soft gradient)
   → tagline: "Turn your memories into an experience"
   → CTA: "Create yours free" + "See examples"

2. How it works (3 steps, animated on scroll)
   → Pick a template
   → Add your memories
   → Share the link

3. Template showcase
   → 5 template cards
   → frozen hero snapshot per card
   → hover → card lifts with glow
   → "Preview" → full cinematic demo overlay
   → "Use this" → signup if guest / form if logged in

4. Social proof
   → "Made with Memora" — 3 example sites

5. Footer
```

---

## Build Order (Phases)
```
Phase 1  → Project setup + Authentication
            Next.js + Supabase + signup/login/logout
            Username → subdomain system
            Protected routes

Phase 2  → Landing page
            Hero, how it works, template cards, footer

Phase 3  → Template picker + demo previews
            5 template cards
            Full screen preview overlay

Phase 4  → Database + storage setup
            Supabase tables
            Cloudflare R2 bucket

Phase 5  → Create/edit form (split screen)
            All fields, auto save, slug check

Phase 6  → Publishing system
            Subdomain routing
            Public profile page
            Published site rendering

Phase 7  → Dashboard
            Site cards, view counts, edit, delete

Phase 8  → The 5 cinematic templates
            Animations, music, scroll effects

Phase 9  → Payment integration
            Paymob for EGP payments

Phase 10 → Polish + deploy to Vercel
```

---

## Current Setup
```
✓ Next.js 14 + TypeScript + Tailwind CSS installed
✓ Running at http://localhost:3000
✓ Node.js v24.15.0
✓ npm v11.12.1
✓ VS Code with project open
✓ Supabase account created (free plan)

Next step → Phase 1: Connect Supabase + build auth
```

---

## How to Start New Chat
Paste this entire file and say:

> "Here is the full Memora project plan. I have Node.js, Next.js, TypeScript and Tailwind already set up and running. Let's start Phase 1 — connecting Supabase and building authentication."

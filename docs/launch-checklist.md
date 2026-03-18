# Aible — Launch Checklist

**Date:** 2026-03-18
**Target:** Vercel deployment
**App version:** Prototype v1 (localStorage, simulated auth/payments)

---

## Pre-Launch Verification

### Build

| Check | Status | Notes |
|-------|--------|-------|
| `npm run build` succeeds | PASS | 153ms build, no warnings or errors |
| Output size reasonable | PASS | JS: 497KB (154KB gzip), CSS: 26KB (6KB gzip) |
| No TypeScript / lint errors blocking build | PASS | Clean build |

### QA Bugs

| Bug | Priority | Status |
|-----|----------|--------|
| BUG-01: Streak UTC dates | P1 | FIXED |
| BUG-02: XP farming via replay | P1 | FIXED |
| BUG-03: Streak freeze not consumed | P1 | FIXED |
| BUG-04: Free tier URL bypass | P1 | FIXED |
| BUG-05: Badge detail modal | P2 | Open — not blocking |
| BUG-06: "You learned" missing | P2 | Open — not blocking |
| BUG-07: Onboarding subheader | P2 | Open — not blocking |
| BUG-08: Module progress count | P2 | Open — not blocking |

**Blocking bugs remaining: 0**

### Deployment Configuration

| Check | Status | Notes |
|-------|--------|-------|
| vercel.json SPA rewrite rule | PASS | All routes rewrite to index.html |
| Environment variables needed | N/A | Prototype uses localStorage only — no env vars |
| Build command | PASS | `npm run build` (Vite auto-detected by Vercel) |
| Output directory | PASS | `dist` (Vite default, auto-detected by Vercel) |
| Root directory | NOTE | Must be set to `app` in Vercel project settings |
| Node version | PASS | Standard Node, no special version required |

### Content & Polish

| Check | Status | Notes |
|-------|--------|-------|
| Page title | PASS | "Aible — Be AI-able." |
| Favicon | PASS | Inline SVG emoji ✨ |
| Theme color (mobile browser) | PASS | #7C3AED (purple) |
| Mobile viewport meta | PASS | width=device-width, no user-scale, viewport-fit=cover |
| Apple web app capable | PASS | PWA-ready meta tags |
| No console.log / debug output | PASS | No debug artifacts in UI |
| No placeholder/lorem text | PASS | All content is realistic |
| No exposed API keys or secrets | PASS | No env vars, no API keys in source |

---

## Deployment Steps

### Option A: Vercel CLI (fastest)

```bash
cd /Users/shaun/AI/aible/app
npx vercel --prod
```

When prompted:
- **Set up and deploy?** Yes
- **Which scope?** (select your Vercel account)
- **Link to existing project?** No (create new)
- **Project name:** aible
- **In which directory is your code located?** `.` (you're already in /app)
- **Want to modify these settings?** No (Vite auto-detected)

### Option B: Vercel Dashboard + Git

1. Push code to a GitHub/GitLab repo
2. Go to vercel.com → New Project → Import repo
3. Set **Root Directory** to `app`
4. Framework preset: Vite (auto-detected)
5. Deploy

### Post-Deploy Verification

1. Verify the live URL loads the Welcome screen
2. Test onboarding → first lesson → signup flow on a mobile device
3. Verify page refresh on `/home` doesn't 404 (SPA rewrite working)
4. Optional: add a custom domain in Vercel dashboard

---

## Go/No-Go

### GO — Ready to deploy

- All P1 bugs fixed
- Build is clean (0 errors, 0 warnings)
- SPA rewrite configured
- No environment variables needed
- No secrets in source
- 93% QA pass rate with remaining items all P2 cosmetic

### Known Limitations (acceptable for prototype)

- Auth is simulated (localStorage, no Supabase)
- Payments are simulated (no Stripe)
- Mascot uses emoji placeholders
- No sound effects
- No push notifications
- Desktop layout not optimized (mobile-first)

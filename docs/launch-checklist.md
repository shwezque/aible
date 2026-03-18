# Aible — Launch Checklist (v2 Chat-Based)

**Date:** 2026-03-18
**Target:** Vercel deployment
**App version:** Prototype v2 — chat-based AI tutors (localStorage, simulated auth/payments)

---

## Pre-Launch Verification

### Build

| Check | Status | Notes |
|-------|--------|-------|
| `npm run build` succeeds | PASS | Clean build, 664ms |
| Output size reasonable | PASS | JS: 434KB (136KB gzip), CSS: 38KB (7KB gzip) |
| No errors blocking build | PASS | Only unused-variable hints, no errors |

### QA Bugs — All 12 Fixed

| Bug | Priority | Status |
|-----|----------|--------|
| BUG-01: Tutor avatar missing from AI bubbles | P1 | FIXED |
| BUG-02: `completeSession` never called | P1 | FIXED |
| BUG-03: Session Summary Card missing | P1 | FIXED |
| BUG-04: No confetti on celebration | P1 | FIXED |
| BUG-05: New concept XP not awarded | P1 | FIXED |
| BUG-06: Streak text not pluralized | P2 | FIXED |
| BUG-07: Raw tags visible during streaming | P2 | FIXED |
| BUG-08: Topic switch from celebration jarring | P2 | FIXED |
| BUG-09: Chat message slide-in animation missing | P3 | FIXED |
| BUG-10: Streak flame doesn't pulse | P3 | FIXED |
| BUG-11: Badge detail bottom sheet missing | P3 | FIXED |
| BUG-12: S-04 Quick Preferences not implemented | P3 | FIXED |

**Blocking bugs remaining: 0**

### Deployment Configuration

| Check | Status | Notes |
|-------|--------|-------|
| vercel.json SPA rewrite rule | PASS | `/(.*) → /index.html` |
| Build command | PASS | `npm run build` (Vite auto-detected) |
| Output directory | PASS | `dist` (Vite default) |
| Root directory | NOTE | Must be set to `app` in Vercel project settings |
| Node version | PASS | Standard Node 20, no special version required |
| `ANTHROPIC_API_KEY` env var | REQUIRED | Must be set in Vercel project settings for chat to work |
| API route: `api/chat.js` | PASS | Vercel Edge Function, auto-detected from `/api` directory |

### Content & Polish

| Check | Status | Notes |
|-------|--------|-------|
| Page title | PASS | "Aible — Be AI-able." |
| Favicon | PASS | Inline SVG emoji |
| Theme color (mobile browser) | PASS | #7C3AED (purple) |
| Mobile viewport meta | PASS | width=device-width, no user-scale, viewport-fit=cover |
| No console.log / debug output | PASS | Clean |
| No placeholder/lorem text | PASS | All content realistic |
| No exposed API keys or secrets | PASS | API key server-side only via `process.env` |

---

## Environment Variables

| Variable | Where to Set | Required | Purpose |
|----------|-------------|----------|---------|
| `ANTHROPIC_API_KEY` | Vercel → Project Settings → Environment Variables | YES | Powers AI tutor chat via Claude Haiku |

**Without this key, the chat feature will show an error.** Everything else (onboarding, navigation, gamification, progress) works without it.

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
- **Link to existing project?** Yes if already created, No to create new
- **Project name:** aible
- **In which directory is your code located?** `.` (you're already in /app)
- **Want to modify these settings?** No (Vite auto-detected)

Then set the API key:
```bash
vercel env add ANTHROPIC_API_KEY production
```

### Option B: Vercel Dashboard + Git

1. Commit and push all changes to GitHub
2. Go to vercel.com → New Project → Import repo
3. Set **Root Directory** to `app`
4. Framework preset: Vite (auto-detected)
5. Add environment variable: `ANTHROPIC_API_KEY`
6. Deploy

### Post-Deploy Verification

1. Verify the live URL loads the Welcome screen
2. Complete onboarding: Welcome → Pick Topic → Preferences → Chat
3. Send a message to the AI tutor — verify streaming response works
4. End a session — verify celebration overlay with confetti + XP
5. Check Today tab for streak and activity feed
6. Check Profile tab — verify badges and settings
7. Verify page refresh on `/home` doesn't 404 (SPA rewrite working)
8. Test on mobile device (Chrome DevTools or real phone)

---

## Go/No-Go

### GO — Ready to deploy

- All 12 QA bugs fixed (5 P1, 3 P2, 4 P3)
- Build is clean (0 errors)
- SPA rewrite configured
- API proxy ready (Vercel Edge Function)
- No secrets in client-side code
- Core loop complete: onboarding → chat → XP → celebration → streak → daily goals

### One Required Step

Set `ANTHROPIC_API_KEY` in Vercel environment variables. Without it, the app renders but chat returns an error.

### Known Limitations (acceptable for prototype)

- Auth is simulated (localStorage, no Supabase)
- Payments are simulated (no Stripe)
- No push notifications
- No offline mode (chat requires API)
- Desktop layout not optimized (mobile-first, 428px max)
- Old v1 exercise code still in repo (unused, adds ~50KB to bundle)

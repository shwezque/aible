# QA Checklist — Aible v2 (Chat-Based Pivot)

**Date:** 2026-03-18
**Reviewed against:** PRD v2, UX Spec v2, Screen Map v2, Data Model v2, Tech Spec v2
**Build status:** Clean production build (427 KB JS, 38 KB CSS)

---

## Summary

| Area | Pass | Fail/Missing | Total | Rate |
|------|------|-------------|-------|------|
| Onboarding | 5 | 1 | 6 | 83% |
| Chat session (core) | 12 | 2 | 14 | 86% |
| Topic selection & nav | 6 | 0 | 6 | 100% |
| Session celebration | 3 | 3 | 6 | 50% |
| Gamification | 6 | 3 | 9 | 67% |
| AI tutor engine | 7 | 0 | 7 | 100% |
| Freemium / paywall | 6 | 0 | 6 | 100% |
| State persistence | 6 | 0 | 6 | 100% |
| Navigation | 7 | 0 | 7 | 100% |
| Today tab | 4 | 1 | 5 | 80% |
| Profile tab | 6 | 0 | 6 | 100% |
| Mobile & visual | 5 | 3 | 8 | 63% |
| **Total** | **73** | **13** | **86** | **85%** |

---

## 1. Onboarding Flow (S-02 → S-03 → S-06)

| # | Criteria (from PRD/UX) | Status | Notes |
|---|------------------------|--------|-------|
| 1.1 | Welcome screen: "Learn AI by talking about it" | PASS | Exact copy match, animation on entry |
| 1.2 | 2-column grid: 3 active + 3 Coming Soon | PASS | Grid renders correctly, color bars on left |
| 1.3 | Selected topic: purple border + checkmark | PASS | Ring + animated checkmark |
| 1.4 | First chat starts immediately, no signup | PASS | Direct to `/chat/{topicId}` |
| 1.5 | Under 60 seconds to first AI tutor message | PASS | 2 taps to chat screen |
| 1.6 | S-04 Quick Preferences (optional, skippable) | **SKIP** | Not implemented — acceptable for MVP |

### Notes
- S-01 Splash screen not implemented (auto-advance, 1.5s). Acceptable — Welcome is the first screen.

## 2. Chat Session (S-06) — Core Screen

| # | Criteria | Status | Notes |
|---|----------|--------|-------|
| 2.1 | Full-screen, tabs hidden | PASS | Chat route outside TabLayout |
| 2.2 | Top bar: back arrow, tutor name + topic, overflow | PASS | All elements present and styled |
| 2.3 | Session progress bar (4px, teal) | PASS | Teal bar below top bar, advances with concepts |
| 2.4 | AI messages: left-aligned white, accent left border | PASS | `border-l-3` with tutor color |
| 2.5 | User messages: right-aligned purple | PASS | Correct #7C3AED bg, white text |
| 2.6 | Concept Cards: "Key Concept" label, title, teal accent | PASS | Inline cards from `[CONCEPT]` tags |
| 2.7 | Quick Checks: tappable pills, correct/incorrect states | PASS | Teal for correct, amber for incorrect, +XP text |
| 2.8 | Suggested Actions: horizontal pill row | PASS | Scrollable, sends text on tap |
| 2.9 | XP Moments: "+10 XP" float animation | PASS | XpToast component, 2s auto-dismiss |
| 2.10 | Session Opener: avatar, greeting, "Today's goal" card | PASS | Shows first 3 concepts from conceptMap |
| 2.11 | Tutor avatar (28px) next to AI bubbles | **BUG-01** | Avatar missing from AIBubble — spec requires it |
| 2.12 | Streaming with typing indicator | PASS | Three animated bouncing dots |
| 2.13 | Error state with retry | PASS | Amber card with "Tap to retry" |
| 2.14 | Chat background #F9FAFB | PASS | Correct bg class |

## 3. Topic Selection & Navigation (S-05, S-10)

| # | Criteria | Status | Notes |
|---|----------|--------|-------|
| 3.1 | Learn tab: Continue Card (hero) + topic grid | PASS | Purple gradient hero, 2-col grid below |
| 3.2 | Topic cards: icon, name, tutor, progress ring, last active | PASS | All elements present |
| 3.3 | Continue Card: one-tap resume | PASS | Navigates to last-active topic |
| 3.4 | Topic Index: 75% bottom sheet with spring animation | PASS | AnimatePresence + spring transition |
| 3.5 | Chat state preserved on topic switch | PASS | localStorage persistence |
| 3.6 | Coming Soon: dimmed + lock icon | PASS | Opacity-50, lock SVG |

## 4. Session Wrap-Up / Celebration (S-07)

| # | Criteria | Status | Notes |
|---|----------|--------|-------|
| 4.1 | Celebration overlay: purple gradient, XP animation | PASS | Full-screen, spring animation |
| 4.2 | Streak update shown | PASS | "X-day streak!" card |
| 4.3 | Topic progress ring in overlay | PASS | ProgressRing with percentage |
| 4.4 | `completeSession` called on End Session | **BUG-02** | Not called — session XP (+25) never awarded, daily counter not incremented |
| 4.5 | Session Summary Card in chat before celebration | **BUG-03** | Missing entirely — spec says tutor sends summary with concepts covered |
| 4.6 | Confetti / particle burst on celebration | **BUG-04** | No confetti or particle effects |

## 5. Gamification System

| # | Criteria | Status | Notes |
|---|----------|--------|-------|
| 5.1 | XP: quiz correct +10 | PASS | `handleQuizAnswer` → `addXp(10)` |
| 5.2 | XP: session complete +25 | **BUG-02** | `completeSession` never called from Chat |
| 5.3 | XP: new concept +5 | **BUG-05** | Concepts tracked in session but no `addXp(5)` call per concept |
| 5.4 | XP: daily first-session bonus +5 | **BUG-02** | Only awarded via `completeSession` |
| 5.5 | Streaks: consecutive day tracking | PASS | `checkStreak()` with yesterday logic |
| 5.6 | Daily goal mini-bar on Learn tab | PASS | Teal progress bar with "X of Y today" |
| 5.7 | Levels: 10 levels, correct thresholds | PASS | Matches data model exactly |
| 5.8 | Badges: 9 definitions with check functions | PASS | All 9 defined, triggers correct |
| 5.9 | Badge display on Profile: earned/locked states | PASS | Horizontal scroll, 🔒 for unearned |

## 6. AI Tutor Engine

| # | Criteria | Status | Notes |
|---|----------|--------|-------|
| 6.1 | Claude 3.5 Haiku via Vercel Edge Function | PASS | `claude-3-5-haiku-20241022` model |
| 6.2 | Per-topic system prompts with personality | PASS | 3 distinct prompts: Ada, Sage, Max |
| 6.3 | Streaming SSE responses | PASS | ReadableStream + TextDecoder |
| 6.4 | Tag parsing: `[QUIZ]`, `[CONCEPT]`, `[SUGGESTIONS]` | PASS | `parseAIResponse()` handles all 3 |
| 6.5 | Context window: last 20 messages | PASS | `.slice(-20)` in sendMessage |
| 6.6 | API key server-side only | PASS | `process.env.ANTHROPIC_API_KEY` |
| 6.7 | Error handling: 429, 500, timeout | PASS | Custom error messages per status |

## 7. Freemium / Paywall

| # | Criteria | Status | Notes |
|---|----------|--------|-------|
| 7.1 | Free tier: 2 sessions/day | PASS | `canStartSession` = premium or < 2 sessions |
| 7.2 | Redirect to paywall after limit | PASS | Home → `/upgrade` when limit hit |
| 7.3 | Paywall: feature comparison (Free vs Pro) | PASS | 5-row comparison table |
| 7.4 | Annual highlighted "Best Value" | PASS | Teal badge next to price |
| 7.5 | Simulated upgrade (no real Stripe) | PASS | Sets `isPremium: true` |
| 7.6 | Pro toggle on Profile for testing | PASS | Quick toggle button |

## 8. State Persistence

| # | Criteria | Status | Notes |
|---|----------|--------|-------|
| 8.1 | User state in `aible_user` | PASS | Save on every setState |
| 8.2 | Chat history in `aible_chat_{topicId}` | PASS | Persists per topic |
| 8.3 | Daily counter resets on new day | PASS | `dailyDate` comparison on load |
| 8.4 | Message pruning at 150 | PASS | `pruneMessages()` keeps last 100 + summary |
| 8.5 | Corrupt data handled gracefully | PASS | try/catch on all reads, returns null |
| 8.6 | Reset progress works | PASS | `localStorage.clear()` + reload |

## 9. Navigation

| # | Criteria | Status | Notes |
|---|----------|--------|-------|
| 9.1 | 3-tab bottom nav: Learn, Today, Profile | PASS | NavLink tabs with icons |
| 9.2 | Tabs hidden during chat | PASS | Chat route outside TabLayout |
| 9.3 | Tabs hidden during onboarding | PASS | Onboarding routes outside TabLayout |
| 9.4 | Active tab: purple icon + label | PASS | `text-primary` on active |
| 9.5 | Streak badge on Today tab | PASS | Orange number overlay |
| 9.6 | Back button in chat → Learn tab | PASS | `navigate('/home')` |
| 9.7 | New user → onboarding, returning → home | PASS | `isNew` check in App |

## 10. Today Tab (S-08)

| # | Criteria | Status | Notes |
|---|----------|--------|-------|
| 10.1 | Streak card with flame + day count | PASS | Orange gradient, large number |
| 10.2 | Daily goal progress ring (80px) | PASS | ProgressRing with session count |
| 10.3 | Stats row: Total XP, Level, Best Streak | PASS | 3-column grid |
| 10.4 | Activity feed (chronological) | PASS | Topics + badges, sorted by time |
| 10.5 | Empty state: "Start your first session today!" | PASS | Shows when no activity |

### Notes
- Streak card text says "day streak" for both 1 and plural (minor copy issue, not blocking).

## 11. Profile Tab (S-09)

| # | Criteria | Status | Notes |
|---|----------|--------|-------|
| 11.1 | Avatar (initials circle) + name + level | PASS | 64px purple circle |
| 11.2 | Level progress bar | PASS | XP bar with "X / Y XP" |
| 11.3 | Stats: Streak, Topics, Sessions | PASS | 3-column grid |
| 11.4 | Badges horizontal scroll | PASS | Earned/locked states |
| 11.5 | Settings: Display Name, Daily Goal, Pro toggle, Reset | PASS | All functional |
| 11.6 | Reset requires confirmation | PASS | Red confirmation panel |

### Notes
- S-11 Badge Detail bottom sheet not implemented (tapping a badge does nothing). Minor for MVP.
- S-12 Daily Goal Picker is inline on Profile rather than bottom sheet. Acceptable.

## 12. Mobile & Visual Polish

| # | Criteria | Status | Notes |
|---|----------|--------|-------|
| 12.1 | Max-width 428px | PASS | `#root { max-width: 428px }` |
| 12.2 | Safe area padding | PASS | `env(safe-area-inset-bottom)` on TabBar |
| 12.3 | Tap targets 44px+ | PASS | Input, buttons all adequate |
| 12.4 | Color system matches spec | PASS | Purple/teal palette correct |
| 12.5 | Rounded corners (12-16px) | PASS | rounded-xl throughout |
| 12.6 | Streak flame pulses on Today tab icon | **MISSING** | Static number, spec says pulse |
| 12.7 | Confetti on celebration | **BUG-04** | Not implemented |
| 12.8 | Chat message slide-in animation | **MISSING** | Messages appear instantly |

# Aible — Product Requirements Document

**Date:** 2026-03-17
**Status:** MVP definition
**Tagline:** Be AI-able.

---

## Target User

Non-technical professionals (25–45) — marketers, freelancers, small business owners, creators, career-changers — who know AI matters but haven't built real skills. They're motivated by income, career relevance, and not getting left behind. They've tried ChatGPT a few times but can't point to real results.

## Core Problem

There's no structured, habit-forming way for non-technical people to learn AI by doing. Existing options are too technical (developer courses), too passive (video lectures with 3-15% completion), or too shallow (Twitter threads). People need a daily practice habit that builds real, applicable AI skills — the way Duolingo builds language skills.

## Solution

A gamified mobile web app that teaches AI skills through bite-sized daily lessons with interactive exercises, streaks, XP, and adaptive difficulty. Every lesson produces a real, usable output. Freemium model with Stripe payments.

---

## MVP Features

### F1: Onboarding (Value-First)

User completes their first lesson BEFORE creating an account.

| # | Acceptance Criteria |
|---|---|
| 1.1 | App opens to a 3-step personalization flow: role selection (marketer, freelancer, business owner, creator, student, other), goal (productivity, career, income), AI experience level (never, sometimes, regularly) |
| 1.2 | Personalization completes in under 30 seconds (3 taps) |
| 1.3 | First lesson starts immediately after personalization — no signup required |
| 1.4 | First lesson is engineered for 100% success (easiest exercises, generous feedback) |
| 1.5 | After first lesson celebration, user is prompted: "Create a free account to save your progress" |
| 1.6 | Total time from app open to first lesson completion: under 3 minutes |

### F2: Authentication

User accounts persist progress across sessions and devices.

| # | Acceptance Criteria |
|---|---|
| 2.1 | Email + password signup/login via Supabase Auth |
| 2.2 | Google social login via Supabase Auth |
| 2.3 | Pre-signup progress (from F1) is preserved after account creation |
| 2.4 | User can log out and log back in with progress intact |

### F3: Learning Path (Linear)

A single, curated path of lessons that the user progresses through sequentially.

| # | Acceptance Criteria |
|---|---|
| 3.1 | Home screen shows a visual linear path (vertical, winding nodes) |
| 3.2 | Each node = one lesson. States: completed (checkmark), current (highlighted/pulsing), locked (gray) |
| 3.3 | Lessons organized into modules (sections) with visible headers: "Prompt Foundations," "AI for Writing," "AI for Productivity," "AI for Monetization" |
| 3.4 | Each module contains 5-8 lessons |
| 3.5 | Lessons unlock sequentially — completing one unlocks the next |
| 3.6 | Onboarding assessment adjusts starting position (experienced users can skip ahead) |
| 3.7 | Path shows per-module progress (e.g., "3/6 lessons complete") |

### F4: Lesson Player

The core learning experience — interactive, 3-5 minute micro-lessons.

| # | Acceptance Criteria |
|---|---|
| 4.1 | Each lesson teaches ONE concept (e.g., "Adding context to prompts") |
| 4.2 | Lessons contain 6-10 exercises, taking 3-5 minutes total |
| 4.3 | Full-screen takeover during lessons — no bottom nav, only close (X) and progress bar |
| 4.4 | One exercise per screen — no scrolling or multiple questions visible |
| 4.5 | Four exercise types implemented: **Prompt Builder** (drag to arrange prompt components), **Output Judge** (compare two AI outputs, pick the better one), **Fill-in-the-Blank** (complete a prompt template from word bank), **Real-World Scenario** (multiple choice — pick the best AI approach for a work situation) |
| 4.6 | Exercises scaffold within each lesson: recognition → guided practice → application |
| 4.7 | Immediate feedback on every answer: correct (green flash + sound + encouraging text) or incorrect (gentle red + correct answer shown + explanation) |
| 4.8 | Wrong answers are NOT punitive — tone is encouraging, never judgmental |
| 4.9 | Lesson ends with a celebration screen: confetti animation, XP earned, concept summary |

### F5: Gamification System

XP, streaks, daily goals, and celebrations that make learning addictive.

| # | Acceptance Criteria |
|---|---|
| 5.1 | **XP:** 10 XP per exercise completed, +50 XP bonus for lesson completion, +20 XP for perfect lesson (no mistakes) |
| 5.2 | **Streaks:** Consecutive days of completing at least 1 lesson. Displayed prominently on home screen with fire icon. |
| 5.3 | **Streak freeze:** 1 free freeze per week (auto-granted). Additional freezes available to Pro users. Protects streak for 1 missed day. |
| 5.4 | **Streak milestones:** Celebrations at 3, 7, 14, 30, 50, 100 days with unique badge |
| 5.5 | **Daily goal:** Set during onboarding (Quick: 1 lesson, Steady: 2 lessons, Ambitious: 3 lessons). Adjustable in settings. |
| 5.6 | **Daily goal ring:** Visible on home screen showing progress toward today's goal |
| 5.7 | **Levels:** XP thresholds define user level (Level 1 at 0 XP, Level 2 at 200 XP, etc.). Level displayed on profile. |
| 5.8 | **Celebrations are tiered:** micro (correct answer, 0.5s), medium (lesson complete, 2-3s), large (streak milestone, 3-5s) |
| 5.9 | **Achievements/badges:** 5 MVP badges — "First Prompt" (first lesson), "On Fire" (7-day streak), "Prompt Crafter" (complete first module), "Perfect Score" (ace a lesson), "AI Explorer" (complete 10 lessons) |

### F6: Adaptive Curriculum

Content adjusts to user level — not one-size-fits-all.

| # | Acceptance Criteria |
|---|---|
| 6.1 | Onboarding assessment (F1) sets starting module and difficulty tier |
| 6.2 | Each lesson has 3 difficulty variants (beginner, intermediate, advanced) affecting exercise complexity |
| 6.3 | Difficulty tier adjusts based on performance: >80% correct on last 3 lessons → advance tier. <50% correct → lower tier. |
| 6.4 | Content framing adapts to role selected at onboarding (marketer sees marketing examples, freelancer sees freelance examples) |

### F7: Payments (Freemium)

Free tier builds the habit. Pro tier removes friction and unlocks depth.

| # | Acceptance Criteria |
|---|---|
| 7.1 | **Free tier:** 3 lessons per day, all modules accessible, core gamification (XP, streaks, 1 freeze/week), daily goal |
| 7.2 | **Pro tier ($9.99/mo or $59.99/yr):** Unlimited lessons, unlimited streak freezes, achievement badges, advanced lesson variants |
| 7.3 | Paywall appears AFTER 3rd lesson of the day: "You've completed your free lessons today. Unlock unlimited with Aible Pro." |
| 7.4 | Paywall screen shows: feature comparison, annual plan highlighted as "Best Value" ($4.99/mo equivalent), 7-day free trial for annual |
| 7.5 | Stripe Checkout integration for payment processing |
| 7.6 | Subscription status synced via Supabase (webhook from Stripe) |
| 7.7 | Paywall NEVER appears during a lesson — only between lessons |

### F8: Lesson Content (MVP Curriculum)

Pre-authored lessons covering 4 modules with enough depth to sustain 3-4 weeks of daily use.

| # | Acceptance Criteria |
|---|---|
| 8.1 | **Module 1 — Prompt Foundations** (6 lessons): What is a prompt, adding context, specifying format, role prompting, iterating on outputs, prompt templates |
| 8.2 | **Module 2 — AI for Writing** (6 lessons): Email drafting, social media posts, editing/rewriting, summarizing, content outlines, tone adjustment |
| 8.3 | **Module 3 — AI for Productivity** (6 lessons): Meeting notes, research summaries, data analysis prompts, workflow automation basics, document creation, task prioritization |
| 8.4 | **Module 4 — AI for Monetization** (6 lessons): Freelance AI services, AI-powered side hustles, client deliverables, pricing AI work, portfolio building, finding opportunities |
| 8.5 | Each lesson has 6-10 exercises across the 4 exercise types |
| 8.6 | Each lesson has 3 difficulty variants (beginner/intermediate/advanced) |
| 8.7 | All content uses realistic, practical scenarios — zero theory-only lessons |
| 8.8 | Content is tool-agnostic (teaches prompt thinking, not "click here in ChatGPT") |

### F9: Mobile-First UI

Gamified, colorful, fun — feels like a game that teaches.

| # | Acceptance Criteria |
|---|---|
| 9.1 | Responsive design optimized for mobile (375px-428px primary target) |
| 9.2 | Bottom navigation: 4 tabs — Learn (path), Practice (review), Achievements, Profile |
| 9.3 | All tap targets minimum 44px, primary CTAs 56px+ |
| 9.4 | Animations: button press states, correct/incorrect feedback flashes, lesson completion confetti, streak celebrations |
| 9.5 | Mascot character appears in onboarding, lesson feedback, empty states, and celebrations |
| 9.6 | Color palette: vibrant primary (purple or teal — not generic blue), warm amber/gold for achievements, green for correct, soft red for incorrect |
| 9.7 | Generous whitespace — screens never feel cramped |

---

## Non-Goals (Explicitly Out of Scope)

These are specific scope boundaries to prevent creep during build:

| # | Non-Goal | Why |
|---|----------|-----|
| N1 | **No leaderboards or leagues** | Social competition is v2. MVP validates the core learning loop. |
| N2 | **No push notifications** | Requires native app or service worker complexity. MVP validates retention via streak mechanic alone. |
| N3 | **No AI-generated lesson content** | Lessons are pre-authored. Real-time AI generation adds unpredictable quality and API cost. |
| N4 | **No real AI tool integration in exercises** | Exercises use mocked/simulated AI outputs, not live API calls. Keeps lessons predictable, fast, and free of API costs. |
| N5 | **No desktop-optimized layout** | Mobile web only. Desktop will work but is not designed for. |
| N6 | **No content authoring tools** | Lessons are stored as JSON data files, authored by hand or with Claude. No CMS. |
| N7 | **No team/enterprise tier** | B2B is a future revenue channel, not MVP. |
| N8 | **No sharing/social features** | No share-to-LinkedIn, no friend system, no activity feed. |
| N9 | **No multiple concurrent paths** | User follows one linear path. Path switching is v2. |
| N10 | **No lesson search or browse** | User follows the path. No catalog/browse mode. |

---

## Milestones

### M1: Foundation (Week 1)
- Project scaffolding (React + Vite + Tailwind + React Router)
- Supabase setup (auth + database schema)
- Data model for lessons, user progress, subscriptions
- Lesson content JSON schema + first 2 lessons authored
- Basic routing and screen shells

### M2: Core Learning Loop (Week 2)
- Onboarding flow (3-step personalization)
- Lesson player with all 4 exercise types
- One-question-per-screen interaction model
- Immediate feedback (correct/incorrect) with animations
- Lesson completion celebration screen
- First module fully playable (6 lessons)

### M3: Gamification + Auth (Week 3)
- Authentication (email + Google via Supabase)
- XP system (earn, accumulate, display)
- Streak system (track, display, freeze)
- Daily goal (set, track, celebrate completion)
- Levels (XP thresholds, level display)
- Home screen with learning path, streak, XP, daily goal ring

### M4: Content + Adaptation (Week 4)
- All 4 modules authored (24 lessons, 3 difficulty tiers each)
- Adaptive difficulty (tier adjustment based on performance)
- Role-based content framing (examples adapt to user's role)
- Achievement badges (5 MVP badges)
- Profile screen with stats

### M5: Payments + Polish (Week 5)
- Stripe integration (checkout, subscription management)
- Free/Pro tier enforcement (3 lessons/day limit, paywall screen)
- Subscription status sync (Stripe → Supabase)
- Animation polish (celebrations, transitions, micro-interactions)
- Mascot integration across screens
- Mobile UX polish pass

### M6: QA + Launch Prep (Week 6)
- Full QA pass (→ `/qa-app`)
- Performance optimization
- Deploy to Vercel
- Launch checklist (→ `/prep-launch`)

---

## Technical Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS + React Router |
| Auth | Supabase Auth (email + Google OAuth) |
| Database | Supabase (Postgres) |
| Payments | Stripe (Checkout + Customer Portal + Webhooks) |
| Animations | Framer Motion |
| Deployment | Vercel |
| Content | JSON data files (lesson definitions) |

---

## Success Criteria

The MVP succeeds if:
1. A new user goes from app open → first lesson complete in under 3 minutes
2. Completing a lesson feels satisfying and takes 3-5 minutes
3. The streak/XP loop creates a genuine pull to return the next day
4. The paywall feels like friction removal, not punishment
5. Someone can show it to a friend and say "It's Duolingo but for learning AI" and the friend gets it

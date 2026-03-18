# Product Brief

## Tagline
**Be AI-able.**

## Audience
**Primary:** Non-technical professionals (25–45) — marketers, freelancers, small business owners, creators, career-changers — who know AI is important but haven't built real skills. They're motivated by income potential, career relevance, and not getting left behind.

**Secondary:** Side-hustle seekers and solopreneurs who want AI as leverage to build or monetize something.

## Problem
There's a massive gap between "AI exists" and "I use AI to make money." Current options are too technical (developer courses), too shallow (listicles and Twitter threads), or too passive (watching tutorials without doing). People need a structured, hands-on, adaptive path from confused to capable — one that fits into daily life and keeps them coming back.

## Promise
Aible makes you AI-capable in minutes a day. A structured curriculum adapts to your level and goals. Each lesson teaches a real, applicable skill. You don't just learn about AI — you learn to do things with AI that matter to your career and income. And it's genuinely fun.

## Positioning
Duolingo, but for AI. Gamified, addictive, progressively challenging. Not a course platform, not a content feed, not a chatbot. A skill-building engine with a curriculum that adapts to you.

## Comparable products
- **Duolingo** — the direct model: habit loop, gamification, streaks, bite-sized lessons, adaptive difficulty, freemium monetization
- **Brilliant.org** — interactive STEM learning, progressive difficulty, visual explanations
- **Teal / Careerflow** — career-oriented AI tools (adjacent market, different approach)
- **YouTube AI tutorials** — the passive, unstructured incumbent we replace

## MVP scope

### In scope
- **Authentication:** User accounts (email/social sign-up) so progress persists across devices
- **Onboarding:** Assessment of AI experience level and goals → places user on the right starting point in the curriculum
- **Adaptive curriculum:** Structured learning path that adjusts based on user level and progress — not one-size-fits-all
- **Lesson library:** Many lessons organized into progressive modules, covering a wide curriculum (see below)
- **Core curriculum areas:**
  - Prompting Fundamentals (how to talk to AI effectively)
  - AI for Writing & Content (emails, social posts, articles, copy)
  - AI for Productivity & Automation (workflows, tools, time savings)
  - AI for Side Hustles & Monetization (freelancing, services, products)
  - AI Tools Landscape (ChatGPT, Claude, Midjourney, etc. — when to use what)
- **Lesson format:** Short explanation → interactive exercise → real-world application prompt (Duolingo-style progression within each lesson)
- **Gamification system:**
  - XP earned per lesson/exercise
  - Daily streaks with streak freeze option
  - Levels and progression visualization
  - Achievements/badges for milestones
  - Daily goal setting (casual / regular / serious)
- **Progress tracking:** Per-module progress, overall level, skill tree visualization
- **Payments:** Freemium model — free tier with limited daily lessons, premium tier for full access (Duolingo Plus model)
- **Mobile-first UI:** Gamified, colorful, fun — inspired by Duolingo's playful energy but with a clean, modern startup aesthetic

### Out of scope (for now)
- Social features (leaderboards, friends, sharing)
- Push notifications
- Desktop-optimized layout
- AI-generated lesson content in real-time (curriculum is pre-authored, adaptation is in sequencing/difficulty)
- Native mobile apps

## Technical approach
- Mobile web app: React + Vite + Tailwind CSS
- Auth: Supabase (email + social auth)
- Database: Supabase (user progress, lesson state, subscriptions)
- Payments: Stripe (freemium subscription)
- Deployment: Vercel
- Adaptive logic: Client-side, based on user assessment + progress data

## Success signals
- A first-time user understands "Duolingo for AI" within 10 seconds
- Onboarding feels quick and personalized (under 60 seconds)
- Completing a lesson feels satisfying and takes 2–3 minutes
- The streak/XP loop creates genuine pull to return daily
- Free-to-paid conversion feels natural, not punishing
- Someone can describe it to a friend in one sentence: "It's Duolingo but for learning AI"

## Resolved questions
1. **Lesson depth:** Adaptive to the user's journey. Start accessible for complete beginners, progressively deepen. Non-technical throughout — "here's what to do" not "here's how it works under the hood."
2. **Monetization:** Both — Aible teaches users to monetize AI AND Aible itself monetizes via freemium subscriptions.
3. **Content volume:** Many lessons, always relevant. Enough to feel like a real product from day one, with a clear path ahead.
4. **Onboarding assessment:** Functional — it determines curriculum starting point and difficulty, not just engagement theater.

## Assumptions to validate
- Non-technical people will engage with structured AI learning on mobile daily
- The "monetize AI" angle is a stronger acquisition hook than "learn AI" generically
- Duolingo's gamification model transfers to skill-based learning (not just languages)
- Freemium with daily limits drives conversion without killing retention

## Next step
→ Run competitive research (`/run-research`) to deeply analyze Duolingo's mechanics, benchmark AI learning products, and lock down the gamification system and lesson format before writing the PRD.

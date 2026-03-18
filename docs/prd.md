# Aible — Product Requirements Document

**Date:** 2026-03-18
**Status:** MVP definition (v2 — chat-based pivot)
**Tagline:** Be AI-able.
**One-liner:** Learn AI by talking to AI.

---

## Target User

Non-technical professionals (25–45) — marketers, freelancers, small business owners, creators, career-changers — who know AI matters but haven't built real skills. They're motivated by income, career relevance, and not getting left behind. They've tried ChatGPT a few times but can't point to real results.

## Core Problem

There's no structured, habit-forming way for non-technical people to learn AI by doing. Existing options are too technical (developer courses), too passive (video lectures with 3-15% completion), or too shallow (Twitter threads). People need a daily practice habit that builds real, applicable AI skills — delivered through conversation, not quizzes.

## Solution

A gamified mobile web app that teaches AI skills through conversational sessions with specialized AI tutors. Each tutor has deep knowledge of a specific AI topic area and teaches through Socratic dialogue, embedded concept cards, and inline knowledge checks. Users earn XP, maintain streaks, and track visible progress across topics. Freemium model: 2 free sessions/day.

---

## MVP Features

### F1: Onboarding (Value-First)

User starts chatting with an AI tutor within 60 seconds.

| # | Acceptance Criteria |
|---|---|
| 1.1 | App opens to a welcome screen with "Learn AI by talking about it" messaging |
| 1.2 | User picks a starting topic from a 2-column grid (3 available, 3 "Coming Soon") |
| 1.3 | Optional quick preference screen: AI experience level (skippable) |
| 1.4 | First chat session starts immediately — no signup required |
| 1.5 | First session is warm and encouraging, tutor introduces itself |
| 1.6 | Total time from app open to first AI tutor message: under 60 seconds |

### F2: Chat Session (Core Learning Experience)

Conversational learning with structured milestones.

| # | Acceptance Criteria |
|---|---|
| 2.1 | Full-screen chat interface — bottom tabs hidden during sessions |
| 2.2 | Top bar: back arrow, tutor name + topic label, overflow menu |
| 2.3 | Session progress indicator (thin bar below top bar) advances on concept coverage |
| 2.4 | AI tutor messages: left-aligned white bubbles with tutor avatar and accent-color left border |
| 2.5 | User messages: right-aligned purple bubbles |
| 2.6 | **Concept Cards:** Full-width inline cards with "Key Concept" label, title, explanation — visually distinct from chat bubbles |
| 2.7 | **Quick Checks:** Inline interactive cards with question + 2-3 tappable answer pills. Correct → teal + checkmark + XP animation. Incorrect → amber + explanation |
| 2.8 | **Suggested Actions:** Horizontally scrollable pill row above input after every AI message (e.g., "Tell me more", "Give me an example", "What's next?") |
| 2.9 | **XP Moments:** "+10 XP" float animation on correct Quick Check answers and concept milestones |
| 2.10 | Session Opener: tutor avatar, greeting, "Today's goal" mini-card with 2-3 learning objectives |
| 2.11 | Sessions last 5-8 minutes (~8-15 messages), tutor controls pacing |
| 2.12 | Tutor uses Socratic method — guides through questions, never lectures |
| 2.13 | Quick Checks embedded every 2-3 minutes of conversation |
| 2.14 | Streaming responses with typing indicator for real-time feel |

### F3: Topic Selection & Navigation

Multiple specialized AI tutors organized by topic area.

| # | Acceptance Criteria |
|---|---|
| 3.1 | Learn tab shows topic dashboard: Continue Card (hero) + 2-column topic grid |
| 3.2 | Each topic card shows: icon, name, tutor name ("with Ada"), progress ring, last active |
| 3.3 | Continue Card shows last-active topic with "Continue" action — one tap to resume |
| 3.4 | Topic Index as slide-up bottom sheet (75% viewport) for quick switching during chat |
| 3.5 | Chat state preserved when switching topics — tutor resumes where user left off |
| 3.6 | "Coming Soon" topics visible but dimmed with lock icon |

**MVP Topics (3 active):**

| Topic | Tutor | Personality | Color |
|-------|-------|-------------|-------|
| AI Basics | Ada | Patient, warm, analogies | #7C3AED |
| Prompting | Sage | Clever, playful, examples | #14B8A6 |
| AI at Work | Max | Practical, direct, actionable | #3B82F6 |

**Coming Soon (3):**

| Topic | Tutor | Color |
|-------|-------|-------|
| AI Ethics | Nova | #F43F5E |
| AI for Business | Blake | #F59E0B |
| AI Creative Tools | Muse | #8B5CF6 |

### F4: Session Wrap-Up & Celebration

Closure, reward, and forward momentum after each session.

| # | Acceptance Criteria |
|---|---|
| 4.1 | Tutor initiates wrap-up when session objectives are met (~5-8 min) |
| 4.2 | Session Summary Card in chat: concepts covered (teal checkmarks), Quick Check results |
| 4.3 | Celebration overlay: full-screen, purple gradient, XP animation with particle burst |
| 4.4 | Shows: total XP earned, streak update, topic progress ring, badge if earned, daily goal status |
| 4.5 | Two buttons: "Keep Going" (→ Learn tab) and "Switch Topic" (→ Topic Index) |
| 4.6 | If user ends session early (overflow menu), celebration scales to actual progress |

### F5: Gamification System

XP, streaks, daily goals, and celebrations that make learning addictive.

| # | Acceptance Criteria |
|---|---|
| 5.1 | **XP:** +25 per session, +10 per correct Quick Check, +5 per new concept, +5 daily first-session bonus, +10 for starting a new topic, +50 chapter bonus, +100 topic mastery bonus |
| 5.2 | **Streaks:** Consecutive days completing at least 1 session. Fire icon on Learn tab header. |
| 5.3 | **Daily goal:** 1, 2, or 3 sessions/day (default: 1). Progress shown as mini-bar on Learn tab. |
| 5.4 | **Levels:** 10 levels from Beginner (0 XP) to Legend (7,500 XP). Shown on Profile. |
| 5.5 | **Badges:** 9 badges — First Steps, Curious Mind, Deep Diver, Quiz Ace, On a Roll, Week Warrior, Concept Master, Rising Star, Explorer |
| 5.6 | **Celebrations tiered:** micro (XP float, 1.2s), medium (session complete, 2-3s), large (badge/level-up, 3-5s) |
| 5.7 | Today tab: daily dashboard with streak card, goal progress ring, activity feed |

### F6: AI Tutor Engine

LLM integration that powers the conversational learning experience.

| # | Acceptance Criteria |
|---|---|
| 6.1 | Single LLM API (Claude Haiku) with per-topic system prompts — each tutor is a persona |
| 6.2 | Vercel Edge Function proxy (`/api/chat`) — API key never in client |
| 6.3 | Streaming responses for real-time chat feel |
| 6.4 | System prompts define: tutor personality, teaching approach, concept map, Quick Check format, Suggested Actions, topic boundaries |
| 6.5 | AI embeds `[QUIZ]`, `[CONCEPT]`, `[SUGGESTIONS]` tags — client parses and renders as UI elements |
| 6.6 | Context window: last 20 messages sent to API, with summary prefix for older conversation |
| 6.7 | Tutor stays on-topic; redirects off-topic questions to appropriate tutor |
| 6.8 | Tutor adapts to user's experience level and role from onboarding |

### F7: Payments (Freemium)

Free tier builds the habit. Pro tier removes limits.

| # | Acceptance Criteria |
|---|---|
| 7.1 | **Free tier:** 2 sessions per day, all topics accessible, full gamification |
| 7.2 | **Pro tier ($9.99/mo or $59.99/yr):** Unlimited sessions, full session history, priority response speed |
| 7.3 | Upgrade prompt after 2nd session of the day: tutor teases next topic → "Want to keep going?" |
| 7.4 | Paywall screen: feature comparison, annual highlighted as "Best Value", 7-day free trial |
| 7.5 | Simulated in prototype (no real Stripe integration yet) |

### F8: Progress Tracking

Visible learning progress across topics without discrete exercises.

| # | Acceptance Criteria |
|---|---|
| 8.1 | Each topic has a concept map (5-8 key concepts) |
| 8.2 | Concepts transition: not started → explored (AI tagged it) → mastered (Quick Check passed) |
| 8.3 | Topic progress shown as percentage ring on topic cards |
| 8.4 | Profile shows: total XP, current streak, topics started, sessions completed, level |
| 8.5 | Chat history persisted per topic in localStorage |

### F9: Mobile-First UI

Clean, warm, educational — not a messaging app.

| # | Acceptance Criteria |
|---|---|
| 9.1 | Responsive design for 375px-428px primary target |
| 9.2 | 3-tab bottom nav: Learn, Today, Profile |
| 9.3 | Tabs hidden during chat sessions — full-screen takeover |
| 9.4 | Chat background: #F9FAFB (warm gray, not white) — differentiates from messaging |
| 9.5 | Concept Cards and Quick Checks visually distinct from chat bubbles |
| 9.6 | Per-tutor accent colors on avatars and message borders |
| 9.7 | All tap targets minimum 44px |
| 9.8 | Animations: XP float, confetti, progress ring fill, chat message slide-in |

---

## Non-Goals (Out of Scope)

| # | Non-Goal | Why |
|---|----------|-----|
| N1 | No leaderboards or social features | Validates core loop first |
| N2 | No push notifications | Requires native/service worker complexity |
| N3 | No voice input | Text-first MVP; voice is v2 |
| N4 | No desktop-optimized layout | Mobile web only |
| N5 | No real auth/payments in prototype | Simulated with localStorage |
| N6 | No content authoring CMS | Topics defined in code |
| N7 | No offline mode | Conversations require API calls |
| N8 | No cross-device sync | localStorage only for prototype |

---

## Milestones

### M1: Foundation
- Project scaffolding (React + Vite + Tailwind + React Router)
- Data model: topics, chat sessions, user state
- Topic definitions with system prompts (3 MVP topics)
- Basic routing and screen shells
- Vercel Edge Function for LLM proxy

### M2: Core Chat Loop
- Onboarding flow (welcome → pick topic → chat)
- Chat interface with all message types (AI, user, Concept Card, Quick Check, Suggested Actions, XP Moment)
- Response parsing (`[QUIZ]`, `[CONCEPT]`, `[SUGGESTIONS]` tags)
- Streaming responses with typing indicator
- Session Opener and Session Summary

### M3: Gamification + Navigation
- XP system (earn, accumulate, display, level-up)
- Streak system (track, display, celebrate milestones)
- Daily goal (set, track, mini-bar)
- Badges (9 badges with trigger logic)
- Topic Dashboard (Learn tab) with Continue Card + topic grid
- Topic Index bottom sheet for switching
- Session Celebration overlay
- Today tab (daily dashboard)
- Profile tab (stats, badges, settings)

### M4: Polish + Launch
- All 3 MVP tutor system prompts refined and tested
- Free tier enforcement (2 sessions/day, upgrade prompt)
- Paywall screen (simulated)
- Animation polish (celebrations, transitions, micro-interactions)
- Mobile UX polish pass
- QA pass (→ `/qa-app`)
- Deploy to Vercel (→ `/prep-launch`)

---

## Technical Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS + React Router |
| LLM | Claude 3.5 Haiku via Vercel Edge Function |
| State | localStorage (3 hooks: useStore, useChat, useTopics) |
| Animations | Framer Motion |
| Deployment | Vercel |
| Auth | Simulated (localStorage) — Supabase planned |
| Payments | Simulated — Stripe planned |

---

## Success Criteria

1. A new user goes from app open → chatting with AI tutor in under 60 seconds
2. A session feels satisfying and takes 5-8 minutes
3. The streak/XP loop creates genuine pull to return the next day
4. Users can articulate what they learned after a session
5. The experience feels like learning, not just chatting — Concept Cards and Quick Checks make it structured
6. Someone can show it to a friend and say "It teaches you AI through conversation" and the friend gets it

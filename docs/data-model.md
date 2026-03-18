# Data Model — Aible (Chat-Based Pivot)

> Version 2.0 — Conversational SLM architecture
> Last updated: 2026-03-18

---

## Overview

Aible pivots from discrete exercises to chat-based learning with specialized AI tutors. Each "tutor" is a persona backed by a single LLM API with a topic-specific system prompt. All data lives in localStorage for the prototype.

---

## Entity Definitions

### 1. Topic (static — shipped with app)

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique slug, e.g. `"ai-basics"` |
| `name` | string | Display name, e.g. `"AI Basics"` |
| `tutorName` | string | Tutor character name, e.g. `"Ada"` |
| `subtitle` | string | One-liner, e.g. `"What AI actually is and isn't"` |
| `icon` | string | Emoji or icon key |
| `color` | string | Hex color for UI theming per tutor |
| `description` | string | 2-3 sentence overview |
| `systemPrompt` | string | Full system prompt for the LLM |
| `starterMessages` | string[] | 3-4 suggested first messages |
| `conceptMap` | string[] | Key concepts this tutor covers |
| `chapters` | Chapter[] | Ordered chapters with topics |
| `difficulty` | `"beginner"` \| `"intermediate"` \| `"advanced"` | Difficulty tier |
| `isComingSoon` | boolean | Not yet available in MVP |

**MVP topics:**

| ID | Name | Tutor | Color | MVP |
|----|------|-------|-------|-----|
| `ai-basics` | AI Basics | Ada | #7C3AED | Yes |
| `prompting` | Prompting | Sage | #14B8A6 | Yes |
| `ai-work` | AI at Work | Max | #3B82F6 | Yes |
| `ai-ethics` | AI Ethics | Nova | #F43F5E | Coming Soon |
| `ai-business` | AI for Business | Blake | #F59E0B | Coming Soon |
| `ai-creative` | AI Creative Tools | Muse | #8B5CF6 | Coming Soon |

---

### 2. ChatSession (persistent — one per topic per user)

| Field | Type | Description |
|-------|------|-------------|
| `topicId` | string | FK to Topic.id |
| `messages` | Message[] | Ordered array of messages |
| `startedAt` | ISO string | When user first messaged |
| `lastActiveAt` | ISO string | Last message timestamp |
| `messageCount` | number | Total messages |
| `conceptsCovered` | string[] | Concept IDs explored |
| `conceptsMastered` | string[] | Concepts with passed Quick Checks |
| `checkpointsPassed` | number | Quick Checks passed |
| `totalXpEarned` | number | XP earned in this topic |
| `sessionsCompleted` | number | Completed session count |

**Storage key:** `aible_chat_{topicId}`

---

### 3. Message

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | UUID |
| `role` | `"user"` \| `"assistant"` \| `"system"` | Sender |
| `content` | string | Message text (markdown) |
| `type` | `"text"` \| `"quiz"` \| `"concept"` \| `"summary"` \| `"xp"` \| `"suggestion"` \| `"milestone"` | Message variant |
| `timestamp` | ISO string | When sent |
| `metadata` | object \| null | Type-specific data |

**Metadata by type:**

- `"text"` — `null`
- `"quiz"` — `{ question: string, options: string[], correctIndex: number, userAnswer: number | null, xpValue: number }`
- `"concept"` — `{ conceptId: string, title: string }`
- `"summary"` — `{ conceptsCovered: string[], sessionDuration: number }`
- `"xp"` — `{ amount: number, reason: string }`
- `"suggestion"` — `{ suggestions: string[] }`
- `"milestone"` — `{ type: "badge" | "level" | "streak", detail: string }`

---

### 4. UserState (persistent — single object)

| Field | Type | Description |
|-------|------|-------------|
| `userId` | string | Generated UUID |
| `displayName` | string | From onboarding |
| `role` | string | e.g. "Marketing Manager" |
| `goal` | string | Learning goal |
| `experienceLevel` | `"none"` \| `"some"` \| `"regular"` | AI familiarity |
| `xp` | number | Lifetime XP |
| `level` | number | Derived from XP thresholds |
| `streak` | number | Consecutive days active |
| `longestStreak` | number | All-time best |
| `lastActiveDate` | `"YYYY-MM-DD"` | For streak calculation (local time) |
| `badges` | Badge[] | Earned badges |
| `dailySessionsCompleted` | number | Sessions completed today |
| `dailyGoal` | number | Target sessions/day (1, 2, or 3) |
| `isPremium` | boolean | Simulated subscription |
| `topicProgress` | Record<string, TopicProgress> | Per-topic summary |
| `createdAt` | ISO string | Account creation |
| `onboardingComplete` | boolean | Has completed onboarding |

**Storage key:** `aible_user`

---

### 5. TopicProgress (nested in UserState.topicProgress)

| Field | Type | Description |
|-------|------|-------------|
| `topicId` | string | FK to Topic.id |
| `status` | `"not_started"` \| `"in_progress"` \| `"mastered"` | High-level status |
| `conceptsCovered` | string[] | Concepts discussed |
| `conceptsMastered` | string[] | Concepts with passed checks |
| `totalMessages` | number | Message count |
| `totalXp` | number | XP earned in this topic |
| `checkpointsPassed` | number | Quick Checks passed |
| `lastActiveAt` | ISO string | Last chat in this topic |
| `sessionsCompleted` | number | Distinct sessions completed |

---

### 6. Badge

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | e.g. `"first-chat"` |
| `name` | string | Display name |
| `description` | string | How it was earned |
| `icon` | string | Emoji |
| `earnedAt` | ISO string | When earned |

---

## XP System (Canonical)

| Action | XP |
|--------|----|
| Complete a session | +25 |
| Correct Quick Check | +10 |
| New concept explored | +5 |
| First session of the day | +5 bonus |
| Start a new topic | +10 |
| Complete a chapter | +50 bonus |
| Master a topic | +100 bonus |

## Level Thresholds

| Level | XP | Name |
|-------|-----|------|
| 1 | 0 | Beginner |
| 2 | 100 | Learner |
| 3 | 300 | Practitioner |
| 4 | 600 | Skilled |
| 5 | 1,000 | Proficient |
| 6 | 1,600 | Advanced |
| 7 | 2,500 | Expert |
| 8 | 3,500 | Master |
| 9 | 5,000 | AI Pro |
| 10 | 7,500 | Legend |

---

## Storage Layout (localStorage)

| Key | Content | Typical Size |
|-----|---------|-------------|
| `aible_user` | UserState JSON | ~2-5 KB |
| `aible_chat_ai-basics` | ChatSession for Ada | 0-200 KB |
| `aible_chat_prompting` | ChatSession for Sage | 0-200 KB |
| `aible_chat_ai-work` | ChatSession for Max | 0-200 KB |

**Total worst case:** ~1.2 MB (well within 5 MB limit)

---

## Entity Relationship Summary

```
UserState (1)
  ├── topicProgress (1:many, keyed by topicId)
  ├── badges (1:many)
  └── settings (1:1)

Topic (static, 1)
  └── ChatSession (1:1 per user, stored separately)
        └── Messages (1:many, ordered)
```

---

## Migration Path to Production

| Prototype | Production |
|-----------|------------|
| Topics as static JSON in `/src/data/topics.js` | Topics table in Supabase |
| ChatSession per localStorage key | `chat_sessions` + `messages` tables |
| UserState in localStorage | `users` + `user_progress` tables |
| Badges checked client-side | Badge triggers as Edge Functions |
| XP calculated client-side | XP ledger with server-side validation |
| API key in env var | Server-side API calls via Edge Functions |
| No auth | Supabase Auth |
| Simulated premium | Stripe integration |

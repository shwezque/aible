# Aible Product Strategy v2: The Conversational Pivot

**Date:** 2026-03-18
**Status:** Approved — canonical strategy for the chat-based model

---

## Executive Summary

Aible is pivoting from discrete exercise-based learning (Duolingo clone) to conversational learning with specialized AI tutors. The user learns AI by talking to AI — each topic has its own tutor personality with deep knowledge of that domain. Gamification stays. The audience stays. The tone stays. The mechanic changes fundamentally.

---

## 1. Revised Positioning

**Old framing:** "Duolingo for AI" — bite-sized exercises that teach AI concepts through repetition.

**New framing:** "AI tutors that meet you where you are" — learn AI by having real conversations with specialized AI teachers who adapt to your level, your job, and your curiosity.

**One-liner:** *Learn AI by talking to AI.*

**Tagline (unchanged):** "Be AI-able."

**Why this works:** The original Duolingo metaphor has a ceiling. Language learning benefits from rote repetition. AI literacy does not — it benefits from exploration, context, and personalization. A marketer and a freelance designer need different things from "AI for Writing." Conversation lets the tutor adapt. Exercises cannot.

---

## 2. Updated Value Proposition

**Promise:** In 5 minutes a day, you will become meaningfully better at using AI in your work — by talking to AI tutors who actually understand your field.

**Core transformation:** From AI-anxious to AI-confident. From "I should learn this" to "I use this daily."

---

## 3. Topic / Tutor Structure

Each topic has a **named tutor character** with a distinct personality, teaching style, and curriculum.

### The Tutors (6 total, MVP: 3)

| # | Tutor | Domain | Personality | MVP |
|---|-------|--------|-------------|-----|
| 1 | **Ada** | AI Basics | Patient, warm, uses lots of analogies | Yes |
| 2 | **Sage** | Prompting | Clever, playful, loves showing examples | Yes |
| 3 | **Max** | AI at Work | Practical, direct, gives actionable tips | Yes |
| 4 | **Nova** | AI Ethics | Thoughtful, balanced, Socratic style | Coming Soon |
| 5 | **Blake** | AI for Business | Strategic, sharp, speaks in outcomes | Coming Soon |
| 6 | **Muse** | AI Creative Tools | Enthusiastic, expressive, shows what's possible | Coming Soon |

### Curriculum Depth per Tutor

Each tutor has a **topic tree** of 15-20 conversation topics organized into 3-4 chapters. Example for Ada (AI Basics):

- **Chapter 1: What Is AI, Really?** (4 topics)
- **Chapter 2: Your First Prompts** (5 topics)
- **Chapter 3: Leveling Up** (5 topics)
- **Chapter 4: Thinking Like an AI User** (4 topics)

**Total across 6 tutors:** ~100 conversation topics.

---

## 4. Learning Model

### What Is a "Session"?

A session is a **focused conversation on one topic** within a tutor's curriculum. The tutor drives toward a learning objective.

**Session structure:**

1. **Hook** (1 message) — Tutor opens with a compelling question or scenario
2. **Teach through dialogue** (5-12 exchanges) — Socratic questioning, examples, Concept Cards
3. **Practice moments** (1-3 Quick Checks) — Mini-quizzes embedded naturally in conversation
4. **Wrap-up** (1 message) — Summary, XP award, teaser for next topic

**Session length:** 5-8 minutes. ~8-15 total messages.

### What Constitutes "Completion"?

A topic is marked complete when the user reaches the wrap-up. The tutor controls pacing. If the user leaves mid-session, the sidebar shows where they left off and the tutor resumes on return.

### Anti-Aimless Design

- Sessions have defined start and end points
- The tutor drives the conversation, not the user
- If a user goes off-topic, the tutor acknowledges and steers back
- Suggested Actions after every AI message guide users who don't know what to ask
- Soft message cap at ~20 per session — tutor wraps up gracefully

---

## 5. Gamification Adaptation

### XP System (Canonical)

| Action | XP | Notes |
|--------|----|-------|
| Complete a session | +25 | Core learning action |
| Correct Quick Check answer | +10 | Rewards active engagement |
| New concept explored | +5 | AI tags concepts covered |
| First session of the day | +5 bonus | Encourages daily habit |
| Start a new topic for first time | +10 | Rewards exploration |
| Complete all topics in a chapter | +50 bonus | Milestone reward |
| Master a topic (all concepts + checks) | +100 bonus | Major achievement |

**What does NOT earn XP:** Sending messages alone.

### Level Thresholds

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

### Streaks

A streak day is earned by **completing at least one session**. Same mechanic, new trigger.

### Daily Goal

Users set a daily goal: 1, 2, or 3 sessions per day. Default: 1.

### Badges

| Badge | Trigger |
|-------|---------|
| First Steps | Complete first session in any topic |
| Curious Mind | Chat with 3 different tutors |
| Deep Diver | 50+ messages in a single topic |
| Quiz Ace | Answer 5 Quick Checks correctly |
| On a Roll | 3-day streak |
| Week Warrior | 7-day streak |
| Concept Master | Master all concepts in any topic |
| Rising Star | Reach level 5 |
| Explorer | Try all available topics |

---

## 6. Freemium Model

### Session-Limited Free Tier

| | Free | Pro ($9.99/mo or $59.99/yr) |
|--|------|-----|
| Sessions per day | 2 | Unlimited |
| Tutors accessible | All | All |
| Gamification | Full | Full |
| Session history | Last 3 sessions per topic | Full history |
| Response speed | Standard | Priority |

**Why sessions, not messages:** Message counting creates anxiety during conversations. Sessions are the natural unit of learning.

**Upgrade trigger:** After 2nd session, tutor teases the next topic with a great hook → "Want to keep going? Pro members get unlimited sessions."

---

## 7. Success Signals

| Metric | Target (Month 1) |
|--------|------------------|
| D1 retention | >40% |
| D7 retention | >20% |
| Sessions per user per week | >3 |
| Topic completion rate | >60% |
| Quick Check engagement | >70% |
| Free-to-Pro conversion | >4% |

---

## 8. Risks and Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Conversations feel generic | High | Detailed system prompts per topic, distinct tutor personalities |
| Users treat it as a chatbot | Medium | Tutor drives conversation, session structure, gamification layer |
| Session completion feels arbitrary | Medium | Tutor signals milestones, Quick Checks serve as checkpoints, celebration overlay |
| Free tier too generous/restrictive | Medium | Start with 2/day, instrument heavily, adjust |
| SLM quality insufficient | High | Use full model (Claude Haiku) for MVP, optimize later |

---

## 9. What to Cut from Current Model

### Remove
- Discrete exercise types (Prompt Builder, Output Judge, Fill-in-the-Blank, Real-World Scenario)
- Linear lesson progression and lesson path nodes
- Static content bank (192 pre-written exercises)
- Lesson Complete screen (replaced by Session Celebration)
- Practice Tab (absorbed into chat Quick Checks)
- Badges Tab (absorbed into Profile)

### Keep and Adapt
- XP, streaks, badges, levels, daily goals — rewired to session triggers
- Onboarding quiz → now recommends a starting tutor
- Mobile-first UI, color system, animation philosophy
- Freemium model (adjusted from 3 lessons to 2 sessions)

---

## 10. Resolved Decisions

| Decision | Resolution |
|----------|-----------|
| SLM vs full model for MVP | Full model (Claude Haiku) with per-topic system prompts |
| Tutor names | Ada, Max, Sage, Nova, Blake, Muse |
| Practice moments | Conversational with inline Quick Check cards |
| Session history | Scrollable per topic, pruned at 150 messages |
| MVP scope | 3 tutors (Ada, Sage, Max), others "Coming Soon" |
| Freemium unit | 2 sessions/day (not message-based) |
| Test audience | Prototype for demo/stakeholder validation first |

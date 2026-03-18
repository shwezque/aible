# Aible UX Specification — Chat-Based Learning Model

> Version 2.0 — Pivot from exercise-based to conversational learning with specialized AI tutors
> Last updated: 2026-03-18

---

## 1. Design Philosophy

Aible is a **learning app that uses chat**, not a chat app that teaches. Every design decision reinforces this distinction.

**Core tension to resolve:** Chat is freeform; learning requires structure. The design makes freeform conversation feel guided without feeling rigid.

**Design pillars:**
- **Guided freedom** — The AI leads, but the user always has choices
- **Visible progress** — Every conversation moves a needle the user can see
- **Celebration density** — Micro-rewards every 60-90 seconds of engagement
- **One-thumb comfort** — Everything reachable in the bottom 60% of the screen

---

## 2. Navigation Model

### Bottom Tab Bar (3 tabs)

Reduced from 4 to 3 tabs. Practice merges into chat. Badges move into Profile.

| Tab | Icon | Label | Purpose |
|-----|------|-------|---------|
| 1 | GraduationCap | **Learn** | Topic selector / home dashboard |
| 2 | Flame | **Today** | Daily goal tracker, streak, XP summary |
| 3 | User | **Profile** | Stats, badges, settings, account |

**Tab bar behavior:**
- Always visible on Learn, Today, Profile screens
- **Hidden during active chat sessions** — replaced by compact top bar
- Height: 56px + safe area inset
- Active tab: purple (#7C3AED) icon + label. Inactive: gray (#9CA3AF)
- Streak flame on Today tab pulses orange when streak is active

### In-Chat Navigation: Top Bar

During chat, bottom tabs disappear. Top bar provides:
- Left: Back arrow → Learn tab (chat state preserved)
- Center: Tutor name + topic label (e.g., "Ada — AI Basics")
- Right: Three-dot overflow menu → Topic Index, End Session

### Topic Index: Slide-Up Bottom Sheet

**Not a sidebar.** A bottom sheet rising from below — avoids Slack/messaging-app feel.

- Triggered from: overflow menu in chat, or "Switch Topic" on celebration
- Rises from bottom, covers ~75% of screen height
- Shows all topic areas with progress and last-active timestamp
- Tap a topic to switch (current chat preserved in background)
- Drag down to dismiss

---

## 3. Screen Specifications

### S-01: Splash / Loading
- Aible logo centered, purple gradient background (#7C3AED → #6D28D9), subtle pulse
- Duration: 1.5s max, auto-advance
- Fade to onboarding (first launch) or Learn tab (returning user)

### S-02: Onboarding — Welcome
- **Top 40%:** Illustration of friendly AI tutor character in chat bubble
- **Center:** "Learn AI by talking about it" — 24px semibold
- **Below:** "Chat with expert AI tutors who explain things in plain English. No jargon. No coding. Just conversation." — 16px, gray-600
- **Bottom:** "Get Started" button, full-width, purple, 48px height

### S-03: Onboarding — Pick Your First Topic
- **Top:** "What are you most curious about?" — 20px semibold
- **Grid:** 2-column grid of topic cards (3 available + 3 "Coming Soon" dimmed)
- Each card: Icon, topic name (16px semibold), one-line hook (13px, gray-500), tutor's accent color bar on left edge
- Cards: 48% width, ~100px height, white bg, rounded-xl, subtle shadow
- **Bottom:** "Pick one to start — you can explore others anytime" — 13px, gray-400
- **MVP topics shown:**
  - "AI Basics" with Ada (purple) — What AI actually is and isn't
  - "Prompting" with Sage (teal) — Get better results from ChatGPT & friends
  - "AI at Work" with Max (blue) — Use AI tools in your job today
  - "AI Ethics" with Nova (rose) — Coming Soon
  - "AI for Business" with Blake (amber) — Coming Soon
  - "AI Creative Tools" with Muse (violet) — Coming Soon
- **Interaction:** Tap a card to select (purple border + checkmark), tap "Start Learning" button

### S-04: Onboarding — Quick Preferences (optional, skippable)
- "One quick thing..." — 18px semibold
- "How much do you know about AI?" — single-select: "Brand new" / "I've played with ChatGPT" / "I use AI tools regularly"
- "Skip" link in top right
- "Continue" button at bottom

### S-05: Learn Tab — Topic Dashboard (Home)

**Layout (top to bottom):**

- **Header (sticky, 64px):**
  - Left: "Aible" wordmark, 20px semibold, purple
  - Right: XP counter (star + number) and streak flame (flame + day count)

- **Continue Card (hero, 120px):**
  - Full-width, purple gradient background
  - Left: Tutor avatar (32px circle, tutor's accent color)
  - Content: "Continue: [Topic Name]" — 16px semibold white. "Last session: [time ago]" — 13px white/70%
  - Right: Arrow icon
  - Tap → S-06, resuming last conversation
  - Only shows if user has a previous session

- **Daily Goal Mini-Bar (48px):**
  - Horizontal progress bar (teal fill on gray track)
  - "1 of 2 sessions today" — 14px
  - Tap → Today tab

- **Topic Grid:**
  - Section header: "Your Topics" — 16px semibold
  - 2-column grid of topic cards
  - Each card (48% width, ~140px height):
    - Top: Topic icon/emoji (24px)
    - Name: 15px semibold
    - Tutor: "with Ada" — 12px, tutor's accent color
    - Progress ring: small circular (0-100%), teal fill
    - Subtitle: "4 of 12 concepts" — 12px, gray-500
    - Last active: "2h ago" or "New" badge (amber) — 11px
    - "Coming Soon" topics: dimmed, no progress ring, gray lock icon
  - Tap card → S-06 Chat Session

- **Empty state (first visit):** No Continue Card. Topic grid shows all with "Start" labels. Prompt: "Pick a topic and start chatting. Your AI tutor is ready."

### S-06: Chat Session (CORE SCREEN)

The primary learning interaction. **Not a generic chat interface.**

#### Top Bar (56px, sticky)
- Left: Back arrow
- Center: Tutor name + topic (e.g., "Ada — AI Basics" / 16px + 12px)
- Right: Three-dot overflow → Topic Index, End Session
- Background: white, border-bottom: 1px #E5E7EB

#### Session Progress Indicator (4px, below top bar)
- Thin horizontal bar, full width, teal fill
- Advances when user demonstrates understanding of a concept
- Discrete jumps, not continuous

#### Chat Area (fills space above input)
- Background: #F9FAFB (warm light gray — differentiates from messaging apps)
- Scroll: vertical, newest at bottom, auto-scrolls on new messages

**Message Types:**

1. **AI Tutor Message (left-aligned):**
   - Avatar: 28px circle in tutor's accent color
   - Bubble: white bg, rounded-2xl, max-width 82%, 14px padding
   - Left border: 3px in tutor's accent color
   - Text: 15px regular, gray-900, line-height 1.5
   - Typing indicator: three animated dots while AI responds

2. **User Message (right-aligned):**
   - Purple (#7C3AED) background, white text, rounded-2xl, max-width 75%

3. **Concept Card (full-width, inline):**
   - White bg, rounded-xl, 1px #E5E7EB border, 16px padding
   - "Key Concept" label in small caps, teal, 11px
   - Title: concept name, 16px semibold
   - Body: 2-3 sentence explanation, 14px, gray-600
   - Bottom: subtle teal accent line
   - Visually distinct — signals "this is important"

4. **Quick Check (full-width, interactive):**
   - Rounded-xl, 1px purple-200 border, 16px padding
   - "Quick Check" label, purple, 11px small caps
   - Question: 15px semibold
   - 2-3 answer pills: full-width, 44px height, rounded-lg, 1px gray-200 border
   - On correct: pill turns teal + checkmark + "+10 XP" float animation
   - On incorrect: pill turns amber, correct answer highlighted in teal, brief explanation

5. **XP Moment (centered, ephemeral):**
   - "+10 XP" in purple with sparkle micro-animation
   - Fades after 1.5s

6. **Suggested Actions (above input, horizontally scrollable):**
   - Pill-shaped buttons: rounded-full, 1px gray-200 border, 14px text
   - Examples: "Tell me more", "Give me an example", "How does this apply to my work?", "I don't get it", "What's next?"
   - Appear after every AI message
   - Tap sends as user message and removes the row
   - **Critical differentiator** from generic chatbots — guides users who don't know what to ask

#### Input Area (sticky bottom, ~60px)
- White bg, border-top: 1px #E5E7EB
- Text input: rounded-full, gray-100 bg, 44px height
- Placeholder: "Ask anything..."
- Send button: purple circle, 36px, white arrow — only when text entered
- Safe area padding for iOS home indicator

#### Session Opener (start of each session)
- Centered, no bubble styling
- Tutor avatar: 48px circle
- Greeting: "Hey! I'm Ada, your AI Basics tutor." — 16px semibold
- Context: "Let's pick up where we left off..." OR "Ready to explore what AI actually is?"
- "Today's goal" mini-card: 2-3 learning objectives
- Then first tutor message begins

#### Session Flow
1. Session Opener
2. Tutor's first message (contextual, resumes or introduces)
3. User responds via suggestions or typing
4. Tutor teaches with Concept Cards, asks questions
5. Quick Checks every 2-3 minutes
6. XP Moments on milestones
7. After ~5-8 minutes (or objectives met), tutor wraps up → S-07

### S-07: Session Wrap-Up / Celebration

**Phase 1 — In-Chat:**
- Tutor sends wrap-up message
- **Session Summary Card** appears: purple gradient left border, white bg
  - "Session Summary" — 14px semibold, purple
  - Bulleted concepts covered (teal checkmarks)
  - "Quick Checks: 2/2 correct"
- "Continue" or "Take a break" options

**Phase 2 — Celebration Overlay:**
- Slides up full-screen, purple gradient background
- Large XP animation: "+45 XP" with particle burst
- Streak update: "3-day streak!"
- Progress: "AI Basics: 33% complete" with progress ring animation
- Badge earned (if any): badge icon + "New Badge!" callout
- Daily goal met (if applicable): confetti
- Two buttons:
  - "Keep Going" (teal, full-width) → Learn tab
  - "Switch Topic" (outline, full-width) → Topic Index panel

### S-08: Today Tab — Daily Dashboard
- **Header:** "Today" — 24px semibold
- **Streak Card (80px):** Large flame + streak number, warm gradient bg
- **Daily Goal Progress (100px):** Large circular ring (80px), teal fill, "1/2 sessions"
- **Activity Feed:** Chronological list of today's events
  - "Completed session in AI Basics — +30 XP"
  - "Earned Quiz Ace badge"
  - If empty: "Start your first session today!"

### S-09: Profile Tab
- **Header:** Avatar (64px initials circle), name, level badge ("Level 4 — Skilled")
- **Stats Row:** Streak | Topics started | Sessions completed
- **Badges Section:** Horizontal scroll of earned badges (40px circles). Unearned: gray + lock. Tap → S-11 badge detail
- **Settings:** Notifications toggle, Daily Goal, Display Name, About, Reset Progress (red, requires confirmation)

### S-10: Topic Index Panel (Bottom Sheet)
- Bottom sheet, rounded-t-2xl, grabber handle, 75% viewport
- "Topics" header + X close button
- Vertical list of topics (72px each):
  - Left: topic icon in 40px colored circle
  - Center: topic name (16px semibold), status ("4 of 12 concepts — Last: 2h ago")
  - Right: progress mini-ring (28px) or "Start" label
  - Active topic: purple left border + "Currently in" tag
  - Coming Soon topics: dimmed with lock
- Tap → dismisses sheet, transitions to that topic's chat

### S-11: Badge Detail (Bottom Sheet)
- Small sheet (~40% viewport)
- Badge icon: 64px, centered
- Name, description, "Earned on [date]" or "How to earn: [criteria]"
- Close: tap outside or drag down

### S-12: Daily Goal Picker
- "Set Your Daily Goal" — 20px semibold
- 3 cards: "Casual — 1 session/day", "Regular — 2 sessions/day" (default, highlighted), "Ambitious — 3 sessions/day"
- "Save" button

---

## 4. First-Session Journey

**Goal: Open app → chatting with AI tutor in under 60 seconds.**

| Step | Screen | Time | Action |
|------|--------|------|--------|
| 1 | S-01 Splash | 0-2s | Auto-advance |
| 2 | S-02 Welcome | 2-8s | Tap "Get Started" |
| 3 | S-03 Pick Topic | 8-20s | Select topic, tap "Start Learning" |
| 4 | S-06 Chat | 20s+ | Conversation begins |

First tutor message is extra warm, introduces itself, asks a simple question. Suggested actions are scaffolded: "I use AI tools at work", "I've heard about it but don't really get it", "I want to use AI for my business."

---

## 5. Core Retention Loop

```
Open app
  → See streak / daily goal status (motivation)
  → Tap "Continue" on hero card (low friction)
  → Chat with tutor (value delivery)
  → Earn XP + see progress advance (reward)
  → Session wraps up with celebration (closure)
  → See daily goal progress update
  → Close app or switch topic
```

---

## 6. Gamification Integration

| Element | Earned By | Shown On |
|---------|-----------|----------|
| **XP** | Quick Check (+10), session completion (+25), new concept (+5), daily bonus (+5) | Learn header, Today tab, Profile, Celebration |
| **Streak** | 1+ sessions per day | Learn header flame, Today tab, Celebration |
| **Level** | XP thresholds | Profile, level-up in Celebration |
| **Badges** | Specific achievements | Profile, earned during Celebration |
| **Progress %** | Concepts explored per topic | Topic cards, Topic Index |
| **Daily Goal** | Session count (1, 2, or 3/day) | Learn mini-bar, Today tab |

### In-Chat Moments
- **XP Float:** "+10 XP" drifts upward, 1.2s ease-out
- **Concept Unlocked:** Teal ring pulse around Concept Card
- **Mid-Session Milestone:** At 5 concepts, brief confetti + "You're on fire!" styled message

---

## 7. Tutor Personalities

| Topic | Tutor | Personality | Color |
|-------|-------|-------------|-------|
| AI Basics | Ada | Patient, warm, analogies | #7C3AED (purple) |
| Prompting | Sage | Clever, playful, examples | #14B8A6 (teal) |
| AI at Work | Max | Practical, direct, actionable | #3B82F6 (blue) |
| AI Ethics | Nova | Thoughtful, balanced, Socratic | #F43F5E (rose) |
| AI for Business | Blake | Strategic, sharp, outcomes | #F59E0B (amber) |
| AI Creative Tools | Muse | Enthusiastic, expressive | #8B5CF6 (violet) |

Avatar, accent color, and greeting style change per tutor. Switching topics feels like meeting a different expert.

---

## 8. Visual Tone

- **Premium minimalism** — generous whitespace, clean type, no clutter
- **Warm and approachable** — rounded corners (12-16px), soft shadows, warm grays
- **Playful without childish** — animations brief and purposeful
- **Chat area distinct from messaging** — #F9FAFB background, Concept Cards, Suggested Actions make it clearly educational

### Color Application
- **Purple (#7C3AED):** Primary actions, user bubbles, XP, active states
- **Teal (#14B8A6):** Progress, Concept Cards, success, "Continue" actions
- **Green (#22C55E):** Correct Quick Check answers
- **Amber (#F59E0B):** Gentle errors, streaks
- **Gray-900 (#111827):** Primary text
- **Gray-500 (#6B7280):** Secondary text
- **White:** Cards, bubbles, surfaces

### Animation
| Context | Duration |
|---------|----------|
| Screen transitions | 200-300ms ease-out |
| XP float | 1.2s ease-out upward + fade |
| Confetti | 2s burst with gravity |
| Progress ring fill | 400ms ease-in-out |
| Chat messages | 150ms slide-up |
| Bottom sheet | 300ms spring |

---

## 9. Error States

| Scenario | Behavior |
|----------|----------|
| No internet | Amber banner below top bar: "You're offline. Reconnect to continue." Input disabled. |
| AI response slow | Typing indicator up to 10s, then "Taking a moment..." |
| All topics complete | Congratulatory state: "You've explored everything! Review any topic." |
| Daily goal met | Celebration on Today tab. Learn mini-bar: "Goal complete! Bonus XP for extras." |

---

## 10. Accessibility

- All interactive elements have accessible labels
- Color never the only state indicator (paired with icon/text)
- Quick Check options have clear selected/unselected states
- Minimum contrast: 4.5:1 body text, 3:1 large text
- Reduce motion: disable XP float, confetti, spring animations

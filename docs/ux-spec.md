# Aible — UX Specification

**Date:** 2026-03-17
**Target:** Mobile web (375px–428px). Not designed for desktop.

---

## Navigation Model

**Bottom tab bar** — 4 tabs, always visible except during lessons.

| Tab | Icon | Label | Destination |
|-----|------|-------|-------------|
| 1 | Path icon | Learn | Home / Learning Path |
| 2 | Refresh/repeat icon | Practice | Review exercises from completed lessons |
| 3 | Trophy icon | Badges | Achievement badges grid |
| 4 | Person icon | Profile | Stats, settings, subscription |

**During lessons:** Bottom nav is hidden. Full-screen takeover. Only close (X) at top-left and progress bar at top.

**Tab bar behavior:**
- Active tab: filled icon + label + primary color
- Inactive tabs: outline icon + muted color, no label
- Height: 56px + safe area inset
- Haptic feedback on tab switch (where supported)

---

## First-Session User Journey

This is the critical path. Every screen is designed to minimize friction and maximize first-lesson completion.

### Step 1: Welcome (Screen: S-01)
- Mascot + app name + tagline "Be AI-able."
- Single CTA: "Get Started"
- No signup, no login, no explanation. One tap to proceed.
- Returning users see "Welcome back" with login link below CTA.

### Step 2: Role Selection (Screen: S-02)
- "What do you do?"
- 6 large tap cards: Marketer, Freelancer, Business Owner, Creator, Student, Other
- One tap selects → auto-advances to next screen
- No "Next" button needed — selection IS the action

### Step 3: Goal Selection (Screen: S-03)
- "What's your goal?"
- 3 large tap cards: "Save time" (productivity), "Level up my career" (career), "Earn more money" (income)
- Same interaction: tap to select → auto-advance

### Step 4: Experience Level (Screen: S-04)
- "How much have you used AI?"
- 3 options: "Never tried it" (beginner), "A few times" (intermediate), "I use it regularly" (advanced)
- Tap to select → auto-advance to first lesson

### Step 5: First Lesson (Screen: S-10 series)
- Lesson starts immediately. No transition screen, no "loading your personalized path."
- First lesson is from Module 1, Lesson 1 ("What is a prompt?"), beginner difficulty
- Exercises are easy — engineered for 100% success
- 6 exercises (shorter than normal), ~2-3 minutes

### Step 6: First Celebration (Screen: S-13)
- Confetti animation, XP earned (+110 XP), mascot celebrating
- "You just learned your first AI skill!"
- Below: "You're ahead of most people. Keep going."

### Step 7: Signup Prompt (Screen: S-05)
- "Create a free account to save your progress"
- Email + password fields
- "Continue with Google" button
- "Skip for now" link (small, bottom — progress saved to localStorage temporarily)
- Progress from first lesson is preserved after signup

### Step 8: Daily Goal Selection (Screen: S-06)
- "How much do you want to learn each day?"
- 3 options with descriptions:
  - Quick (1 lesson/day) — "Perfect for busy days"
  - Steady (2 lessons/day) — "Build a solid habit" ← highlighted as recommended
  - Ambitious (3 lessons/day) — "Fast-track your skills"
- CTA: "Set my goal"

### Step 9: Home Screen (Screen: S-07)
- Learning path revealed with first lesson already completed (satisfying)
- Streak: "1" with fire icon
- Daily goal ring showing 1/2 (if Steady selected)
- Current lesson node pulsing, ready to tap

**Total journey: ~3 minutes from app open to home screen with first lesson done.**

---

## Screen Specifications

### S-01: Welcome Screen
**Purpose:** First impression + entry point
**Elements:**
- Mascot illustration (centered, upper third)
- "Aible" logo text
- "Be AI-able." tagline
- "Get Started" primary CTA button (full width, bottom)
- "I already have an account" text link (below CTA, muted)
**States:**
- Default (new user)
- Returning (show "Welcome back, [name]" + "Continue" CTA + "Switch account" link)
**Maps to:** F1 (Onboarding)

### S-02: Role Selection
**Purpose:** Personalize content framing
**Elements:**
- "What do you do?" header
- 6 option cards in 2-column grid (icon + label each)
- Progress dots (1 of 3 filled)
**Interaction:** Tap card → brief highlight animation → auto-advance (300ms delay)
**Maps to:** F1, F6 (Onboarding, Adaptive Curriculum)

### S-03: Goal Selection
**Purpose:** Set motivation context
**Elements:**
- "What's your goal?" header
- 3 option cards (full width, stacked): icon + title + subtitle
- Progress dots (2 of 3 filled)
**Interaction:** Same as S-02 — tap → highlight → auto-advance
**Maps to:** F1

### S-04: Experience Level
**Purpose:** Set starting difficulty tier + path position
**Elements:**
- "How much have you used AI?" header
- 3 option cards (full width, stacked): emoji + title + description
  - "Never tried it" → starts at Module 1, Lesson 1, beginner tier
  - "A few times" → starts at Module 1, Lesson 3, intermediate tier
  - "I use it regularly" → starts at Module 2, Lesson 1, advanced tier
- Progress dots (3 of 3 filled)
**Interaction:** Tap → transition directly into first lesson
**Maps to:** F1, F6

### S-05: Signup Screen
**Purpose:** Account creation (shown after first lesson)
**Elements:**
- "Create a free account to save your progress" header
- Email input field
- Password input field
- "Create Account" primary CTA
- Divider: "or"
- "Continue with Google" button (Google logo)
- "Skip for now" text link (bottom, muted)
**States:**
- Default (signup mode)
- Login mode (toggle via "I already have an account" link — swaps to email + password + "Log in" CTA + "Forgot password?" link)
- Error: invalid email, password too short, account exists
- Loading: button shows spinner during auth
**Maps to:** F2

### S-06: Daily Goal Selection
**Purpose:** Set daily lesson target
**Elements:**
- "How much do you want to learn each day?" header
- 3 option cards (full width):
  - Quick: "1 lesson/day — Perfect for busy days"
  - Steady: "2 lessons/day — Build a solid habit" (highlighted border, "Recommended" tag)
  - Ambitious: "3 lessons/day — Fast-track your skills"
- "Set my goal" primary CTA (bottom)
**Maps to:** F5

### S-07: Home Screen (Learn Tab)
**Purpose:** Primary screen. Shows learning path, daily status, and next lesson.
**Layout (top to bottom):**
- **Status bar area:** Streak (fire icon + number, left), XP total (star icon + number, center), Daily goal ring (right)
- **Module header:** Current module name + progress (e.g., "Prompt Foundations — 1/6")
- **Learning path:** Vertical winding path of lesson nodes
  - Completed nodes: primary color fill + checkmark
  - Current node: larger, pulsing glow, mascot sitting on it
  - Locked nodes: gray fill + lock icon
  - Module dividers: horizontal line + module name label
- **Tap current node → starts lesson**

**States:**
- Default: path with progress
- Daily goal met: celebratory banner at top ("Goal reached!")
- All lessons for today done (free tier): "Come back tomorrow for more" message or upgrade CTA
- Empty (first visit pre-lesson): path with all nodes locked except first
**Maps to:** F3, F5, F9

### S-08: Practice Tab
**Purpose:** Review exercises from completed lessons
**Elements:**
- "Practice" header
- List of completed modules/lessons available for review
- Each item shows: lesson title, concept, "Practice" button
- Mascot with encouraging message if no completed lessons yet
**States:**
- Default: list of available practice sets
- Empty: "Complete your first lesson to unlock practice!" + mascot
**Maps to:** F4 (extends lesson player to review mode)

### S-09: Badges Tab
**Purpose:** Achievement display and motivation
**Elements:**
- "Achievements" header
- Grid of badge slots (3 columns)
- Earned badges: full color + name below
- Unearned badges: gray silhouette + "???" or hint text
- Tap earned badge → detail modal (badge name, date earned, description)
**States:**
- Default: mix of earned and unearned
- Empty (new user): all gray with "Complete lessons to earn badges"
**Maps to:** F5

### S-10: Lesson Player — Exercise Screen
**Purpose:** Core learning interaction (one exercise at a time)
**Layout:**
- **Top bar:** Close (X) button left, progress bar center (fills left to right)
- **Content area:** Exercise content (varies by type — see below)
- **Bottom area:** "Check" button (full width, pinned to bottom). Disabled until answer selected.

#### Exercise Type: Prompt Builder
- Instruction text: "Arrange these into an effective prompt"
- Scattered prompt component chips (draggable): Role, Context, Task, Format
- Drop zone: outlined area where chips snap into order
- Chips are large (56px height), easy to drag with thumb

#### Exercise Type: Output Judge
- Instruction text: "Which output is better?"
- Two cards (stacked vertically, ~40% height each): Output A and Output B
- Each card shows a simulated AI response
- Tap a card to select → border highlights → "Check" enables
- After check: winning card gets green border, explanation appears below

#### Exercise Type: Fill-in-the-Blank
- Instruction text: "Complete this prompt"
- Prompt template with highlighted blank(s)
- Word bank below: 4-6 option chips (tap to select, tap again to deselect)
- Selected chip fills into the blank

#### Exercise Type: Real-World Scenario
- Scenario description (2-3 sentences, realistic work situation)
- "What's the best approach?" header
- 3-4 option cards (text only, tap to select)
- Single-select — tap one → border highlights → "Check" enables

**Maps to:** F4

### S-11: Lesson Player — Feedback Overlay
**Purpose:** Immediate response after checking an answer
**Behavior:** Slides up from bottom, covers lower 30% of screen

**Correct answer:**
- Green background
- "Great job!" / "Exactly!" / "You got it!" (rotating encouragement)
- Brief explanation (1 sentence) of why it's correct
- "Continue" button (green)
- Micro-celebration: screen flash green (0.3s), success sound

**Incorrect answer:**
- Soft amber/orange background (NOT harsh red)
- "Not quite — here's why" header
- Correct answer shown
- Explanation (1-2 sentences)
- "Got it" button (neutral)
- Gentle shake animation on the wrong answer, soft error sound
- Tone: curious and helpful, never judgmental

**Maps to:** F4

### S-12: Lesson Player — Concept Intro Card
**Purpose:** Introduce the lesson concept before exercises begin
**Elements:**
- Concept title: "Adding Context to Prompts"
- Mascot illustration (small)
- 2-3 sentence explanation with a before/after example
- "Let's practice!" CTA button
**Behavior:** First screen in every lesson. Tap to proceed to exercises.
**Maps to:** F4

### S-13: Lesson Complete Screen
**Purpose:** Celebrate lesson completion and show earnings
**Elements:**
- Confetti animation (2-3 seconds)
- Mascot celebrating
- "Lesson Complete!" header
- XP earned breakdown: exercises (e.g., +80 XP) + completion bonus (+50 XP) + perfect bonus (+20 XP if applicable)
- Total XP with counting animation
- Concept summary: "You learned: [concept name]"
- Accuracy: "8/8 correct" (green) or "6/8 correct" (neutral)
- "Continue" button → returns to home (or next lesson if daily goal not met)
**States:**
- Normal completion
- Perfect lesson (extra celebration, "Perfect!" badge flash)
- Daily goal met (additional "Daily goal reached!" banner)
- Streak milestone (additional streak badge animation after main celebration)
**Maps to:** F4, F5

### S-14: Paywall Screen
**Purpose:** Convert free users to Pro
**Trigger:** After 3rd lesson completion in a day (free tier)
**Elements:**
- "You've completed your free lessons today" header
- Mascot with encouraging expression
- Feature comparison:
  - Free: 3 lessons/day, 1 streak freeze/week
  - Pro: Unlimited lessons, unlimited freezes, all badges, advanced content
- Plan cards:
  - Monthly: $9.99/month
  - Annual: $59.99/year ($4.99/mo) — highlighted "Best Value" + "Save 50%" tag
- "Start 7-day free trial" CTA (for annual plan)
- "Maybe later" text link (bottom, muted) → returns to home
**States:**
- Default (first time seeing paywall)
- Returning (user has seen before — show "Pick up where you left off" copy)
**Maps to:** F7

### S-15: Profile Screen
**Purpose:** User stats, settings, subscription management
**Layout (scrollable):**
- **Header:** Avatar (initials circle), name, level badge
- **Stats row:** Total XP | Current streak | Lessons completed | Current level
- **Streak calendar:** 7-day row showing completed/missed days this week
- **Settings section:**
  - Daily goal (tap to change)
  - Streak freeze status ("1 freeze available" or "Freeze active")
  - Account (email display)
  - Subscription (Free/Pro status, manage link → Stripe portal)
  - Log out
**States:**
- Free user: shows "Upgrade to Pro" card in settings
- Pro user: shows "Pro Member" badge + manage subscription link
**Maps to:** F2, F5, F7

### S-16: Streak Milestone Modal
**Purpose:** Celebrate streak achievements
**Trigger:** Reaching 3, 7, 14, 30, 50, or 100 day streak
**Elements:**
- Overlay modal with semi-transparent backdrop
- Large streak number with fire animation
- Milestone badge (unique per milestone)
- "X-day streak!" header
- Mascot celebrating
- "Keep it going!" CTA → dismiss
**Maps to:** F5

### S-17: Streak Freeze Notification
**Purpose:** Inform user their streak was saved
**Trigger:** User returns after missing a day with a freeze available
**Elements:**
- Banner at top of home screen (dismissible)
- "Your streak freeze saved your X-day streak yesterday!"
- Ice/shield icon
**Maps to:** F5

---

## Core Interaction Loop

The daily engagement loop that drives retention:

```
Open app (triggered by habit / streak anxiety)
    → See home screen (streak, daily goal progress, current lesson node)
    → Tap current lesson node
    → Complete lesson (3-5 min, one exercise per screen)
    → Celebration screen (XP, progress)
    → Return to home (path advances, goal ring updates)
    → If daily goal not met → "One more?" prompt → next lesson
    → If daily goal met → celebration banner → close app satisfied
    → If free tier limit hit → paywall → upgrade or return tomorrow
```

**Session target:** 4-7 minutes total (including transitions and celebrations)

---

## Visual Tone Direction

### Personality
- **Energetic but not childish** — Duolingo's fun factor with Brilliant's sophistication
- **Encouraging, never judgmental** — wrong answers are learning moments
- **Slightly playful** — the mascot adds warmth without being cartoonish
- **Clean and spacious** — generous whitespace, nothing feels cluttered

### Color System
| Role | Color | Usage |
|------|-------|-------|
| Primary | Vibrant purple (#7C3AED) | Buttons, active states, path nodes, brand accent |
| Secondary | Warm teal (#14B8A6) | Secondary actions, progress indicators |
| Success | Green (#22C55E) | Correct answers, completed states |
| Error | Soft amber (#F59E0B) | Incorrect answers (NOT red — less punitive) |
| XP / Achievement | Gold (#F59E0B) | XP displays, achievement badges, celebrations |
| Streak | Orange-red (#EF4444) | Streak fire icon, streak-related UI |
| Background | White (#FFFFFF) | Primary background |
| Surface | Light gray (#F8FAFC) | Cards, input areas |
| Text primary | Near-black (#0F172A) | Headers, body text |
| Text secondary | Gray (#64748B) | Captions, hints, secondary info |

### Typography
- Headers: Bold, 24-32px
- Body: Regular, 16-18px
- Captions: Regular, 14px
- All text: High contrast, readable at arm's length

### Mascot
- Appears in: welcome screen, lesson intros, feedback, celebrations, empty states, streak notifications
- Has emotional states: encouraging (default), celebrating (correct/completion), curious (lesson intro), gentle nudge (incorrect), excited (milestone)
- Style: Simple, geometric, modern — not a cartoon animal. Consider a friendly abstract character (spark, orb, or minimal robot) that represents AI helpfulness.
- Should work at small sizes (32px in-line) and large sizes (120px hero illustrations)

### Motion
| Context | Animation | Duration |
|---------|-----------|----------|
| Screen transitions | Slide left (forward), slide right (back) | 250ms |
| Button press | Scale down to 0.97, back to 1 | 100ms |
| Correct answer | Green flash overlay | 300ms |
| Incorrect answer | Gentle horizontal shake | 300ms |
| Lesson complete | Confetti burst + XP count-up | 2000ms |
| Streak milestone | Fire/glow pulse + badge reveal | 3000ms |
| Progress bar fill | Smooth ease-out | 400ms |
| Tab switch | Crossfade | 200ms |
| Node pulse (current lesson) | Scale 1→1.1→1, repeating | 2000ms loop |

---

## Empty, Error, and Loading States

### Empty States
| Screen | Empty State |
|--------|------------|
| Practice tab | Mascot + "Complete your first lesson to unlock practice!" |
| Badges tab | Gray badge grid + "Complete lessons to earn badges" |
| Streak (day 0) | Fire icon grayed out + "Complete a lesson to start your streak" |

### Error States
| Scenario | Handling |
|----------|---------|
| Network error during lesson | "Oops, connection lost. Your progress is saved." + "Try again" button |
| Auth failure | Inline error below field: "That email is already registered" / "Incorrect password" |
| Payment failure | "Payment didn't go through. Try again or use a different card." |
| Lesson data fails to load | "Couldn't load this lesson. Tap to retry." + mascot with confused expression |

### Loading States
| Context | Treatment |
|---------|-----------|
| App launch | Splash screen with logo + mascot (max 2s) |
| Lesson loading | Skeleton of exercise screen (gray placeholder blocks) |
| Auth processing | Button shows inline spinner, disabled state |
| Payment processing | Full-screen spinner + "Processing your upgrade..." |

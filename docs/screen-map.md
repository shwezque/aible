# Aible Screen Map — Chat-Based Learning Model

> Version 2.0 — 2026-03-18

---

## Screen Inventory

### New Screens
| ID | Screen | Type |
|----|--------|------|
| S-06 | Chat Session | Core screen (complete redesign) |
| S-07 | Session Wrap-Up / Celebration | Overlay |
| S-10 | Topic Index Panel | Bottom sheet |

### Modified Screens
| ID | Screen | What Changed |
|----|--------|-------------|
| S-02 | Onboarding — Welcome | Copy updated for chat model |
| S-03 | Onboarding — Pick Topic | Topic grid replaces path selection |
| S-05 | Learn Tab — Topic Dashboard | Topic cards + continue hero replaces path nodes |
| S-08 | Today Tab | New daily dashboard (replaces Practice Tab position) |
| S-09 | Profile Tab | Badges section added (absorbed from old Badges tab) |

### Removed Screens
| Old ID | Screen | Reason |
|--------|--------|--------|
| S-07 (old) | Home Learning Path | → S-05 Topic Dashboard |
| S-10 (old) | Lesson Player | → S-06 Chat Session |
| S-11 (old) | Feedback Overlay | → In-chat Quick Check flow |
| S-12 (old) | Concept Intro Card | → In-chat Concept Cards |
| S-13 (old) | Lesson Complete | → S-07 Session Celebration |
| — | Practice Tab | Absorbed into chat Quick Checks |
| — | Badges Tab | Moved into Profile tab |

---

## Screen Hierarchy

```
App Root
├── First Launch Flow
│   ├── S-01  Splash
│   ├── S-02  Welcome
│   ├── S-03  Pick Topic
│   ├── S-04  Preferences (optional)
│   └── S-06  Chat Session (first session)
│
├── Tab: Learn (S-05)
│   ├── S-05  Topic Dashboard
│   │   ├── [Tap Continue Card] → S-06 Chat (resume)
│   │   └── [Tap Topic Card] → S-06 Chat (topic-specific)
│   │
│   └── S-06  Chat Session (tabs hidden)
│       ├── Concept Cards (inline)
│       ├── Quick Checks (inline)
│       ├── XP Moments (inline)
│       ├── Suggested Actions (inline)
│       ├── [Overflow] → S-10 Topic Index
│       ├── [Overflow] → End Session → S-07
│       └── [Session complete] → S-07 Celebration
│           ├── [Keep Going] → S-05
│           └── [Switch Topic] → S-10
│
├── Tab: Today (S-08)
│   └── S-08  Daily Dashboard
│
└── Tab: Profile (S-09)
    ├── S-09  Profile
    │   ├── [Tap badge] → S-11 Badge Detail
    │   └── [Tap Daily Goal] → S-12 Goal Picker
    └── S-11  Badge Detail (bottom sheet)
```

---

## Navigation Flows

### Flow 1: Returning User — Continue Learning
```
App Open → S-05 Learn Tab
  → Tap Continue Card
  → S-06 Chat (resumes last topic)
    → Tutor: "Welcome back! Last time we covered X..."
    → Conversation + Concept Cards + Quick Checks
    → Session objectives met
  → S-07 Celebration
  → "Keep Going" → S-05 (updated progress)
```

### Flow 2: New User — First Session
```
S-01 Splash → S-02 Welcome → S-03 Pick Topic
  → Select topic, tap "Start Learning"
  → S-06 Chat (cold start)
    → Session Opener with tutor intro
    → First Concept Card (~1 min in)
    → First Quick Check (~2 min in)
    → Session wraps up (~5-8 min)
  → S-07 Celebration ("First Steps" badge earned)
  → S-05 Learn Tab (populated with progress)
```

### Flow 3: Topic Switching
```
S-06 Chat (Topic A)
  → Three-dot menu → "Topic Index"
  → S-10 Bottom Sheet slides up
  → Tap Topic B
  → Sheet dismisses
  → S-06 cross-fades to Topic B
    → Has history: resumes with "Welcome back!"
    → New topic: Session Opener appears
```

### Flow 4: Early Session End
```
S-06 Chat → Three-dot → "End Session"
  → Confirmation: "End session? Progress saved."
  → "End" → Tutor sends brief summary
  → S-07 Celebration (scaled to actual progress)
  → S-05 Learn Tab
```

---

## Bottom Sheet Inventory

| Sheet | Trigger | Height |
|-------|---------|--------|
| Topic Index (S-10) | Overflow menu, "Switch Topic" on celebration | 75% |
| Badge Detail (S-11) | Tap badge on Profile | 40% |
| End Session Confirm | "End Session" in overflow | 25% |
| Overflow Menu | Three-dot in chat top bar | Auto |

---

## Tab Bar Visibility

| Context | Tab Bar |
|---------|---------|
| Learn, Today, Profile | Visible |
| Chat Session (S-06) | **Hidden** |
| Celebration (S-07) | **Hidden** |
| Onboarding (S-01-04) | **Hidden** |
| Bottom Sheets | Dimmed behind |

---

## Chat Message Type Reference

| Type | Style | Interactive | Trigger |
|------|-------|-------------|---------|
| AI Message | White bubble, left-aligned, avatar, accent border | No | AI response |
| User Message | Purple bubble, right-aligned | No | User input |
| Concept Card | Full-width card, teal accent, "Key Concept" | No | AI introduces concept |
| Quick Check | Full-width card, purple accent, tappable pills | **Yes** | AI tests understanding |
| XP Moment | Centered float, sparkle animation | No | Correct answer, milestone |
| Session Opener | Centered card, avatar, goals | No | Session start |
| Session Summary | Full-width card, purple border, checklist | No | Session end |
| Suggested Actions | Horizontal pill row above input | **Yes** | After every AI message |

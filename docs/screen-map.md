# Aible — Screen Map

**Date:** 2026-03-17
**Total screens:** 17

---

## Screen Inventory

| ID | Screen Name | PRD Feature | Tab/Context |
|----|------------|-------------|-------------|
| S-01 | Welcome | F1 Onboarding | Entry |
| S-02 | Role Selection | F1, F6 | Onboarding flow |
| S-03 | Goal Selection | F1 | Onboarding flow |
| S-04 | Experience Level | F1, F6 | Onboarding flow |
| S-05 | Signup / Login | F2 Auth | Post-first-lesson |
| S-06 | Daily Goal Selection | F5 Gamification | Onboarding flow |
| S-07 | Home (Learning Path) | F3, F5, F9 | Learn tab |
| S-08 | Practice | F4 | Practice tab |
| S-09 | Badges | F5 | Badges tab |
| S-10 | Lesson Exercise | F4, F8 | Lesson player |
| S-11 | Feedback Overlay | F4 | Lesson player |
| S-12 | Concept Intro Card | F4 | Lesson player |
| S-13 | Lesson Complete | F4, F5 | Lesson player |
| S-14 | Paywall | F7 | Modal/fullscreen |
| S-15 | Profile | F2, F5, F7 | Profile tab |
| S-16 | Streak Milestone Modal | F5 | Modal overlay |
| S-17 | Streak Freeze Notification | F5 | Home banner |

---

## Flow Connections

### Flow 1: First-Session (New User)

```
S-01 Welcome
  │
  ├─ "Get Started" →
  │
  S-02 Role Selection
  │  (tap any option)
  │
  S-03 Goal Selection
  │  (tap any option)
  │
  S-04 Experience Level
  │  (tap any option)
  │
  S-12 Concept Intro Card (first lesson)
  │  "Let's practice!"
  │
  S-10 Exercise Screen (×6 exercises)
  │  └─ S-11 Feedback Overlay (after each "Check")
  │
  S-13 Lesson Complete
  │  "Continue"
  │
  S-05 Signup / Login
  │  ├─ Create account → S-06 Daily Goal → S-07 Home
  │  ├─ Google login → S-06 Daily Goal → S-07 Home
  │  └─ Skip for now → S-06 Daily Goal → S-07 Home
```

### Flow 2: Returning User (Daily Session)

```
S-01 Welcome ("Welcome back")
  │  "Continue"
  │
  S-07 Home (Learning Path)
  │  ├─ Streak freeze banner (S-17) if applicable
  │  │
  │  (tap current lesson node)
  │
  S-12 Concept Intro Card
  │  "Let's practice!"
  │
  S-10 Exercise Screen (×6-10 exercises)
  │  └─ S-11 Feedback Overlay (after each "Check")
  │
  S-13 Lesson Complete
  │  ├─ If streak milestone → S-16 Streak Modal → S-07 Home
  │  ├─ If daily goal not met → S-07 Home (goal ring updated)
  │  ├─ If daily goal met → S-07 Home (celebration banner)
  │  └─ If free tier limit (3 lessons) → S-14 Paywall
  │       ├─ Upgrade → Stripe Checkout → S-07 Home (Pro)
  │       └─ "Maybe later" → S-07 Home
```

### Flow 3: Lesson (Core Loop Detail)

```
S-12 Concept Intro Card
  │  "Let's practice!"
  │
  ┌──────────────────────────────┐
  │  S-10 Exercise Screen        │
  │  (exercise 1 of N)           │
  │                              │
  │  User selects answer         │
  │  Taps "Check"                │
  │       │                      │
  │  S-11 Feedback Overlay       │
  │  (correct or incorrect)      │
  │  Taps "Continue" / "Got it"  │
  │       │                      │
  │  Progress bar advances       │
  │  Next exercise loads         │
  └──────────────────────────────┘
       (repeat for all exercises)
            │
  S-13 Lesson Complete
```

### Flow 4: Tab Navigation (Authenticated User)

```
  ┌──────────┬──────────┬──────────┬──────────┐
  │  Learn   │ Practice │  Badges  │ Profile  │
  │  (S-07)  │  (S-08)  │  (S-09)  │  (S-15)  │
  └──────────┴──────────┴──────────┴──────────┘

  S-07 Home ←→ S-08 Practice ←→ S-09 Badges ←→ S-15 Profile
  (any tab accessible from any other tab via bottom nav)
```

### Flow 5: Paywall → Upgrade

```
S-14 Paywall
  │
  ├─ "Start 7-day free trial" (annual)
  │   → Stripe Checkout (external)
  │   → Success → S-07 Home (Pro badge visible)
  │   → Failure → S-14 Paywall (error state)
  │
  ├─ Monthly plan
  │   → Stripe Checkout (external)
  │   → Success → S-07 Home (Pro badge visible)
  │   → Failure → S-14 Paywall (error state)
  │
  └─ "Maybe later"
      → S-07 Home
```

### Flow 6: Profile → Manage Subscription

```
S-15 Profile
  │
  ├─ "Upgrade to Pro" (free user) → S-14 Paywall
  ├─ "Manage Subscription" (pro user) → Stripe Customer Portal (external)
  ├─ "Daily Goal" → inline picker (Quick/Steady/Ambitious)
  └─ "Log Out" → S-01 Welcome
```

---

## Feature-to-Screen Traceability

Every PRD feature maps to at least one screen. Every screen maps to at least one feature.

| PRD Feature | Screens |
|-------------|---------|
| F1: Onboarding | S-01, S-02, S-03, S-04 |
| F2: Authentication | S-05, S-15 |
| F3: Learning Path | S-07 |
| F4: Lesson Player | S-10, S-11, S-12, S-13, S-08 |
| F5: Gamification | S-06, S-07, S-09, S-13, S-15, S-16, S-17 |
| F6: Adaptive Curriculum | S-02, S-04 (inputs), S-10 (output — difficulty varies) |
| F7: Payments | S-14, S-15 |
| F8: Lesson Content | S-10, S-12 (content rendered here) |
| F9: Mobile-First UI | All screens |

---

## Screen Count by Context

| Context | Screens | Count |
|---------|---------|-------|
| Onboarding flow | S-01, S-02, S-03, S-04, S-05, S-06 | 6 |
| Main tabs | S-07, S-08, S-09, S-15 | 4 |
| Lesson player | S-10, S-11, S-12, S-13 | 4 |
| Modals / overlays | S-14, S-16, S-17 | 3 |
| **Total** | | **17** |

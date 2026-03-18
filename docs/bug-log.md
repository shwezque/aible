# Aible — Bug Log

**Date:** 2026-03-18
**Reviewer:** Orchestrator + QA agents (verified against source)

---

## P1 — Should Fix Before Sharing

### BUG-01: Streak dates use UTC instead of local time
**File:** [useStore.js:7-9](app/src/store/useStore.js#L7-L9)
**Details:** `getToday()` uses `new Date().toISOString().slice(0, 10)` which returns UTC date. A user completing a lesson at 11pm EST gets tomorrow's UTC date, which breaks streak continuity — the system thinks they skipped a day.
**Impact:** Streaks unreliable for any user not in UTC timezone. Undermines core gamification.
**Fix:** Replace with `new Date().toLocaleDateString('en-CA')` which returns local YYYY-MM-DD.

### BUG-02: Replaying lessons via Practice awards duplicate XP and inflates stats
**File:** [useStore.js:97](app/src/store/useStore.js#L97), [Practice.jsx:41](app/src/screens/Practice.jsx#L41)
**Details:** `completeLesson` always pushes `lessonId` to `completedLessons` without checking for duplicates: `const newCompleted = [...prev.completedLessons, lessonId]`. Replaying a lesson via Practice awards full XP again and inflates the completedLessons array, which affects badge triggers (e.g., "AI Explorer" at 10 lessons counts replays).
**Impact:** Users can farm unlimited XP. Lesson count and badge progress are inflated.
**Fix:** Deduplicate: `const newCompleted = prev.completedLessons.includes(lessonId) ? prev.completedLessons : [...prev.completedLessons, lessonId]`. For practice replays, either skip XP entirely or award reduced XP.

### BUG-03: Streak freeze is never consumed
**File:** [useStore.js:109-114](app/src/store/useStore.js#L109-L114)
**Details:** When the streak freeze saves the streak (line 109-111), the code increments the streak but doesn't set `streakFreezeAvailable: false` or `streakFreezeUsedThisWeek: true`. The freeze is never consumed, making it infinite. Additionally:
- The freeze only fires during `completeLesson`, not on app open. If a user opens the app after missing a day but doesn't complete a lesson, the streak isn't protected.
- `streakFreezeUsedThisWeek` has no weekly reset logic.
**Impact:** Freeze mechanic is non-functional as designed. Either infinite (never consumed) or doesn't trigger (app open without lesson).
**Fix:** (1) Set `streakFreezeAvailable: false` and `streakFreezeUsedThisWeek: true` when freeze is consumed. (2) Move streak continuity check to `loadState` so it fires on app open. (3) Add weekly reset of `streakFreezeUsedThisWeek`.

### BUG-04: Free tier limit bypassable via direct URL
**File:** [useStore.js:92](app/src/store/useStore.js#L92), [Home.jsx:20-27](app/src/screens/Home.jsx#L20-L27)
**Details:** The `canPlayLesson` guard exists in the Home screen's `handleLessonTap` but not in the Lesson screen itself. A user could navigate directly to `/lesson/lesson-2-1` after hitting the daily limit and complete it without the paywall blocking.
**Impact:** Low for prototype demo (users won't type URLs), but the monetization gate has no server-side enforcement.
**Fix:** Add a guard at the top of the Lesson component: if `!canPlayLesson && !completedLessons.includes(lessonId)`, redirect to `/paywall`.

---

## P2 — Nice to Have Before Sharing

### BUG-05: Badge detail modal missing
**File:** [Badges.jsx:28-48](app/src/screens/Badges.jsx#L28-L48)
**Details:** Spec says "Tap earned badge → detail modal (badge name, date earned, description)." Earned badges have a `whileTap` scale animation but no `onClick` handler and no modal component. Tapping does nothing functional.
**Fix:** Add a simple modal that shows badge name, icon, description, and earned date.

### BUG-06: "You learned: {concept name}" missing from LessonComplete
**File:** [LessonComplete.jsx](app/src/screens/LessonComplete.jsx)
**Details:** Spec requires "Concept summary: 'You learned: [concept name]'" on every lesson completion. The first-lesson variant shows "You just learned your first AI skill!" but regular completions show no concept name.
**Fix:** Pass the lesson concept through state/params and render "You learned: {concept}" below the header.

### BUG-07: Onboarding subheader missing
**File:** [Onboarding.jsx:66](app/src/screens/Onboarding.jsx#L66)
**Details:** Copy deck specifies subheader "We'll personalize your lessons." under "What do you do?" on the role selection step. The StepContent component only renders the title, no subheader.
**Fix:** Add subtitle prop to StepContent, pass "We'll personalize your lessons." for step 0.

### BUG-08: Module progress count missing from Home headers
**File:** [Home.jsx:108-116](app/src/screens/Home.jsx#L108-L116)
**Details:** Spec says module header should show "Prompt Foundations — 1/6" with progress count. Current implementation only shows the module title.
**Fix:** Count completed lessons per module and display "{title} — {completed}/{total}".

---

## Not Bugs (Agent False Positives — Verified Correct)

These items were flagged by QA agents but confirmed correct in the source:

| Claim | Reality |
|-------|---------|
| Onboarding goes to signup, not first lesson | Onboarding.jsx:38 navigates to `/lesson/${lesson.id}` |
| "I already have an account" link missing | Welcome.jsx:65-70 has the link |
| Auto-advance is 500ms not 300ms | Onboarding.jsx:47 uses 300ms |
| Only 4 role options | constants.js has all 6 roles |
| 4 goal options instead of 3 | constants.js has exactly 3 goals |
| Tab bar visible during lessons | Lesson route is outside Layout (App.jsx:22 vs 27-32) |
| Concept intro card missing | Lesson.jsx:104-111 + ConceptIntro component at line 168 |
| PromptBuilder always marks wrong | Line 28 correctly maps indices to strings before comparing |
| FillBlank has no deselect | FillBlank.jsx:10-21 handles tap-to-deselect |
| Incorrect feedback uses red | CSS error color = #F59E0B (amber), text uses amber-600 |
| Incorrect button says "Continue" | Lesson.jsx:157 uses "Got it" for incorrect |
| Feedback has no slide animation | Lesson.jsx:138 uses motion y:100→0 spring |
| Perfect bonus is 25 not 20 | constants.js:75 XP_PERFECT_BONUS = 20 |
| Daily counter never resets | useStore.js:47-50 resets on load if new day |
| Logout doesn't redirect | Profile.jsx:19 navigates to "/" |
| Correct/incorrect feedback copy wrong | constants.js:60-71 matches spec exactly |

---

## Summary

| Priority | Count | Items |
|----------|-------|-------|
| P1 | 4 | UTC dates, XP farming, streak freeze, URL bypass |
| P2 | 4 | Badge modal, concept summary, onboarding subheader, module progress |
| **Total** | **8** | |

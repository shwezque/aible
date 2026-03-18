# Aible — QA Checklist

**Date:** 2026-03-18
**Reviewer:** Orchestrator + QA agents (verified)
**App version:** Prototype v1 (localStorage, simulated auth/payments)

---

## 1. Onboarding Flow

| Check | Status | Notes |
|-------|--------|-------|
| S-01 Welcome: mascot + "Aible" + "Be AI-able." | PASS | Animated mascot placeholder (✨), correct tagline |
| S-01: "Get Started" CTA | PASS | Correct copy, full-width button |
| S-01: "I already have an account" link | PASS | Below CTA, navigates to /signup |
| S-01: Returning user "Welcome back, {name}" | PASS | Checks `onboarded && name`, shows name and "Continue" CTA |
| S-01: Returning user routes to Home | PASS | Routes based on state: dailyGoalSet → home, firstLessonDone → signup, onboarded → home |
| S-02: "What do you do?" + 6 role cards | PASS | 6 roles in 2-column grid matching spec |
| S-02: Progress dots (1/3) | PASS | 3 dots, current + previous filled |
| S-02: Auto-advance 300ms | PASS | setTimeout 300ms confirmed |
| S-03: "What's your goal?" + 3 cards | PASS | 3 goals matching spec copy |
| S-04: "How much have you used AI?" + 3 cards | PASS | 3 levels with correct copy and start positions |
| S-04: Auto-advance to first lesson | PASS | Navigates to `/lesson/${lesson.id}` |
| After first lesson → signup → daily goal → home | PASS | LessonComplete routes correctly based on state |
| Missing: subheader "We'll personalize your lessons." | FAIL | See BUG-07 (P2) |

## 2. Lesson Player

| Check | Status | Notes |
|-------|--------|-------|
| Full-screen takeover — no bottom nav | PASS | Lesson route is outside Layout wrapper |
| Concept intro card with "Let's practice!" | PASS | ConceptIntro component with before/after example |
| Top bar: X close + progress bar | PASS | Shown during exercises, hidden during intro |
| Progress bar animates smoothly | PASS | Framer motion, ease-out 400ms |
| One exercise per screen | PASS | Single exercise rendered per phase |
| "Check" button full-width, disabled until answer | PASS | All 4 exercise types implement correctly |
| Prompt Builder: tap-to-arrange + remove | PASS | Place and remove chips, correctOrder maps indices to strings |
| Output Judge: A/B cards, tap to select | PASS | Two stacked cards with selection highlight |
| Fill-in-the-Blank: word bank, tap select/deselect | PASS | Tap used word to deselect and return to bank |
| Real-World Scenario: multiple choice | PASS | Single select option cards |
| Feedback overlay slides up from bottom | PASS | motion.div with y:100→0 spring animation |
| Correct: green background + rotating encouragement | PASS | bg-success/10, all 10 spec messages present |
| Incorrect: amber/orange (NOT red) | PASS | bg-error/10 where error=#F59E0B (amber), text-amber-600 |
| Incorrect button: "Got it" | PASS | Line 157: `isCorrect ? 'Continue' : 'Got it'` |
| Correct button: "Continue" | PASS | Correct |

## 3. Lesson Complete (S-13)

| Check | Status | Notes |
|-------|--------|-------|
| Confetti animation | PASS | Confetti component renders |
| "Lesson Complete!" header | PASS | Correct copy |
| XP breakdown: exercises + completion + perfect | PASS | Shows per-exercise (×10), +50 bonus, +20 perfect |
| Total XP with animation | PASS | Scale pulse animation on total |
| Accuracy: "X/Y correct" | PASS | Score/total display |
| "Perfect!" badge flash | PASS | Shows 💎 Perfect! when score === total |
| "Daily goal reached!" banner | PASS | Shows when dailyGoalMet |
| Streak milestone display | PASS | Shows streak headline + subtext from constants |
| First lesson: "You just learned your first AI skill!" | PASS | Shown when completedLessons.length === 1 |
| Missing: "You learned: {concept name}" | FAIL | See BUG-06 (P1) |

## 4. Gamification Logic

| Check | Status | Notes |
|-------|--------|-------|
| XP: 10 per exercise | PASS | XP_PER_EXERCISE = 10 |
| XP: +50 completion bonus | PASS | XP_LESSON_BONUS = 50 |
| XP: +20 perfect bonus | PASS | XP_PERFECT_BONUS = 20 |
| Streaks: increment on consecutive days | PASS | Checks lastActiveDate === yesterday |
| Streaks: reset on missed day (no freeze) | PASS | Falls to newStreak = 1 |
| Streak freeze: consume before reset | FAIL | See BUG-03 (P1) |
| Daily goal: Quick=1, Steady=2, Ambitious=3 | PASS | DAILY_GOALS constant correct |
| Daily goal ring on home screen | PASS | SVG ring with lessonsToday/goalTarget |
| Levels: 10 XP thresholds | PASS | Level 1 (0) through Level 10 (15000) |
| 5 badges with correct triggers | PASS | first-prompt, on-fire, prompt-crafter, perfect-score, ai-explorer |
| Free tier: 3 lessons/day limit | PASS | canPlayLesson checks FREE_LESSONS_PER_DAY |

## 5. State Persistence

| Check | Status | Notes |
|-------|--------|-------|
| All state saved to localStorage | PASS | saveState called on every setState |
| State loads on app refresh | PASS | loadState reads from localStorage |
| Daily counter resets on new day | PASS | loadState checks todayDate !== getToday() |
| Streak uses UTC dates (not local) | FAIL | See BUG-01 (P1) |

## 6. Home Screen (S-07)

| Check | Status | Notes |
|-------|--------|-------|
| Status bar: streak fire+number (left) | PASS | 🔥 + streak count |
| Status bar: XP star+number (center) | PASS | ⭐ + xp count |
| Status bar: daily goal ring (right) | PASS | SVG ring with count |
| Module headers with titles | PASS | Shows module title with divider lines |
| Missing: module progress count "— X/6" | FAIL | See BUG-08 (P2) |
| Lesson nodes: completed = primary + ✓ | PASS | bg-primary with checkmark |
| Lesson nodes: current = pulsing | PASS | Scale animation 1→1.08→1 repeating |
| Lesson nodes: locked = gray + 🔒 | PASS | bg-gray-100 with lock |
| Daily goal met banner | PASS | "Daily goal reached!" in success color |
| Free tier limit message + upgrade link | PASS | Shows when !canPlayLesson |
| Tapping locked lesson does nothing | PASS | isLocked guard in handleLessonTap |
| Tapping when limit reached → paywall | PASS | navigates to /paywall for non-completed lessons |

## 7. Tab Screens

| Check | Status | Notes |
|-------|--------|-------|
| Practice: lists completed lessons | PASS | Filters by completedLessons |
| Practice: empty state copy | PASS | "Complete your first lesson to unlock practice!" |
| Practice: replaying awards duplicate XP | FAIL | See BUG-02 (P1) |
| Badges: 3-column grid | PASS | grid-cols-3 |
| Badges: earned = colored + name | PASS | bg-xp/10 with badge icon and name |
| Badges: unearned = gray + "???" | PASS | bg-gray-100 with ❓ and "???" |
| Badges: empty state | PASS | "Complete lessons to earn badges" |
| Badges: tap earned → detail modal | FAIL | See BUG-05 (P2) |
| Profile: avatar + name + level | PASS | Initials circle, name, level badge |
| Profile: 4 stats grid | PASS | XP, streak, lessons, level |
| Profile: settings section | PASS | Daily goal, freeze status, account, subscription |
| Profile: log out → resets + redirects | PASS | resetState() + navigate('/') |

## 8. Paywall (S-14)

| Check | Status | Notes |
|-------|--------|-------|
| "You've completed your free lessons today" | PASS | Header copy matches spec |
| Free vs Pro comparison | PASS | Feature comparison present |
| Monthly $9.99 / Annual $59.99 | PASS | Correct pricing |
| "Best Value" + "Save 50%" on annual | PASS | Tags present |
| "Start 7-day free trial" CTA | PASS | Button present |
| "Maybe later" dismiss | PASS | Navigates back |

## 9. Navigation

| Check | Status | Notes |
|-------|--------|-------|
| Bottom tab bar: 4 tabs | PASS | Learn, Practice, Badges, Profile |
| Active tab: icon + label | PASS | Label only shown when active |
| Inactive tab: icon only, no label | PASS | Conditional render on isActive |
| Tab bar hidden during lessons | PASS | Lesson route outside Layout |
| All tabs reachable from all tabs | PASS | NavLink to each path |
| Safe area padding on tab bar | PASS | pb-[env(safe-area-inset-bottom)] |

## 10. Mobile & Visual

| Check | Status | Notes |
|-------|--------|-------|
| Max-width 428px constraint | PASS | #root max-width: 428px |
| Color system matches spec | PASS | All 10 spec colors defined in @theme |
| Tap targets ≥ 44px | PASS | Buttons use py-4 (56px+), cards are large |
| Button press states | PASS | whileTap scale: 0.97 on all CTAs |
| Animations present | PASS | Framer Motion throughout |

---

## Summary

| Area | Pass | Fail | Total |
|------|------|------|-------|
| Onboarding | 12 | 1 | 13 |
| Lesson Player | 15 | 0 | 15 |
| Lesson Complete | 10 | 1 | 11 |
| Gamification | 10 | 1 | 11 |
| State Persistence | 3 | 1 | 4 |
| Home Screen | 10 | 1 | 11 |
| Tab Screens | 10 | 2 | 12 |
| Paywall | 6 | 0 | 6 |
| Navigation | 6 | 0 | 6 |
| Mobile & Visual | 5 | 0 | 5 |
| **Total** | **87** | **7** | **94** |

**Pass rate: 93%**

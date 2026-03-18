# Bug Log — Aible v2 (Chat-Based Pivot)

**Date:** 2026-03-18
**Reviewer:** QA pass against PRD v2 + UX Spec v2

---

## P1 — Must Fix Before Launch

### BUG-01: Tutor avatar missing from AI chat bubbles

**Where:** [Chat.jsx:48-58](app/src/pages/Chat.jsx#L48-L58) — `AIBubble` component
**Spec:** UX Spec S-06: "Avatar: 28px circle in tutor's accent color" next to every AI message
**Actual:** AI bubbles render with accent left border but no avatar circle. The `TutorAvatar` component exists (line 12-21) and is used in `SessionOpener`, but not in `AIBubble`.
**Impact:** Without the avatar, AI messages look like generic chat bubbles rather than coming from a named tutor. This is a key visual differentiator from messaging apps.
**Fix:** Add `<TutorAvatar>` to `AIBubble`, pass `color` and `name` props. ~5 min fix.

### BUG-02: `completeSession` never called — session XP and daily counter broken

**Where:** [Chat.jsx:259-261](app/src/pages/Chat.jsx#L259-L261) — `End Session` handler
**Spec:** PRD F5.1: "+25 per session", "+5 daily first-session bonus". Data model: `sessionsCompleted` tracks count.
**Actual:** The "End Session" overflow button just shows the celebration overlay (`setShowCelebration(true)`) without calling `completeSession()`. This means:
- +25 session XP is never awarded
- +5 daily-first-session bonus never triggers
- `dailySessionsCompleted` never increments (so the 2-session free limit never activates)
- `sessionsCompleted` in TopicProgress stays at 0
- "First Steps" badge ("complete your first session") never triggers
**Impact:** Core gamification loop is broken. The session count fuels daily goals, streaks, badges, and freemium limits.
**Fix:** Call `completeSession(topicId, sessionXp, conceptsCovered, conceptsMastered, checkpointsPassed)` when "End Session" is tapped, before showing celebration. ~10 min fix.

### BUG-03: Session Summary Card missing from chat

**Where:** [Chat.jsx](app/src/pages/Chat.jsx) — no summary card component
**Spec:** UX Spec S-07: "Session Summary Card appears: purple gradient left border, white bg. 'Session Summary' — 14px semibold, purple. Bulleted concepts covered (teal checkmarks). 'Quick Checks: 2/2 correct'"
**Actual:** When ending a session, the celebration overlay appears immediately. There is no in-chat summary card showing what was covered.
**Impact:** The wrap-up feels abrupt. Users don't see a tangible list of what they learned before the celebration, which weakens the sense of accomplishment.
**Fix:** Before showing celebration, inject a summary message into the chat with concepts covered and quiz results. ~20 min fix.

### BUG-04: No confetti or particle effects on celebration

**Where:** [CelebrationOverlay.jsx](app/src/components/CelebrationOverlay.jsx)
**Spec:** PRD F4.3: "Celebration overlay: full-screen, purple gradient, XP animation with particle burst". UX Spec S-07: mentions confetti for daily goal met.
**Actual:** Celebration shows spring animations for XP/streak/progress but no confetti or particle burst. The old v1 app had a `Confetti.jsx` component that still exists at `app/src/components/Confetti.jsx`.
**Impact:** Celebration feels muted. Confetti is the "dopamine hit" that makes users want to come back.
**Fix:** Reuse the existing `Confetti.jsx` component or add a simple CSS particle burst. ~15 min fix.

### BUG-05: New concept XP (+5) never awarded

**Where:** [Chat.jsx](app/src/pages/Chat.jsx), [useChat.js:196-199](app/src/hooks/useChat.js#L196-L199)
**Spec:** PRD F5.1: "+5 per new concept explored". Data model XP table.
**Actual:** `useChat` correctly tracks `conceptsCovered` when `[CONCEPT]` tags are parsed (line 196-199), but there is no `addXp(5)` call when a new concept is discovered. The concept is recorded but not rewarded.
**Impact:** Users miss XP that should make them feel progress is happening during the session, not just at quiz moments.
**Fix:** In `useChat.js` after the streaming completes, check for new concepts not previously in `conceptsCovered` and call a callback to award XP per new concept. ~15 min fix.

---

## P2 — Should Fix Before Sharing Publicly

### BUG-06: Streak text doesn't pluralize

**Where:** [Today.jsx:44](app/src/pages/Today.jsx#L44)
**Actual:** Text always says "day streak" regardless of count. "1 day streak" is correct but "5 day streak" should be "5-day streak" or "day streak!" (current shows "day streak" for all).
**Fix:** Trivial copy fix. ~2 min.

### BUG-07: AI bubble still shows raw `[CONCEPT]` and `[QUIZ]` tags during streaming

**Where:** [Chat.jsx:300-301](app/src/pages/Chat.jsx#L300-L301), [useChat.js:152-159](app/src/hooks/useChat.js#L152-L159)
**Actual:** During streaming, the assistant message content is rendered as raw text (`fullContent`), which temporarily includes `[QUIZ]{"question":...}[/QUIZ]` and `[CONCEPT]...` tags visible to the user before parsing completes on stream end. The parsed version only replaces the raw content after the stream finishes.
**Impact:** Looks broken/glitchy during stream. Users briefly see JSON in their chat.
**Fix:** Apply `parseAIResponse` on each streaming update to strip tags from `displayContent`, or hide the raw message and only render the parsed version. ~20 min fix.

### BUG-08: Topic switching from celebration doesn't work correctly

**Where:** [Chat.jsx:377](app/src/pages/Chat.jsx#L377)
**Actual:** "Switch Topic" on celebration calls `setShowCelebration(false); setShowTopicIndex(true)` — but TopicIndex navigates to a new `/chat/:topicId` route, which unmounts the current Chat component. The TopicIndex sheet works, but the flow is: celebration → dismiss → TopicIndex → navigate to new chat. The transition is jarring because the old chat briefly flashes.
**Fix:** Navigate to `/home` first, then show TopicIndex from there. Or add a transition delay. ~10 min.

---

## P3 — Polish (Post-Launch)

### BUG-09: Chat message slide-in animation missing

**Spec:** UX Spec animation table: "Chat messages: 150ms slide-up"
**Actual:** Messages appear instantly without animation.
**Fix:** Wrap messages in `motion.div` with `initial={{ opacity: 0, y: 10 }}` and `animate={{ opacity: 1, y: 0 }}`.

### BUG-10: Streak flame doesn't pulse on Today tab icon

**Spec:** UX Spec: "Streak flame on Today tab pulses orange when streak is active"
**Actual:** Static number badge, no pulse animation.
**Fix:** Add CSS `animate-pulse` or Framer Motion to the streak indicator.

### BUG-11: Badge Detail bottom sheet (S-11) not implemented

**Spec:** UX Spec S-11: small sheet (~40% viewport) with badge icon, name, description, "Earned on [date]"
**Actual:** Tapping badges on Profile does nothing.
**Fix:** Add a small bottom sheet component.

### BUG-12: S-04 Quick Preferences screen not implemented

**Spec:** UX Spec S-04: "How much do you know about AI?" — single-select with Skip option.
**Actual:** Onboarding goes directly from Pick Topic to Chat, skipping preferences.
**Impact:** `experienceLevel` is always "none", so tutor can't adapt. Low impact since system prompts say "start with what the user knows."
**Fix:** Add optional preferences step. Could also be deferred to in-chat ("What's your experience with AI?").

---

## Summary

| Priority | Count | Items |
|----------|-------|-------|
| P1 — Must fix | 5 | Avatar, completeSession, summary card, confetti, concept XP |
| P2 — Should fix | 3 | Streak text, raw tags during stream, topic switch flow |
| P3 — Polish | 4 | Message animation, flame pulse, badge detail, preferences |
| **Total** | **12** | |

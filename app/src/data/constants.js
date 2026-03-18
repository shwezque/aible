export const ROLES = [
  { id: 'marketer', label: 'Marketer', icon: '📢' },
  { id: 'freelancer', label: 'Freelancer', icon: '💻' },
  { id: 'business-owner', label: 'Business Owner', icon: '🏢' },
  { id: 'creator', label: 'Creator', icon: '🎨' },
  { id: 'student', label: 'Student', icon: '🎓' },
  { id: 'other', label: 'Other', icon: '✨' },
]

export const GOALS = [
  { id: 'productivity', title: 'Save time', subtitle: 'Get more done with AI-powered workflows', icon: '⚡' },
  { id: 'career', title: 'Level up my career', subtitle: 'Build skills employers are looking for', icon: '📈' },
  { id: 'income', title: 'Earn more money', subtitle: 'Use AI to create new income streams', icon: '💰' },
]

export const EXPERIENCE_LEVELS = [
  { id: 'beginner', title: 'Never tried it', subtitle: "I've heard of ChatGPT but haven't used it", emoji: '🌱', startModule: 0, startLesson: 0 },
  { id: 'intermediate', title: 'A few times', subtitle: "I've played around but nothing consistent", emoji: '🌿', startModule: 0, startLesson: 2 },
  { id: 'advanced', title: 'I use it regularly', subtitle: 'I use AI tools but want to get better', emoji: '🌳', startModule: 1, startLesson: 0 },
]

export const DAILY_GOALS = [
  { id: 'quick', title: 'Quick', detail: '1 lesson/day — Perfect for busy days', target: 1 },
  { id: 'steady', title: 'Steady', detail: '2 lessons/day — Build a solid habit', target: 2, recommended: true },
  { id: 'ambitious', title: 'Ambitious', detail: '3 lessons/day — Fast-track your skills', target: 3 },
]

export const LEVELS = [
  { level: 1, xpRequired: 0, name: 'Beginner' },
  { level: 2, xpRequired: 200, name: 'Learner' },
  { level: 3, xpRequired: 500, name: 'Practitioner' },
  { level: 4, xpRequired: 1000, name: 'Skilled' },
  { level: 5, xpRequired: 2000, name: 'Proficient' },
  { level: 6, xpRequired: 3500, name: 'Advanced' },
  { level: 7, xpRequired: 5000, name: 'Expert' },
  { level: 8, xpRequired: 7500, name: 'Master' },
  { level: 9, xpRequired: 10000, name: 'AI Pro' },
  { level: 10, xpRequired: 15000, name: 'Legend' },
]

export const BADGES = [
  { id: 'first-prompt', name: 'First Prompt', description: 'You wrote your first AI prompt!', icon: '✍️' },
  { id: 'on-fire', name: 'On Fire', description: '7 days of learning — you\'re building a real habit.', icon: '🔥' },
  { id: 'prompt-crafter', name: 'Prompt Crafter', description: 'You\'ve mastered the foundations of prompting.', icon: '🛠️' },
  { id: 'perfect-score', name: 'Perfect Score', description: 'Not a single mistake. Flawless.', icon: '💎' },
  { id: 'ai-explorer', name: 'AI Explorer', description: '10 lessons down. You\'re serious about this.', icon: '🚀' },
]

export const STREAK_MILESTONES = [3, 7, 14, 30, 50, 100]

export const STREAK_MESSAGES = {
  3: { headline: '3-day streak!', subtext: "You're getting into a rhythm. Keep it going." },
  7: { headline: '7-day streak!', subtext: 'One week of learning AI. Most people never get this far.' },
  14: { headline: '2-week streak!', subtext: "You're building a real skill. This is when it starts compounding." },
  30: { headline: '30 days!', subtext: "One month of daily AI learning. You're officially ahead of the curve." },
  50: { headline: '50-day streak!', subtext: "You've invested more in AI skills than 99% of professionals." },
  100: { headline: '100 days!', subtext: "Triple digits. You're not just learning AI — you're living it." },
}

export const CORRECT_MESSAGES = [
  'Great job!', 'Exactly right.', 'You got it!', 'Nailed it.', "That's the one.",
  'Spot on.', 'Nice work.', "You're getting good at this.", 'Perfect.', "That's how it's done.",
]

export const INCORRECT_MESSAGES = [
  "Not quite — here's why.",
  "Close! Let's look at this.",
  "Good thinking, but there's a better answer.",
  "Almost — here's the key difference.",
  'Nice try. The trick here is...',
]

export const XP_PER_EXERCISE = 10
export const XP_LESSON_BONUS = 50
export const XP_PERFECT_BONUS = 20
export const FREE_LESSONS_PER_DAY = 3

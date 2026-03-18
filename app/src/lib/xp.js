export const XP_ACTIONS = {
  SESSION_COMPLETE: 25,
  QUIZ_CORRECT: 10,
  NEW_CONCEPT: 5,
  DAILY_FIRST_SESSION: 5,
  NEW_TOPIC_STARTED: 10,
  CHAPTER_COMPLETE: 50,
  TOPIC_MASTERED: 100,
}

export const LEVELS = [
  { level: 1, xp: 0, name: 'Beginner' },
  { level: 2, xp: 100, name: 'Learner' },
  { level: 3, xp: 300, name: 'Practitioner' },
  { level: 4, xp: 600, name: 'Skilled' },
  { level: 5, xp: 1000, name: 'Proficient' },
  { level: 6, xp: 1600, name: 'Advanced' },
  { level: 7, xp: 2500, name: 'Expert' },
  { level: 8, xp: 3500, name: 'Master' },
  { level: 9, xp: 5000, name: 'AI Pro' },
  { level: 10, xp: 7500, name: 'Legend' },
]

export function getLevelForXp(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xp) return LEVELS[i]
  }
  return LEVELS[0]
}

export function getNextLevel(xp) {
  const current = getLevelForXp(xp)
  const next = LEVELS.find(l => l.xp > xp)
  return next || current
}

export function getLevelProgress(xp) {
  const current = getLevelForXp(xp)
  const next = getNextLevel(xp)
  if (current.level === next.level) return 1
  return (xp - current.xp) / (next.xp - current.xp)
}

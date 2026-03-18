export const BADGE_DEFS = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first chat session',
    icon: '👋',
    check: (user) => (user.topicProgress && Object.values(user.topicProgress).some(t => t.sessionsCompleted >= 1)),
  },
  {
    id: 'curious-mind',
    name: 'Curious Mind',
    description: 'Ask 10 questions across all topics',
    icon: '🧠',
    check: (user) => {
      const total = Object.values(user.topicProgress || {}).reduce((sum, t) => sum + (t.totalMessages || 0), 0)
      return total >= 20 // ~10 user messages = ~20 total
    },
  },
  {
    id: 'deep-diver',
    name: 'Deep Diver',
    description: 'Master 5 concepts in a single topic',
    icon: '🤿',
    check: (user) => Object.values(user.topicProgress || {}).some(t => (t.conceptsMastered?.length || 0) >= 5),
  },
  {
    id: 'quiz-ace',
    name: 'Quiz Ace',
    description: 'Get 5 Quick Checks correct in a row',
    icon: '🎯',
    check: (user) => (user.quizStreak || 0) >= 5,
  },
  {
    id: 'on-a-roll',
    name: 'On a Roll',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    check: (user) => (user.streak || 0) >= 3,
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '⚔️',
    check: (user) => (user.streak || 0) >= 7,
  },
  {
    id: 'concept-master',
    name: 'Concept Master',
    description: 'Master all concepts in any topic',
    icon: '🏆',
    check: () => false, // checked dynamically with topic data
  },
  {
    id: 'rising-star',
    name: 'Rising Star',
    description: 'Reach Level 3',
    icon: '⭐',
    check: (user) => (user.level || 1) >= 3,
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Start all 3 MVP topics',
    icon: '🧭',
    check: (user) => {
      const started = Object.values(user.topicProgress || {}).filter(t => t.status !== 'not_started')
      return started.length >= 3
    },
  },
]

export function checkNewBadges(user) {
  const earnedIds = (user.badges || []).map(b => b.id)
  const newBadges = []
  for (const def of BADGE_DEFS) {
    if (!earnedIds.includes(def.id) && def.check(user)) {
      newBadges.push({
        id: def.id,
        name: def.name,
        description: def.description,
        icon: def.icon,
        earnedAt: new Date().toISOString(),
      })
    }
  }
  return newBadges
}

import { motion } from 'framer-motion'
import { useStore } from '../hooks/useStore'
import { getLevelForXp } from '../lib/xp'
import { getTopicById } from '../data/topics'
import Icon from '../components/Icon'
import ProgressRing from '../components/ProgressRing'

export default function Today() {
  const { user } = useStore()
  const level = getLevelForXp(user.xp)
  const goalProgress = Math.min((user.dailySessionsCompleted / (user.dailyGoal || 1)) * 100, 100)
  const goalMet = user.dailySessionsCompleted >= (user.dailyGoal || 1)

  // Build activity feed from topic progress
  const activities = []
  for (const [topicId, progress] of Object.entries(user.topicProgress || {})) {
    if (progress.sessionsCompleted > 0) {
      activities.push({
        id: topicId,
        text: `Explored ${getTopicById(topicId)?.name || topicId}`,
        detail: `${progress.totalXp} XP earned`,
        time: progress.lastActiveAt,
        iconName: `topic-${topicId}`,
      })
    }
  }
  for (const badge of (user.badges || [])) {
    activities.push({
      id: badge.id,
      text: `Earned ${badge.name}`,
      detail: 'Badge unlocked',
      time: badge.earnedAt,
      iconName: badge.iconId || `badge-${badge.id}`,
    })
  }
  activities.sort((a, b) => (b.time || '').localeCompare(a.time || ''))

  return (
    <div className="bg-bg min-h-full">
      <div className="bg-surface px-5 pt-5 pb-4 border-b border-line-subtle">
        <h1 className="text-headline text-ink">Today</h1>
      </div>

      <div className="px-5 py-5 space-y-4">
        {/* Streak Card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-2xl border border-line-subtle p-5 flex items-center gap-5 shadow-theme"
        >
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
            <Icon name="flame" size={28} className="text-accent" />
          </div>
          <div>
            <p className="text-3xl font-bold text-ink tracking-tighter">{user.streak || 0}</p>
            <p className="text-caption text-ink-secondary mt-0.5">
              {user.streak === 0
                ? 'Start your streak today'
                : user.streak === 1
                ? 'day streak'
                : 'day streak'}
            </p>
          </div>
        </motion.div>

        {/* Daily Goal */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-surface rounded-2xl border border-line-subtle p-5 flex items-center gap-5 shadow-theme"
        >
          <ProgressRing percent={goalProgress} size={72} strokeWidth={5} color={goalMet ? '#22c55e' : '#14b8a6'}>
            <div className="text-center">
              <p className="text-lg font-bold text-ink leading-none">{user.dailySessionsCompleted}</p>
              <p className="text-[10px] text-ink-tertiary mt-0.5">of {user.dailyGoal || 1}</p>
            </div>
          </ProgressRing>
          <div>
            <p className="text-title text-ink">
              {goalMet ? 'Goal complete' : 'Daily Goal'}
            </p>
            <p className="text-caption text-ink-secondary mt-0.5">
              {goalMet
                ? 'Great work. Bonus XP for extra sessions.'
                : `${(user.dailyGoal || 1) - user.dailySessionsCompleted} more session${(user.dailyGoal || 1) - user.dailySessionsCompleted !== 1 ? 's' : ''} to go`}
            </p>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="bg-surface rounded-2xl border border-line-subtle p-3.5 text-center shadow-theme">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Icon name="diamond" size={14} className="text-primary" />
              <p className="text-lg font-bold text-primary">{user.xp}</p>
            </div>
            <p className="text-micro text-ink-tertiary">Total XP</p>
          </div>
          <div className="bg-surface rounded-2xl border border-line-subtle p-3.5 text-center shadow-theme">
            <p className="text-lg font-bold text-ink mb-0.5">Lv.{level.level}</p>
            <p className="text-micro text-ink-tertiary">{level.name}</p>
          </div>
          <div className="bg-surface rounded-2xl border border-line-subtle p-3.5 text-center shadow-theme">
            <p className="text-lg font-bold text-ink mb-0.5">{user.longestStreak || 0}</p>
            <p className="text-micro text-ink-tertiary">Best Streak</p>
          </div>
        </motion.div>

        {/* Activity Feed */}
        <div>
          <h2 className="text-title text-ink mb-3">Activity</h2>
          {activities.length > 0 ? (
            <div className="space-y-2">
              {activities.slice(0, 10).map((a, i) => (
                <motion.div
                  key={`${a.id}-${i}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.03 }}
                  className="bg-surface rounded-xl border border-line-subtle px-4 py-3.5 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-alt flex items-center justify-center shrink-0">
                    <Icon name={a.iconName} size={16} className="text-ink-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{a.text}</p>
                    <p className="text-xs text-ink-tertiary">{a.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-surface rounded-2xl border border-line-subtle p-8 text-center">
              <div className="w-10 h-10 rounded-xl bg-surface-alt flex items-center justify-center mx-auto mb-3">
                <Icon name="academic-cap" size={20} className="text-ink-tertiary" />
              </div>
              <p className="text-ink-tertiary text-sm">Start your first session to see activity here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

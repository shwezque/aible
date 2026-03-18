import { useStore } from '../hooks/useStore'
import { getLevelForXp } from '../lib/xp'
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
        text: `Explored ${topicId.replace(/-/g, ' ')} — ${progress.totalXp} XP earned`,
        time: progress.lastActiveAt,
      })
    }
  }
  for (const badge of (user.badges || [])) {
    activities.push({
      id: badge.id,
      text: `Earned ${badge.icon} ${badge.name} badge`,
      time: badge.earnedAt,
    })
  }
  activities.sort((a, b) => (b.time || '').localeCompare(a.time || ''))

  return (
    <div className="bg-bg min-h-full">
      <div className="bg-surface px-5 py-4 border-b border-line-subtle">
        <h1 className="text-2xl font-bold text-ink">Today</h1>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Streak Card */}
        <div className="bg-gradient-to-r from-orange-400 to-amber-400 rounded-xl p-4 flex items-center gap-4">
          <span className="text-4xl">🔥</span>
          <div>
            <p className="text-3xl font-bold text-white">{user.streak || 0}</p>
            <p className="text-sm text-white/80 font-medium">
              {user.streak === 0 ? 'day streak — start one today!'
                : user.streak === 1 ? 'day streak' : '-day streak!'}
            </p>
          </div>
        </div>

        {/* Daily Goal */}
        <div className="bg-surface rounded-xl border border-line-subtle p-5 flex items-center gap-5">
          <ProgressRing percent={goalProgress} size={80} strokeWidth={6} color="#14B8A6">
            <div className="text-center">
              <p className="text-lg font-bold text-ink">{user.dailySessionsCompleted}</p>
              <p className="text-[10px] text-ink-secondary">of {user.dailyGoal || 1}</p>
            </div>
          </ProgressRing>
          <div>
            <p className="text-base font-semibold text-ink">
              {goalMet ? 'Goal complete!' : 'Daily Goal'}
            </p>
            <p className="text-sm text-ink-secondary mt-0.5">
              {goalMet
                ? 'Nice work! Bonus XP for extra sessions.'
                : `${(user.dailyGoal || 1) - user.dailySessionsCompleted} more session${(user.dailyGoal || 1) - user.dailySessionsCompleted !== 1 ? 's' : ''} to go`}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-surface rounded-xl border border-line-subtle p-3 text-center">
            <p className="text-lg font-bold text-primary">{user.xp}</p>
            <p className="text-[11px] text-ink-secondary">Total XP</p>
          </div>
          <div className="bg-surface rounded-xl border border-line-subtle p-3 text-center">
            <p className="text-lg font-bold text-ink">Lv.{level.level}</p>
            <p className="text-[11px] text-ink-secondary">{level.name}</p>
          </div>
          <div className="bg-surface rounded-xl border border-line-subtle p-3 text-center">
            <p className="text-lg font-bold text-ink">{user.longestStreak || 0}</p>
            <p className="text-[11px] text-ink-secondary">Best Streak</p>
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <h2 className="text-base font-semibold text-ink mb-3">Activity</h2>
          {activities.length > 0 ? (
            <div className="space-y-2">
              {activities.slice(0, 10).map((a, i) => (
                <div key={`${a.id}-${i}`} className="bg-surface rounded-lg border border-line-subtle px-4 py-3">
                  <p className="text-sm text-ink">{a.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-surface rounded-xl border border-line-subtle p-6 text-center">
              <p className="text-ink-tertiary text-sm">Start your first session today!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../store/AppContext'
import { DAILY_GOALS } from '../data/constants'

export default function Profile() {
  const navigate = useNavigate()
  const app = useApp()
  const {
    name, email, xp, streak, completedLessons, isPro,
    dailyGoal, streakFreezeAvailable, getLevel, update, resetState,
  } = app

  const level = getLevel()
  const goalLabel = DAILY_GOALS.find(g => g.id === dailyGoal)?.title || 'Steady'

  const handleLogout = () => {
    resetState()
    navigate('/', { replace: true })
  }

  return (
    <div className="px-5 pt-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
          <span className="text-white text-xl font-bold">
            {name ? name.charAt(0) : '?'}
          </span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-text-primary">{name || 'Guest'}</h1>
          <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
            Level {level.level} — {level.name}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {[
          { label: 'Total XP', value: xp, icon: '⭐' },
          { label: 'Streak', value: streak, icon: '🔥' },
          { label: 'Lessons', value: completedLessons.length, icon: '📚' },
          { label: 'Level', value: level.level, icon: '📊' },
        ].map(stat => (
          <div key={stat.label} className="bg-surface rounded-xl p-3 text-center">
            <span className="text-lg">{stat.icon}</span>
            <p className="text-lg font-bold text-text-primary">{stat.value}</p>
            <p className="text-[10px] text-text-secondary">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div className="bg-surface rounded-2xl divide-y divide-gray-100">
        <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider px-4 pt-4 pb-2">Settings</h2>

        <SettingRow label="Daily goal" value={goalLabel} />
        <SettingRow label="Streak freeze" value={streakFreezeAvailable ? '1 freeze available' : 'No freezes remaining'} />
        <SettingRow label="Account" value={email || 'Not signed in'} />
        <SettingRow
          label="Subscription"
          value={isPro ? 'Aible Pro' : 'Free plan'}
          action={!isPro && (
            <button
              className="text-primary text-sm font-semibold"
              onClick={() => navigate('/paywall')}
            >
              Upgrade
            </button>
          )}
        />

        <div className="px-4 py-3">
          <button
            className="text-streak text-sm font-medium"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  )
}

function SettingRow({ label, value, action }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm text-text-primary">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-text-secondary">{value}</span>
        {action}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../hooks/useStore'
import { useTheme } from '../hooks/useTheme.jsx'
import { getLevelForXp, getLevelProgress, getNextLevel } from '../lib/xp'
import { BADGE_DEFS } from '../lib/badges'
import { isSoundsEnabled, setSoundsEnabled } from '../lib/sounds'
import { LEARNING_STYLES } from '../data/topics'

export default function Profile() {
  const { user, updateUser } = useStore()
  const { preference, setTheme } = useTheme()
  const level = getLevelForXp(user.xp)
  const nextLevel = getNextLevel(user.xp)
  const levelProgress = getLevelProgress(user.xp)
  const [showGoalPicker, setShowGoalPicker] = useState(false)
  const [showStylePicker, setShowStylePicker] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState(null)
  const [soundOn, setSoundOn] = useState(isSoundsEnabled)

  const earnedBadgeIds = (user.badges || []).map(b => b.id)
  const topicsStarted = Object.values(user.topicProgress || {}).filter(t => t.status !== 'not_started').length
  const totalSessions = Object.values(user.topicProgress || {}).reduce((s, t) => s + (t.sessionsCompleted || 0), 0)

  const initials = (user.displayName || 'You')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'system', label: 'System' },
    { value: 'dark', label: 'Dark' },
  ]

  return (
    <div className="bg-bg min-h-full pb-8">
      {/* Header */}
      <div className="bg-surface px-5 pt-6 pb-5 border-b border-line">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <span className="text-white text-xl font-bold">{initials}</span>
          </div>
          <div>
            <p className="text-lg font-bold text-ink">{user.displayName || 'Learner'}</p>
            <p className="text-sm text-primary font-medium">Level {level.level} — {level.name}</p>
          </div>
        </div>

        {/* Level Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[12px] text-ink-secondary mb-1">
            <span>Level {level.level}</span>
            <span>{user.xp} / {nextLevel.xp} XP</span>
          </div>
          <div className="h-2 bg-surface-alt rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${levelProgress * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-surface rounded-xl border border-line p-3 text-center shadow-theme">
            <p className="text-lg font-bold text-streak">{user.streak || 0}🔥</p>
            <p className="text-[11px] text-ink-secondary">Streak</p>
          </div>
          <div className="bg-surface rounded-xl border border-line p-3 text-center shadow-theme">
            <p className="text-lg font-bold text-ink">{topicsStarted}</p>
            <p className="text-[11px] text-ink-secondary">Topics</p>
          </div>
          <div className="bg-surface rounded-xl border border-line p-3 text-center shadow-theme">
            <p className="text-lg font-bold text-ink">{totalSessions}</p>
            <p className="text-[11px] text-ink-secondary">Sessions</p>
          </div>
        </div>

        {/* Badges */}
        <div>
          <h2 className="text-base font-semibold text-ink mb-3">Badges</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {BADGE_DEFS.map(badge => {
              const earned = earnedBadgeIds.includes(badge.id)
              const earnedData = (user.badges || []).find(b => b.id === badge.id)
              return (
                <button
                  key={badge.id}
                  onClick={() => setSelectedBadge({ ...badge, earned, earnedAt: earnedData?.earnedAt })}
                  className={`shrink-0 w-16 flex flex-col items-center gap-1.5 ${earned ? '' : 'opacity-40'}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                    earned ? 'bg-primary/10 border-2 border-primary' : 'bg-surface-alt border-2 border-line'
                  }`}>
                    {earned ? badge.icon : '🔒'}
                  </div>
                  <p className="text-[10px] text-ink-secondary text-center leading-tight">{badge.name}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Settings */}
        <div>
          <h2 className="text-base font-semibold text-ink mb-3">Settings</h2>
          <div className="bg-surface rounded-xl border border-line divide-y divide-line-subtle shadow-theme">
            {/* Theme Toggle */}
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-ink">Theme</span>
              <div className="flex bg-surface-alt rounded-lg p-0.5">
                {themeOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setTheme(opt.value)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                      preference === opt.value
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-ink-secondary hover:text-ink'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound Toggle */}
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-ink">Sound Effects</span>
              <button
                onClick={() => {
                  const next = !soundOn
                  setSoundOn(next)
                  setSoundsEnabled(next)
                }}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  soundOn ? 'bg-primary' : 'bg-surface-alt border border-line'
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${
                  soundOn ? 'left-[22px]' : 'left-[2px]'
                }`} />
              </button>
            </div>

            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-ink">Display Name</span>
              <input
                type="text"
                value={user.displayName || ''}
                onChange={(e) => updateUser({ displayName: e.target.value })}
                placeholder="Your name"
                className="text-sm text-right text-ink-secondary outline-none w-32 bg-transparent"
              />
            </div>
            <button
              onClick={() => setShowStylePicker(!showStylePicker)}
              className="w-full px-4 py-3 flex items-center justify-between"
            >
              <span className="text-sm text-ink">Learning Style</span>
              <span className="text-sm text-ink-secondary">
                {LEARNING_STYLES.find(s => s.id === user.learningStyle)?.label || 'Analogies & Metaphors'}
              </span>
            </button>
            <button
              onClick={() => setShowGoalPicker(!showGoalPicker)}
              className="w-full px-4 py-3 flex items-center justify-between"
            >
              <span className="text-sm text-ink">Daily Goal</span>
              <span className="text-sm text-ink-secondary">{user.dailyGoal || 1} session{(user.dailyGoal || 1) > 1 ? 's' : ''}/day</span>
            </button>
            <button
              onClick={() => updateUser({ isPremium: !user.isPremium })}
              className="w-full px-4 py-3 flex items-center justify-between"
            >
              <span className="text-sm text-ink">Aible Pro</span>
              <span className={`text-sm font-medium ${user.isPremium ? 'text-secondary' : 'text-ink-tertiary'}`}>
                {user.isPremium ? 'Active' : 'Free'}
              </span>
            </button>
            <button
              onClick={() => setShowReset(true)}
              className="w-full px-4 py-3 text-left"
            >
              <span className="text-sm text-error">Reset Progress</span>
            </button>
          </div>
        </div>

        {/* Learning Style Picker */}
        {showStylePicker && (
          <div className="bg-surface rounded-xl border border-line p-4 shadow-theme">
            <p className="text-sm font-semibold text-ink mb-3">How do you learn best?</p>
            {LEARNING_STYLES.map(style => (
              <button
                key={style.id}
                onClick={() => { updateUser({ learningStyle: style.id }); setShowStylePicker(false) }}
                className={`w-full text-left px-4 py-3 rounded-lg border mb-2 transition-all flex items-start gap-3 ${
                  user.learningStyle === style.id
                    ? 'border-primary bg-primary/10'
                    : 'border-line'
                }`}
              >
                <span className="text-lg mt-0.5">{style.icon}</span>
                <div>
                  <p className="text-sm font-medium text-ink">{style.label}</p>
                  <p className="text-xs text-ink-secondary">{style.desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Goal Picker */}
        {showGoalPicker && (
          <div className="bg-surface rounded-xl border border-line p-4 shadow-theme">
            <p className="text-sm font-semibold text-ink mb-3">Set Your Daily Goal</p>
            {[
              { value: 1, label: 'Casual', desc: '1 session/day' },
              { value: 2, label: 'Regular', desc: '2 sessions/day' },
              { value: 3, label: 'Ambitious', desc: '3 sessions/day' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => { updateUser({ dailyGoal: opt.value }); setShowGoalPicker(false) }}
                className={`w-full text-left px-4 py-3 rounded-lg border mb-2 transition-all ${
                  user.dailyGoal === opt.value
                    ? 'border-primary bg-primary/10'
                    : 'border-line'
                }`}
              >
                <p className="text-sm font-medium text-ink">{opt.label}</p>
                <p className="text-xs text-ink-secondary">{opt.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* Reset Confirmation */}
        {showReset && (
          <div className="bg-error/10 rounded-xl border border-error/20 p-4">
            <p className="text-sm font-semibold text-error">Reset all progress?</p>
            <p className="text-xs text-error/70 mt-1">This will clear all your XP, streaks, badges, and chat history.</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  localStorage.clear()
                  window.location.reload()
                }}
                className="px-4 py-2 bg-error text-white text-sm font-medium rounded-lg"
              >
                Reset
              </button>
              <button
                onClick={() => setShowReset(false)}
                className="px-4 py-2 bg-surface text-ink text-sm font-medium rounded-lg border border-line"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Badge Detail Bottom Sheet */}
      <AnimatePresence>
        {selectedBadge && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setSelectedBadge(null)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-2xl"
              style={{ maxWidth: 428, margin: '0 auto' }}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-line rounded-full" />
              </div>
              <div className="px-6 pb-8 pt-4 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto bg-primary/10 border-2 border-primary">
                  {selectedBadge.earned ? selectedBadge.icon : '🔒'}
                </div>
                <p className="text-lg font-bold text-ink mt-3">{selectedBadge.name}</p>
                <p className="text-sm text-ink-secondary mt-1">{selectedBadge.description}</p>
                {selectedBadge.earned && selectedBadge.earnedAt && (
                  <p className="text-xs text-ink-tertiary mt-2">
                    Earned on {new Date(selectedBadge.earnedAt).toLocaleDateString()}
                  </p>
                )}
                {!selectedBadge.earned && (
                  <p className="text-xs text-ink-tertiary mt-2">How to earn: {selectedBadge.description}</p>
                )}
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="mt-5 w-full bg-surface-alt text-ink font-medium py-2.5 rounded-xl text-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

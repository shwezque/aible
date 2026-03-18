import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../hooks/useStore'
import { useTheme } from '../hooks/useTheme.jsx'
import { getLevelForXp, getLevelProgress, getNextLevel } from '../lib/xp'
import { BADGE_DEFS } from '../lib/badges'
import { isSoundsEnabled, setSoundsEnabled } from '../lib/sounds'
import { LEARNING_STYLES } from '../data/topics'
import Icon from '../components/Icon'

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

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'system', label: 'Auto' },
    { value: 'dark', label: 'Dark' },
  ]

  return (
    <div className="bg-bg min-h-full pb-8">
      {/* Header */}
      <div className="bg-surface px-5 pt-6 pb-5 border-b border-line-subtle">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 shrink-0">
            <svg width="56" height="56" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="14" fill="url(#profile-grad)" />
              <defs><linearGradient id="profile-grad" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#3A6478" /><stop offset="1" stopColor="#1E3A4C" /></linearGradient></defs>
              {/* Hair back */}
              <ellipse cx="24" cy="17" rx="14" ry="12" fill="#5C3D2E" />
              {/* Face */}
              <ellipse cx="24" cy="26" rx="11.5" ry="12.5" fill="#E8C49A" />
              {/* Hair front */}
              <path d="M12 19C12 13 17 9 24 9C31 9 36 13 36 19C36 19 34 15 29 14.5C24 14 21 16 17 15C13 14 12 19 12 19Z" fill="#5C3D2E" />
              {/* Eyes */}
              <ellipse cx="19" cy="25" rx="1.8" ry="1.8" fill="#2D3748" />
              <ellipse cx="29" cy="25" rx="1.8" ry="1.8" fill="#2D3748" />
              <circle cx="19.6" cy="24.3" r="0.6" fill="white" />
              <circle cx="29.6" cy="24.3" r="0.6" fill="white" />
              {/* Eyebrows */}
              <path d="M16.5 22C17.5 21 19.5 20.8 21 21.5" stroke="#5C3D2E" strokeWidth="1.3" strokeLinecap="round" fill="none" />
              <path d="M27 21.5C28.5 20.8 30.5 21 31.5 22" stroke="#5C3D2E" strokeWidth="1.3" strokeLinecap="round" fill="none" />
              {/* Smile */}
              <path d="M20 31C22 33 26 33 28 31" stroke="#B5785A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              {/* Blush */}
              <circle cx="16.5" cy="29" r="2" fill="#F0A0A0" fillOpacity="0.3" />
              <circle cx="31.5" cy="29" r="2" fill="#F0A0A0" fillOpacity="0.3" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-bold text-ink tracking-tight">{user.displayName || 'Learner'}</p>
            <p className="text-caption text-primary font-medium">Level {level.level} — {level.name}</p>
          </div>
        </div>

        {/* Level Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[12px] text-ink-secondary mb-1.5">
            <span>Level {level.level}</span>
            <span>{user.xp} / {nextLevel.xp} XP</span>
          </div>
          <div className="h-1.5 bg-surface-alt rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-surface rounded-2xl border border-line-subtle p-3.5 text-center shadow-theme">
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
              <Icon name="flame" size={15} className="text-accent" />
              <p className="text-lg font-bold text-accent">{user.streak || 0}</p>
            </div>
            <p className="text-micro text-ink-tertiary">Streak</p>
          </div>
          <div className="bg-surface rounded-2xl border border-line-subtle p-3.5 text-center shadow-theme">
            <p className="text-lg font-bold text-ink mb-0.5">{topicsStarted}</p>
            <p className="text-micro text-ink-tertiary">Topics</p>
          </div>
          <div className="bg-surface rounded-2xl border border-line-subtle p-3.5 text-center shadow-theme">
            <p className="text-lg font-bold text-ink mb-0.5">{totalSessions}</p>
            <p className="text-micro text-ink-tertiary">Sessions</p>
          </div>
        </div>

        {/* Badges */}
        <div>
          <h2 className="text-title text-ink mb-3">Badges</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {BADGE_DEFS.map(badge => {
              const earned = earnedBadgeIds.includes(badge.id)
              const earnedData = (user.badges || []).find(b => b.id === badge.id)
              return (
                <button
                  key={badge.id}
                  onClick={() => setSelectedBadge({ ...badge, earned, earnedAt: earnedData?.earnedAt })}
                  className={`shrink-0 w-16 flex flex-col items-center gap-1.5 tap-target ${earned ? '' : 'opacity-35'}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    earned ? 'bg-primary/10 border-2 border-primary' : 'bg-surface-alt border-2 border-line'
                  }`}>
                    {earned ? (
                      <Icon name={badge.iconId} size={20} className="text-primary" />
                    ) : (
                      <Icon name="lock" size={16} className="text-ink-tertiary" />
                    )}
                  </div>
                  <p className="text-[10px] text-ink-secondary text-center leading-tight font-medium">{badge.name}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Settings */}
        <div>
          <h2 className="text-title text-ink mb-3">Settings</h2>
          <div className="bg-surface rounded-2xl border border-line-subtle divide-y divide-line-subtle shadow-theme overflow-hidden">
            {/* Theme Toggle */}
            <div className="px-4 py-3.5 flex items-center justify-between">
              <span className="text-[15px] text-ink">Theme</span>
              <div className="flex bg-surface-alt rounded-lg p-0.5">
                {themeOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setTheme(opt.value)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      preference === opt.value
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-ink-secondary'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound Toggle */}
            <div className="px-4 py-3.5 flex items-center justify-between">
              <span className="text-[15px] text-ink">Sound Effects</span>
              <button
                onClick={() => {
                  const next = !soundOn
                  setSoundOn(next)
                  setSoundsEnabled(next)
                }}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                  soundOn ? 'bg-primary' : 'bg-surface-alt border border-line'
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
                  soundOn ? 'left-[22px]' : 'left-[2px]'
                }`} />
              </button>
            </div>

            <div className="px-4 py-3.5 flex items-center justify-between">
              <span className="text-[15px] text-ink">Display Name</span>
              <input
                type="text"
                value={user.displayName || ''}
                onChange={(e) => updateUser({ displayName: e.target.value })}
                placeholder="Your name"
                className="text-[15px] text-right text-ink-secondary outline-none w-32 bg-transparent"
              />
            </div>
            <button
              onClick={() => setShowStylePicker(!showStylePicker)}
              className="w-full px-4 py-3.5 flex items-center justify-between tap-target"
            >
              <span className="text-[15px] text-ink">Learning Style</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] text-ink-secondary">
                  {LEARNING_STYLES.find(s => s.id === user.learningStyle)?.label || 'Analogies'}
                </span>
                <Icon name="chevron-right" size={14} className="text-ink-tertiary" />
              </div>
            </button>
            <button
              onClick={() => setShowGoalPicker(!showGoalPicker)}
              className="w-full px-4 py-3.5 flex items-center justify-between tap-target"
            >
              <span className="text-[15px] text-ink">Daily Goal</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] text-ink-secondary">{user.dailyGoal || 1} session{(user.dailyGoal || 1) > 1 ? 's' : ''}/day</span>
                <Icon name="chevron-right" size={14} className="text-ink-tertiary" />
              </div>
            </button>
            <button
              onClick={() => updateUser({ isPremium: !user.isPremium })}
              className="w-full px-4 py-3.5 flex items-center justify-between tap-target"
            >
              <span className="text-[15px] text-ink">Aible Pro</span>
              <span className={`text-[15px] font-medium ${user.isPremium ? 'text-secondary' : 'text-ink-tertiary'}`}>
                {user.isPremium ? 'Active' : 'Free'}
              </span>
            </button>
            <button
              onClick={() => setShowReset(true)}
              className="w-full px-4 py-3.5 text-left tap-target"
            >
              <span className="text-[15px] text-error">Reset Progress</span>
            </button>
          </div>
        </div>

        {/* Learning Style Picker */}
        <AnimatePresence>
          {showStylePicker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-surface rounded-2xl border border-line-subtle p-4 shadow-theme">
                <p className="text-title text-ink mb-3">How do you learn best?</p>
                {LEARNING_STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => { updateUser({ learningStyle: style.id }); setShowStylePicker(false) }}
                    className={`w-full text-left px-4 py-3 rounded-xl border mb-2 transition-all flex items-start gap-3 tap-target ${
                      user.learningStyle === style.id
                        ? 'border-primary bg-primary/8'
                        : 'border-line-subtle'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-surface-alt flex items-center justify-center mt-0.5 shrink-0">
                      <Icon name={style.iconId} size={16} className="text-ink-secondary" />
                    </div>
                    <div>
                      <p className="text-[15px] font-medium text-ink">{style.label}</p>
                      <p className="text-xs text-ink-secondary mt-0.5">{style.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Goal Picker */}
        <AnimatePresence>
          {showGoalPicker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-surface rounded-2xl border border-line-subtle p-4 shadow-theme">
                <p className="text-title text-ink mb-3">Set Your Daily Goal</p>
                {[
                  { value: 1, label: 'Casual', desc: '1 session/day' },
                  { value: 2, label: 'Regular', desc: '2 sessions/day' },
                  { value: 3, label: 'Ambitious', desc: '3 sessions/day' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { updateUser({ dailyGoal: opt.value }); setShowGoalPicker(false) }}
                    className={`w-full text-left px-4 py-3 rounded-xl border mb-2 transition-all tap-target ${
                      user.dailyGoal === opt.value
                        ? 'border-primary bg-primary/8'
                        : 'border-line-subtle'
                    }`}
                  >
                    <p className="text-[15px] font-medium text-ink">{opt.label}</p>
                    <p className="text-xs text-ink-secondary mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reset Confirmation */}
        <AnimatePresence>
          {showReset && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-error/8 rounded-2xl border border-error/15 p-5"
            >
              <p className="text-title text-error">Reset all progress?</p>
              <p className="text-caption text-error/60 mt-1">This will clear all your XP, streaks, badges, and chat history.</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    localStorage.clear()
                    window.location.reload()
                  }}
                  className="px-5 py-2.5 bg-error text-white text-sm font-semibold rounded-xl tap-target"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowReset(false)}
                  className="px-5 py-2.5 bg-surface text-ink text-sm font-semibold rounded-xl border border-line tap-target"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
              className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-3xl"
              style={{ maxWidth: 428, margin: '0 auto' }}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-9 h-1 bg-line rounded-full" />
              </div>
              <div className="px-6 pb-8 pt-4 text-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${
                  selectedBadge.earned ? 'bg-primary/10 border-2 border-primary' : 'bg-surface-alt border-2 border-line'
                }`}>
                  {selectedBadge.earned ? (
                    <Icon name={selectedBadge.iconId} size={28} className="text-primary" />
                  ) : (
                    <Icon name="lock" size={24} className="text-ink-tertiary" />
                  )}
                </div>
                <p className="text-lg font-bold text-ink mt-4 tracking-tight">{selectedBadge.name}</p>
                <p className="text-caption text-ink-secondary mt-1">{selectedBadge.description}</p>
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
                  className="mt-6 w-full bg-surface-alt text-ink font-semibold py-3 rounded-2xl text-sm tap-target"
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

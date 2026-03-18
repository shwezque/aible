import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../hooks/useStore'
import { getLevelForXp, getLevelProgress, getNextLevel } from '../lib/xp'
import { BADGE_DEFS } from '../lib/badges'
import ProgressRing from '../components/ProgressRing'

export default function Profile() {
  const { user, updateUser } = useStore()
  const level = getLevelForXp(user.xp)
  const nextLevel = getNextLevel(user.xp)
  const levelProgress = getLevelProgress(user.xp)
  const [showGoalPicker, setShowGoalPicker] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState(null)

  const earnedBadgeIds = (user.badges || []).map(b => b.id)
  const topicsStarted = Object.values(user.topicProgress || {}).filter(t => t.status !== 'not_started').length
  const totalSessions = Object.values(user.topicProgress || {}).reduce((s, t) => s + (t.sessionsCompleted || 0), 0)

  const initials = (user.displayName || 'You')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="bg-gray-50 min-h-full pb-8">
      {/* Header */}
      <div className="bg-white px-5 pt-6 pb-5 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white text-xl font-bold">{initials}</span>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{user.displayName || 'Learner'}</p>
            <p className="text-sm text-primary font-medium">Level {level.level} — {level.name}</p>
          </div>
        </div>

        {/* Level Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[12px] text-gray-500 mb-1">
            <span>Level {level.level}</span>
            <span>{user.xp} / {nextLevel.xp} XP</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
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
          <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
            <p className="text-lg font-bold text-orange-500">{user.streak || 0}🔥</p>
            <p className="text-[11px] text-gray-500">Streak</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
            <p className="text-lg font-bold text-gray-900">{topicsStarted}</p>
            <p className="text-[11px] text-gray-500">Topics</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
            <p className="text-lg font-bold text-gray-900">{totalSessions}</p>
            <p className="text-[11px] text-gray-500">Sessions</p>
          </div>
        </div>

        {/* Badges */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-3">Badges</h2>
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
                    earned ? 'bg-purple-50 border-2 border-primary' : 'bg-gray-100 border-2 border-gray-200'
                  }`}>
                    {earned ? badge.icon : '🔒'}
                  </div>
                  <p className="text-[10px] text-gray-600 text-center leading-tight">{badge.name}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Settings */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-3">Settings</h2>
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-gray-700">Display Name</span>
              <input
                type="text"
                value={user.displayName || ''}
                onChange={(e) => updateUser({ displayName: e.target.value })}
                placeholder="Your name"
                className="text-sm text-right text-gray-500 outline-none w-32"
              />
            </div>
            <button
              onClick={() => setShowGoalPicker(!showGoalPicker)}
              className="w-full px-4 py-3 flex items-center justify-between"
            >
              <span className="text-sm text-gray-700">Daily Goal</span>
              <span className="text-sm text-gray-500">{user.dailyGoal || 1} session{(user.dailyGoal || 1) > 1 ? 's' : ''}/day</span>
            </button>
            <button
              onClick={() => updateUser({ isPremium: !user.isPremium })}
              className="w-full px-4 py-3 flex items-center justify-between"
            >
              <span className="text-sm text-gray-700">Aible Pro</span>
              <span className={`text-sm font-medium ${user.isPremium ? 'text-teal-600' : 'text-gray-400'}`}>
                {user.isPremium ? 'Active' : 'Free'}
              </span>
            </button>
            <button
              onClick={() => setShowReset(true)}
              className="w-full px-4 py-3 text-left"
            >
              <span className="text-sm text-red-500">Reset Progress</span>
            </button>
          </div>
        </div>

        {/* Goal Picker */}
        {showGoalPicker && (
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-sm font-semibold text-gray-900 mb-3">Set Your Daily Goal</p>
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
                    ? 'border-primary bg-purple-50'
                    : 'border-gray-200'
                }`}
              >
                <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                <p className="text-xs text-gray-500">{opt.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* Reset Confirmation */}
        {showReset && (
          <div className="bg-red-50 rounded-xl border border-red-200 p-4">
            <p className="text-sm font-semibold text-red-800">Reset all progress?</p>
            <p className="text-xs text-red-600 mt-1">This will clear all your XP, streaks, badges, and chat history.</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  localStorage.clear()
                  window.location.reload()
                }}
                className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg"
              >
                Reset
              </button>
              <button
                onClick={() => setShowReset(false)}
                className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-200"
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
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl"
              style={{ maxWidth: 428, margin: '0 auto' }}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-gray-300 rounded-full" />
              </div>
              <div className="px-6 pb-8 pt-4 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto bg-purple-50 border-2 border-primary">
                  {selectedBadge.earned ? selectedBadge.icon : '🔒'}
                </div>
                <p className="text-lg font-bold text-gray-900 mt-3">{selectedBadge.name}</p>
                <p className="text-sm text-gray-500 mt-1">{selectedBadge.description}</p>
                {selectedBadge.earned && selectedBadge.earnedAt && (
                  <p className="text-xs text-gray-400 mt-2">
                    Earned on {new Date(selectedBadge.earnedAt).toLocaleDateString()}
                  </p>
                )}
                {!selectedBadge.earned && (
                  <p className="text-xs text-gray-400 mt-2">How to earn: {selectedBadge.description}</p>
                )}
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="mt-5 w-full bg-gray-100 text-gray-700 font-medium py-2.5 rounded-xl text-sm"
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

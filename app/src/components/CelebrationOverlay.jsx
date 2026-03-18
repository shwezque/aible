import { motion } from 'framer-motion'
import { useStore } from '../hooks/useStore'
import { getTopicById } from '../data/topics'
import { getLevelForXp } from '../lib/xp'
import ProgressRing from './ProgressRing'
import Confetti from './Confetti'

export default function CelebrationOverlay({ topicId, sessionXp, onClose, onSwitchTopic }) {
  const { user } = useStore()
  const topic = getTopicById(topicId)
  const level = getLevelForXp(user.xp)
  const progress = user.topicProgress?.[topicId]
  const conceptCount = topic?.conceptMap?.length || 1
  const coveredCount = progress?.conceptsCovered?.length || 0
  const progressPercent = Math.round((coveredCount / conceptCount) * 100)
  const newBadges = (user.badges || []).filter(b => {
    const earnedDate = new Date(b.earnedAt)
    return Date.now() - earnedDate.getTime() < 60000 // earned in last minute
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary to-primary-dark" />
      <Confetti count={50} />

      <motion.div
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="relative w-full max-w-sm mx-6 text-center"
      >
        {/* XP Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-5xl font-bold text-white mb-2"
        >
          +{sessionXp || 25} XP
        </motion.div>
        <p className="text-white/70 text-sm mb-8">Session complete!</p>

        {/* Streak */}
        {user.streak > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 rounded-xl px-4 py-3 mb-4 flex items-center justify-center gap-2"
          >
            <span className="text-2xl">🔥</span>
            <span className="text-white font-bold text-lg">{user.streak}-day streak!</span>
          </motion.div>
        )}

        {/* Topic Progress */}
        {topic && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 rounded-xl px-4 py-4 mb-4 flex items-center gap-4"
          >
            <ProgressRing percent={progressPercent} size={56} strokeWidth={4} color="#14B8A6">
              <span className="text-white text-xs font-bold">{progressPercent}%</span>
            </ProgressRing>
            <div className="text-left">
              <p className="text-white font-semibold">{topic.name}</p>
              <p className="text-white/60 text-sm">{coveredCount} of {conceptCount} concepts</p>
            </div>
          </motion.div>
        )}

        {/* New Badges */}
        {newBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 rounded-xl px-4 py-3 mb-4"
          >
            <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">New Badge!</p>
            {newBadges.map(b => (
              <div key={b.id} className="flex items-center gap-2 justify-center">
                <span className="text-2xl">{b.icon}</span>
                <span className="text-white font-semibold">{b.name}</span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Daily Goal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-white/60 text-sm mb-8"
        >
          {user.dailySessionsCompleted} of {user.dailyGoal || 1} sessions today
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <button
            onClick={onClose}
            className="w-full bg-secondary text-white font-semibold py-3.5 rounded-xl hover:bg-teal-600 active:scale-[0.98] transition-all"
          >
            Keep Going
          </button>
          <button
            onClick={onSwitchTopic}
            className="w-full bg-white/10 text-white font-semibold py-3.5 rounded-xl border border-white/20 hover:bg-white/20 active:scale-[0.98] transition-all"
          >
            Switch Topic
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

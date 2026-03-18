import { motion } from 'framer-motion'
import { useStore } from '../hooks/useStore'
import { getTopicById } from '../data/topics'
import { getLevelForXp } from '../lib/xp'
import Icon from './Icon'
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
    return Date.now() - earnedDate.getTime() < 60000
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary-dark to-[#152a36]" />
      <Confetti count={50} />

      <motion.div
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 280, delay: 0.1 }}
        className="relative w-full max-w-sm mx-6 text-center"
      >
        {/* XP Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
          className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-5 py-2.5 mb-4"
        >
          <Icon name="diamond" size={20} className="text-accent-light" />
          <span className="text-3xl font-bold text-white tracking-tight">+{sessionXp || 25} XP</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/60 text-sm mb-8"
        >
          Session complete
        </motion.p>

        {/* Streak */}
        {user.streak > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3.5 mb-3 flex items-center justify-center gap-3"
          >
            <Icon name="flame" size={22} className="text-accent-light" />
            <span className="text-white font-bold text-lg tracking-tight">{user.streak}-day streak</span>
          </motion.div>
        )}

        {/* Topic Progress */}
        {topic && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 mb-3 flex items-center gap-4"
          >
            <ProgressRing percent={progressPercent} size={52} strokeWidth={4} color="#14B8A6">
              <span className="text-white text-xs font-bold">{progressPercent}%</span>
            </ProgressRing>
            <div className="text-left">
              <p className="text-white font-semibold tracking-tight">{topic.name}</p>
              <p className="text-white/50 text-sm">{coveredCount} of {conceptCount} concepts</p>
            </div>
          </motion.div>
        )}

        {/* New Badges */}
        {newBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3.5 mb-3"
          >
            <p className="text-micro text-accent-light mb-2.5 tracking-widest">New Badge</p>
            {newBadges.map(b => (
              <div key={b.id} className="flex items-center gap-2.5 justify-center">
                <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                  <Icon name={b.iconId} size={16} className="text-accent-light" />
                </div>
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
          className="text-white/50 text-sm mb-8"
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
            className="w-full bg-white text-primary font-semibold py-3.5 rounded-2xl tap-target shadow-theme-lg"
          >
            Keep Going
          </button>
          <button
            onClick={onSwitchTopic}
            className="w-full bg-white/10 text-white/90 font-semibold py-3.5 rounded-2xl border border-white/15 tap-target"
          >
            Switch Topic
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

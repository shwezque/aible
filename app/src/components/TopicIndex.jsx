import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../hooks/useStore'
import { useTopics } from '../hooks/useTopics'
import Icon from './Icon'
import ProgressRing from './ProgressRing'

function timeAgo(dateStr) {
  if (!dateStr) return null
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default function TopicIndex({ show, onClose, currentTopicId }) {
  const navigate = useNavigate()
  const { user } = useStore()
  const { topics } = useTopics(user.topicProgress)

  const handleTap = (topicId) => {
    onClose()
    if (topicId !== currentTopicId) {
      navigate(`/chat/${topicId}`)
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-3xl max-h-[75vh] overflow-y-auto"
            style={{ maxWidth: 428, margin: '0 auto' }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-9 h-1 bg-line rounded-full" />
            </div>

            {/* Header */}
            <div className="px-5 py-3 flex items-center justify-between border-b border-line-subtle">
              <h2 className="text-title text-ink">Topics</h2>
              <button onClick={onClose} className="text-ink-tertiary p-1 tap-target">
                <Icon name="x-mark" size={20} />
              </button>
            </div>

            {/* Topic List */}
            <div className="py-2">
              {topics.map(topic => {
                const isCurrent = topic.id === currentTopicId
                const coveredCount = topic.progress?.conceptsCovered?.length || 0
                const totalConcepts = topic.conceptMap?.length || 0
                const lastActive = timeAgo(topic.progress?.lastActiveAt)

                if (topic.isComingSoon) {
                  return (
                    <div key={topic.id} className="px-5 py-3.5 flex items-center gap-3.5 opacity-40">
                      <div className="w-10 h-10 rounded-xl bg-surface-alt flex items-center justify-center">
                        <Icon name={topic.iconId} size={18} className="text-ink-tertiary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-ink-tertiary">{topic.name}</p>
                        <p className="text-xs text-ink-tertiary">Coming Soon</p>
                      </div>
                      <Icon name="lock" size={16} className="text-ink-tertiary" />
                    </div>
                  )
                }

                return (
                  <button
                    key={topic.id}
                    onClick={() => handleTap(topic.id)}
                    className={`w-full px-5 py-3.5 flex items-center gap-3.5 transition-colors tap-target ${
                      isCurrent ? 'border-l-3 border-l-primary bg-primary/5' : 'hover:bg-surface-alt'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: topic.color + '14' }}
                    >
                      <Icon name={topic.iconId} size={18} style={{ color: topic.color }} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-ink">{topic.name}</p>
                        {isCurrent && (
                          <span className="text-micro text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-ink-secondary">
                        {coveredCount > 0
                          ? `${coveredCount} of ${totalConcepts} concepts`
                          : 'Start'}
                        {lastActive ? ` \u00b7 ${lastActive}` : ''}
                      </p>
                    </div>
                    {topic.progressPercent > 0 ? (
                      <ProgressRing percent={topic.progressPercent} size={28} strokeWidth={2.5} color={topic.color} />
                    ) : (
                      <span className="text-xs font-semibold text-primary">Start</span>
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

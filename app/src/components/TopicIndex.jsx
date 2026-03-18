import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../hooks/useStore'
import { useTopics } from '../hooks/useTopics'
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
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl max-h-[75vh] overflow-y-auto"
            style={{ maxWidth: 428, margin: '0 auto' }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Topics</h2>
              <button onClick={onClose} className="text-gray-400 p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
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
                    <div key={topic.id} className="px-5 py-3 flex items-center gap-3 opacity-40">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                        {topic.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-400">{topic.name}</p>
                        <p className="text-xs text-gray-400">Coming Soon</p>
                      </div>
                      <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )
                }

                return (
                  <button
                    key={topic.id}
                    onClick={() => handleTap(topic.id)}
                    className={`w-full px-5 py-3 flex items-center gap-3 hover:bg-gray-50 active:bg-gray-100 transition-colors ${
                      isCurrent ? 'border-l-3 border-l-primary bg-purple-50/50' : ''
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                      style={{ backgroundColor: topic.color + '15' }}
                    >
                      {topic.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">{topic.name}</p>
                        {isCurrent && (
                          <span className="text-[10px] font-medium text-primary bg-purple-50 px-1.5 py-0.5 rounded">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {coveredCount > 0
                          ? `${coveredCount} of ${totalConcepts} concepts`
                          : 'Start'}
                        {lastActive ? ` — ${lastActive}` : ''}
                      </p>
                    </div>
                    {topic.progressPercent > 0 ? (
                      <ProgressRing percent={topic.progressPercent} size={28} strokeWidth={2.5} color={topic.color} />
                    ) : (
                      <span className="text-xs font-medium text-primary">Start</span>
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

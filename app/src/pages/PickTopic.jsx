import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TOPICS } from '../data/topics'
import { useStore } from '../hooks/useStore'
import Icon from '../components/Icon'

export default function PickTopic() {
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()
  const { updateUser, updateTopicProgress, checkStreak } = useStore()

  const handleStart = () => {
    if (!selected) return
    updateUser({
      onboardingComplete: true,
    })
    updateTopicProgress(selected, {
      status: 'in_progress',
      lastActiveAt: new Date().toISOString(),
    })
    checkStreak()
    navigate(`/preferences?topic=${selected}`)
  }

  return (
    <div className="h-full flex flex-col bg-surface">
      <div className="flex-1 overflow-y-auto px-6 pt-12 pb-4">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-headline text-ink"
        >
          What are you most curious about?
        </motion.h1>

        <div className="grid grid-cols-2 gap-3 mt-6">
          {TOPICS.map((topic, i) => {
            const isActive = !topic.isComingSoon
            const isSelected = selected === topic.id

            return (
              <motion.button
                key={topic.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                onClick={() => isActive && setSelected(topic.id)}
                disabled={!isActive}
                className={`relative text-left p-4 rounded-2xl border transition-all tap-target ${
                  isSelected
                    ? 'border-primary bg-primary/8 ring-2 ring-primary'
                    : isActive
                    ? 'border-line-subtle bg-surface hover:border-line shadow-theme'
                    : 'border-line-subtle bg-bg opacity-40'
                }`}
              >
                <div
                  className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full"
                  style={{ backgroundColor: topic.color }}
                />
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 ml-1"
                  style={{ backgroundColor: topic.color + '14' }}
                >
                  <Icon name={topic.iconId} size={18} style={{ color: topic.color }} />
                </div>
                <p className={`text-[15px] font-semibold ml-1 tracking-tight ${isActive ? 'text-ink' : 'text-ink-tertiary'}`}>
                  {topic.name}
                </p>
                <p className={`text-caption mt-0.5 ml-1 ${isActive ? 'text-ink-secondary' : 'text-ink-tertiary'}`}>
                  {topic.isComingSoon ? 'Coming Soon' : topic.subtitle}
                </p>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2.5 right-2.5 w-6 h-6 bg-primary rounded-lg flex items-center justify-center"
                  >
                    <Icon name="check" size={14} className="text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>

        <p className="text-caption text-ink-tertiary text-center mt-5">
          Pick one to start — you can explore others anytime
        </p>
      </div>

      <div className="px-6 pb-10 pt-3 bg-surface border-t border-line-subtle">
        <button
          onClick={handleStart}
          disabled={!selected}
          className={`w-full font-semibold text-[17px] py-4 rounded-2xl transition-all tap-target ${
            selected
              ? 'bg-primary text-white shadow-theme-md'
              : 'bg-surface-alt text-ink-tertiary cursor-not-allowed'
          }`}
        >
          Start Learning
        </button>
      </div>
    </div>
  )
}

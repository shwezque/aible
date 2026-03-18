import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TOPICS } from '../data/topics'
import { useStore } from '../hooks/useStore'

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
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto px-6 pt-12 pb-4">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold text-gray-900"
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => isActive && setSelected(topic.id)}
                disabled={!isActive}
                className={`relative text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-primary bg-purple-50 ring-2 ring-primary'
                    : isActive
                    ? 'border-gray-200 bg-white hover:border-gray-300 active:bg-gray-50'
                    : 'border-gray-100 bg-gray-50 opacity-50'
                }`}
              >
                <div
                  className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full"
                  style={{ backgroundColor: topic.color }}
                />
                <div className="text-2xl mb-2 ml-1">{topic.icon}</div>
                <p className={`text-[15px] font-semibold ml-1 ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                  {topic.name}
                </p>
                <p className={`text-[13px] mt-0.5 ml-1 ${isActive ? 'text-gray-500' : 'text-gray-400'}`}>
                  {topic.isComingSoon ? 'Coming Soon' : topic.subtitle}
                </p>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                  >
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>

        <p className="text-[13px] text-gray-400 text-center mt-4">
          Pick one to start — you can explore others anytime
        </p>
      </div>

      <div className="px-6 pb-10 pt-3 bg-white border-t border-gray-100">
        <button
          onClick={handleStart}
          disabled={!selected}
          className={`w-full font-semibold text-lg py-3.5 rounded-xl transition-all ${
            selected
              ? 'bg-primary text-white hover:bg-primary-dark active:scale-[0.98]'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Start Learning
        </button>
      </div>
    </div>
  )
}

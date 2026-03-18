import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../hooks/useStore'

const LEVELS = [
  { value: 'none', label: 'Brand new', desc: "I've heard about AI but never really used it" },
  { value: 'some', label: "I've played with ChatGPT", desc: 'Tried a few things but nothing consistent' },
  { value: 'regular', label: 'I use AI tools regularly', desc: 'Part of my workflow already' },
]

export default function Preferences() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const topicId = searchParams.get('topic')
  const { updateUser } = useStore()

  const handleSelect = (level) => {
    updateUser({ experienceLevel: level })
    navigate(`/chat/${topicId}`)
  }

  const handleSkip = () => {
    navigate(`/chat/${topicId}`)
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-5 pt-4 flex justify-end">
        <button onClick={handleSkip} className="text-sm text-gray-400 font-medium">
          Skip
        </button>
      </div>

      <div className="flex-1 px-6 pt-6 pb-4">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-semibold text-gray-900"
        >
          One quick thing...
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-base text-gray-500 mt-1"
        >
          How much do you know about AI?
        </motion.p>

        <div className="mt-6 space-y-3">
          {LEVELS.map((opt, i) => (
            <motion.button
              key={opt.value}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              onClick={() => handleSelect(opt.value)}
              className="w-full text-left px-4 py-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300 active:bg-gray-50 transition-all"
            >
              <p className="text-[15px] font-semibold text-gray-900">{opt.label}</p>
              <p className="text-[13px] text-gray-500 mt-0.5">{opt.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

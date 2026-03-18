import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../hooks/useStore'
import { LEARNING_STYLES } from '../data/topics'

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
  const [step, setStep] = useState(1)

  const handleLevelSelect = (level) => {
    updateUser({ experienceLevel: level })
    setStep(2)
  }

  const handleStyleSelect = (styleId) => {
    updateUser({ learningStyle: styleId })
    navigate(`/chat/${topicId}`)
  }

  const handleSkip = () => {
    navigate(`/chat/${topicId}`)
  }

  return (
    <div className="h-full flex flex-col bg-surface">
      <div className="px-5 pt-4 flex justify-end">
        <button onClick={handleSkip} className="text-sm text-ink-tertiary font-medium">
          Skip
        </button>
      </div>

      <div className="flex-1 px-6 pt-6 pb-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-lg font-semibold text-ink">
                One quick thing...
              </p>
              <p className="text-base text-ink-secondary mt-1">
                How much do you know about AI?
              </p>

              <div className="mt-6 space-y-3">
                {LEVELS.map((opt, i) => (
                  <motion.button
                    key={opt.value}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    onClick={() => handleLevelSelect(opt.value)}
                    className="w-full text-left px-4 py-4 rounded-xl border border-line bg-surface hover:border-ink-tertiary active:bg-surface-alt transition-all"
                  >
                    <p className="text-[15px] font-semibold text-ink">{opt.label}</p>
                    <p className="text-[13px] text-ink-secondary mt-0.5">{opt.desc}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-lg font-semibold text-ink">
                How do you learn best?
              </p>
              <p className="text-base text-ink-secondary mt-1">
                Pick the style that feels most natural to you
              </p>

              <div className="mt-6 space-y-3">
                {LEARNING_STYLES.map((style, i) => (
                  <motion.button
                    key={style.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.04 }}
                    onClick={() => handleStyleSelect(style.id)}
                    className="w-full text-left px-4 py-3.5 rounded-xl border border-line bg-surface hover:border-ink-tertiary active:bg-surface-alt transition-all flex items-start gap-3"
                  >
                    <span className="text-xl mt-0.5">{style.icon}</span>
                    <div>
                      <p className="text-[15px] font-semibold text-ink">{style.label}</p>
                      <p className="text-[13px] text-ink-secondary mt-0.5">{style.desc}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

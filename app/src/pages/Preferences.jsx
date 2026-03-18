import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../hooks/useStore'
import { LEARNING_STYLES } from '../data/topics'
import Icon from '../components/Icon'

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
      <div className="px-5 pt-4 flex items-center justify-between">
        {/* Step indicator */}
        <div className="flex items-center gap-2">
          <div className={`w-8 h-1 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-line'}`} />
          <div className={`w-8 h-1 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-line'}`} />
        </div>
        <button onClick={handleSkip} className="text-caption text-ink-tertiary tap-target">
          Skip
        </button>
      </div>

      <div className="flex-1 px-6 pt-8 pb-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-headline text-ink">
                One quick thing...
              </p>
              <p className="text-body text-ink-secondary mt-1.5">
                How much do you know about AI?
              </p>

              <div className="mt-8 space-y-3">
                {LEVELS.map((opt, i) => (
                  <motion.button
                    key={opt.value}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    onClick={() => handleLevelSelect(opt.value)}
                    className="w-full text-left px-5 py-4 rounded-2xl border border-line-subtle bg-surface shadow-theme tap-target transition-all hover:border-line"
                  >
                    <p className="text-[15px] font-semibold text-ink">{opt.label}</p>
                    <p className="text-caption text-ink-secondary mt-0.5">{opt.desc}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-headline text-ink">
                How do you learn best?
              </p>
              <p className="text-body text-ink-secondary mt-1.5">
                Pick the style that feels most natural to you
              </p>

              <div className="mt-8 space-y-3">
                {LEARNING_STYLES.map((style, i) => (
                  <motion.button
                    key={style.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.04 }}
                    onClick={() => handleStyleSelect(style.id)}
                    className="w-full text-left px-5 py-4 rounded-2xl border border-line-subtle bg-surface shadow-theme tap-target transition-all hover:border-line flex items-start gap-3.5"
                  >
                    <div className="w-9 h-9 rounded-xl bg-surface-alt flex items-center justify-center mt-0.5 shrink-0">
                      <Icon name={style.iconId} size={18} className="text-ink-secondary" />
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-ink">{style.label}</p>
                      <p className="text-caption text-ink-secondary mt-0.5">{style.desc}</p>
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

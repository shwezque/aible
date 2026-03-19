import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../hooks/useStore'
import { LEARNING_STYLES } from '../data/topics'

const STYLE_COLORS = {
  metaphor: { bg: '#7C3AED', light: '#7C3AED18' },
  stories: { bg: '#F59E0B', light: '#F59E0B18' },
  stepbystep: { bg: '#14B8A6', light: '#14B8A618' },
  socratic: { bg: '#3B82F6', light: '#3B82F618' },
  visual: { bg: '#F43F5E', light: '#F43F5E18' },
  eli5: { bg: '#8B5CF6', light: '#8B5CF618' },
}

const STYLE_ILLUSTRATIONS = {
  metaphor: (color) => (
    <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
      <circle cx="14" cy="20" r="8" stroke={color} strokeWidth="2" />
      <circle cx="26" cy="20" r="8" stroke={color} strokeWidth="2" />
      <path d="M20 14v12" stroke={color} strokeWidth="2" strokeDasharray="2 2" />
    </svg>
  ),
  stories: (color) => (
    <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
      <rect x="8" y="6" width="24" height="28" rx="3" stroke={color} strokeWidth="2" />
      <path d="M14 14h12M14 20h8M14 26h10" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="30" cy="32" r="4" fill={color} opacity="0.2" />
    </svg>
  ),
  stepbystep: (color) => (
    <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
      <circle cx="12" cy="10" r="4" stroke={color} strokeWidth="2" />
      <circle cx="20" cy="20" r="4" stroke={color} strokeWidth="2" />
      <circle cx="28" cy="30" r="4" stroke={color} strokeWidth="2" />
      <path d="M14.5 13L17.5 17M22.5 23L25.5 27" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  socratic: (color) => (
    <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
      <path d="M20 8a10 10 0 110 20 10 10 0 010-20z" stroke={color} strokeWidth="2" />
      <path d="M17 16c0-2 1.5-3 3-3s3 1 3 3c0 1.5-1.5 2-3 3v1" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="26" r="1" fill={color} />
    </svg>
  ),
  visual: (color) => (
    <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
      <path d="M6 30l8-12 6 8 4-4 10 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="28" cy="12" r="4" stroke={color} strokeWidth="2" />
    </svg>
  ),
  eli5: (color) => (
    <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
      <rect x="6" y="10" width="28" height="20" rx="10" stroke={color} strokeWidth="2" />
      <circle cx="15" cy="20" r="2" fill={color} />
      <circle cx="25" cy="20" r="2" fill={color} />
      <path d="M17 24c1.5 2 4.5 2 6 0" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
}

export default function Preferences() {
  const navigate = useNavigate()
  const { updateUser } = useStore()

  const handleStyleSelect = (styleId) => {
    updateUser({ learningStyle: styleId })
    navigate('/pick-topic')
  }

  return (
    <div className="h-full flex flex-col bg-surface">
      <div className="px-5 pt-4 flex justify-end">
        <button onClick={() => navigate('/pick-topic')} className="text-[14px] text-ink-tertiary tap-target">
          Skip
        </button>
      </div>

      <div className="flex-1 px-6 pt-6 pb-6 overflow-y-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-headline text-ink"
        >
          How do you learn best?
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-body text-ink-secondary mt-1.5 mb-6"
        >
          This shapes how your tutors teach you
        </motion.p>

        <div className="grid grid-cols-2 gap-3">
          {LEARNING_STYLES.map((style, i) => {
            const colors = STYLE_COLORS[style.id] || { bg: '#7C3AED', light: '#7C3AED18' }
            const Illustration = STYLE_ILLUSTRATIONS[style.id]
            return (
              <motion.button
                key={style.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.04, duration: 0.3 }}
                onClick={() => handleStyleSelect(style.id)}
                className="text-left p-4 rounded-2xl border border-line-subtle bg-surface tap-target transition-all hover:shadow-theme-md group"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-105"
                  style={{ backgroundColor: colors.light }}
                >
                  {Illustration ? Illustration(colors.bg) : null}
                </div>
                <p className="text-[15px] font-semibold text-ink tracking-tight leading-tight">
                  {style.label}
                </p>
                <p className="text-[12px] text-ink-tertiary mt-1 leading-snug">
                  {style.desc}
                </p>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

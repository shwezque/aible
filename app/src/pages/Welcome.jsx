import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import logoFull from '../assets/logo-full.png'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="h-full flex flex-col bg-surface px-6">
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.img
          src={logoFull}
          alt="aible"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="h-28 mb-8"
        />

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="text-display text-ink text-center"
        >
          Learn from experts who speak your language
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-body text-ink-secondary text-center mt-3 max-w-[300px] leading-relaxed"
        >
          Tutors that adapt to how you learn, explain things in plain language, and let you go at your own pace.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="pb-10"
      >
        <button
          onClick={() => navigate('/learn-style')}
          className="w-full bg-primary text-white font-semibold text-[17px] py-4 rounded-2xl tap-target shadow-theme-md"
        >
          Get Started
        </button>
      </motion.div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../store/AppContext'

export default function Welcome() {
  const navigate = useNavigate()
  const { onboarded, name, firstLessonDone, dailyGoalSet } = useApp()

  const handleGetStarted = () => {
    if (dailyGoalSet) {
      navigate('/home')
    } else if (firstLessonDone) {
      navigate('/signup')
    } else if (onboarded) {
      navigate('/home')
    } else {
      navigate('/onboarding')
    }
  }

  const isReturning = onboarded && name

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 bg-white">
      <motion.div
        className="flex flex-col items-center gap-6 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Mascot */}
        <motion.div
          className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-lg"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-5xl">✨</span>
        </motion.div>

        {/* Logo */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text-primary tracking-tight">
            Aible
          </h1>
          <p className="text-lg text-text-secondary mt-1">Be AI-able.</p>
        </div>

        {isReturning && (
          <p className="text-text-secondary">
            Welcome back, {name}
          </p>
        )}
      </motion.div>

      <div className="w-full mt-auto pb-12 space-y-3">
        <motion.button
          className="w-full py-4 bg-primary text-white font-semibold text-lg rounded-2xl shadow-md"
          whileTap={{ scale: 0.97 }}
          onClick={handleGetStarted}
        >
          {isReturning ? 'Continue' : 'Get Started'}
        </motion.button>

        {!isReturning && (
          <button
            className="w-full py-3 text-text-secondary text-sm"
            onClick={() => navigate('/signup')}
          >
            I already have an account
          </button>
        )}
      </div>
    </div>
  )
}

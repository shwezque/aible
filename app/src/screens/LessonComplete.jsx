import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../store/AppContext'
import { STREAK_MESSAGES } from '../data/constants'
import Confetti from '../components/Confetti'

export default function LessonComplete() {
  const navigate = useNavigate()
  const app = useApp()
  const {
    _lastEarnedXp: earnedXp = 0,
    _lastPerfect: perfect = false,
    _lastScore: score = 0,
    _lastTotal: total = 0,
    _streakMilestone: streakMilestone,
    completedLessons,
    firstLessonDone,
    accountCreated,
    dailyGoalSet,
    dailyGoalMet,
    canPlayLesson,
    streak,
  } = app

  const isFirstLesson = completedLessons.length === 1

  const handleContinue = () => {
    if (!accountCreated && isFirstLesson) {
      navigate('/signup', { replace: true })
    } else if (!dailyGoalSet) {
      navigate('/daily-goal', { replace: true })
    } else if (!canPlayLesson) {
      navigate('/paywall', { replace: true })
    } else {
      navigate('/home', { replace: true })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 bg-white relative overflow-hidden">
      <Confetti />

      <motion.div
        className="flex flex-col items-center gap-4 w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Mascot celebrating */}
        <motion.div
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <span className="text-3xl">🎉</span>
        </motion.div>

        <h1 className="text-2xl font-bold text-text-primary">Lesson Complete!</h1>

        {isFirstLesson && (
          <div className="text-center">
            <p className="text-primary font-semibold">You just learned your first AI skill!</p>
            <p className="text-sm text-text-secondary mt-1">You're ahead of most people. Keep going.</p>
          </div>
        )}

        {/* Stats */}
        <div className="w-full bg-surface rounded-2xl p-5 space-y-3 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">Accuracy</span>
            <span className={`font-bold ${score === total ? 'text-success' : 'text-text-primary'}`}>
              {score}/{total} correct
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Exercises</span>
              <span className="text-xp font-semibold">+{total * 10} XP</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Completion bonus</span>
              <span className="text-xp font-semibold">+50 XP</span>
            </div>
            {perfect && (
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Perfect bonus</span>
                <span className="text-xp font-semibold">+20 XP</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-2 flex justify-between">
              <span className="font-semibold text-text-primary">Total</span>
              <motion.span
                className="font-bold text-lg text-xp"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                +{earnedXp} XP
              </motion.span>
            </div>
          </div>
        </div>

        {perfect && (
          <motion.div
            className="flex items-center gap-2 text-xp font-bold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            💎 Perfect!
          </motion.div>
        )}

        {dailyGoalMet && (
          <motion.div
            className="bg-success/10 text-success font-semibold px-4 py-2 rounded-full text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Daily goal reached!
          </motion.div>
        )}

        {streakMilestone && STREAK_MESSAGES[streakMilestone] && (
          <motion.div
            className="bg-streak/10 text-streak font-semibold px-4 py-3 rounded-2xl text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
          >
            <p className="text-lg">🔥 {STREAK_MESSAGES[streakMilestone].headline}</p>
            <p className="text-sm font-normal mt-1">{STREAK_MESSAGES[streakMilestone].subtext}</p>
          </motion.div>
        )}
      </motion.div>

      <div className="w-full mt-auto pb-12">
        <motion.button
          className="w-full py-4 bg-primary text-white font-semibold text-lg rounded-2xl"
          whileTap={{ scale: 0.97 }}
          onClick={handleContinue}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Continue
        </motion.button>
      </div>
    </div>
  )
}

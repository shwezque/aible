import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../store/AppContext'
import { DAILY_GOALS } from '../data/constants'

export default function DailyGoalSelect() {
  const navigate = useNavigate()
  const { update } = useApp()
  const [selected, setSelected] = useState('steady')

  const handleSetGoal = () => {
    update({ dailyGoal: selected, dailyGoalSet: true })
    navigate('/home', { replace: true })
  }

  return (
    <div className="flex flex-col h-full px-6 pt-16 pb-8 bg-white">
      <motion.div
        className="flex-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          How much do you want to learn each day?
        </h1>
        <p className="text-text-secondary mb-8">You can change this anytime.</p>

        <div className="space-y-3">
          {DAILY_GOALS.map(goal => (
            <motion.button
              key={goal.id}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-colors relative ${
                selected === goal.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-100 bg-surface'
              }`}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(goal.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-text-primary">{goal.title}</p>
                  <p className="text-sm text-text-secondary">{goal.detail}</p>
                </div>
                {goal.recommended && (
                  <span className="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-1 rounded-full">
                    Recommended
                  </span>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.button
        className="w-full py-4 bg-primary text-white font-semibold text-lg rounded-2xl"
        whileTap={{ scale: 0.97 }}
        onClick={handleSetGoal}
      >
        Set my goal
      </motion.button>
    </div>
  )
}

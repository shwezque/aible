import { motion } from 'framer-motion'
import { useApp } from '../store/AppContext'
import { BADGES } from '../data/constants'

export default function Badges() {
  const { badges: earned } = useApp()

  return (
    <div className="px-5 pt-6">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Achievements</h1>

      {earned.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mb-4">
            <span className="text-3xl">🏆</span>
          </div>
          <p className="text-text-secondary text-center">Complete lessons to earn badges</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {BADGES.map(badge => {
            const isEarned = earned.includes(badge.id)
            return (
              <motion.div
                key={badge.id}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl ${
                  isEarned ? 'bg-xp/10' : 'bg-surface'
                }`}
                whileTap={isEarned ? { scale: 0.95 } : {}}
                initial={isEarned ? { scale: 0.8, opacity: 0 } : {}}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                  isEarned ? 'bg-xp/20' : 'bg-gray-100'
                }`}>
                  {isEarned ? badge.icon : '❓'}
                </div>
                <p className={`text-xs font-semibold text-center ${
                  isEarned ? 'text-text-primary' : 'text-gray-400'
                }`}>
                  {isEarned ? badge.name : '???'}
                </p>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

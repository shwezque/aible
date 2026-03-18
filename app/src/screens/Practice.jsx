import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../store/AppContext'
import modules from '../data/lessons'

export default function Practice() {
  const navigate = useNavigate()
  const { completedLessons } = useApp()

  const completedLessonData = modules.flatMap(mod =>
    mod.lessons
      .filter(l => completedLessons.includes(l.id))
      .map(l => ({ ...l, moduleTitle: mod.title }))
  )

  return (
    <div className="px-5 pt-6">
      <h1 className="text-2xl font-bold text-text-primary mb-1">Practice</h1>
      <p className="text-text-secondary text-sm mb-6">Review what you've learned.</p>

      {completedLessonData.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mb-4">
            <span className="text-3xl">✨</span>
          </div>
          <p className="text-text-secondary text-center">
            Complete your first lesson to unlock practice!
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {completedLessonData.map(lesson => (
            <motion.button
              key={lesson.id}
              className="w-full flex items-center gap-4 p-4 bg-surface rounded-2xl text-left"
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/lesson/${lesson.id}`)}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-sm">🔄</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">{lesson.title}</p>
                <p className="text-xs text-text-secondary truncate">{lesson.moduleTitle}</p>
              </div>
              <span className="text-xs text-primary font-semibold">Practice</span>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  )
}

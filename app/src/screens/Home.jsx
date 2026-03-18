import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../store/AppContext'
import { DAILY_GOALS } from '../data/constants'
import modules from '../data/lessons'

export default function Home() {
  const navigate = useNavigate()
  const app = useApp()
  const {
    streak, xp, completedLessons, currentModuleIndex, currentLessonIndex,
    dailyGoal, dailyGoalMet, lessonsCompletedToday, canPlayLesson,
    getLevel,
  } = app

  const level = getLevel()
  const goalTarget = DAILY_GOALS.find(g => g.id === dailyGoal)?.target || 2
  const goalProgress = Math.min(lessonsCompletedToday / goalTarget, 1)

  const handleLessonTap = (lesson, isLocked, isCurrent) => {
    if (isLocked) return
    if (!canPlayLesson && !completedLessons.includes(lesson.id)) {
      navigate('/paywall')
      return
    }
    navigate(`/lesson/${lesson.id}`)
  }

  // Flatten all lessons with their module context
  const allLessons = modules.flatMap((mod, mi) =>
    mod.lessons.map((lesson, li) => ({
      ...lesson,
      moduleIndex: mi,
      lessonIndex: li,
      moduleTitle: mod.title,
      isFirst: li === 0,
    }))
  )

  return (
    <div className="px-5 pt-6">
      {/* Status bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">🔥</span>
          <span className={`font-bold text-lg ${streak > 0 ? 'text-streak' : 'text-gray-300'}`}>
            {streak}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-lg">⭐</span>
          <span className="font-bold text-lg text-xp">{xp}</span>
        </div>

        {/* Daily goal ring */}
        <div className="relative w-10 h-10">
          <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
            <circle cx="18" cy="18" r="15" fill="none" stroke="#E5E7EB" strokeWidth="3" />
            <motion.circle
              cx="18" cy="18" r="15" fill="none" stroke="#7C3AED" strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="94.25"
              initial={{ strokeDashoffset: 94.25 }}
              animate={{ strokeDashoffset: 94.25 * (1 - goalProgress) }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-primary">
            {lessonsCompletedToday}/{goalTarget}
          </span>
        </div>
      </div>

      {dailyGoalMet && (
        <motion.div
          className="bg-success/10 text-success text-sm font-semibold text-center py-2.5 rounded-xl mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Daily goal reached!
        </motion.div>
      )}

      {!canPlayLesson && (
        <motion.div
          className="bg-surface border border-gray-200 text-text-secondary text-sm text-center py-3 px-4 rounded-xl mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          You've completed your free lessons today.{' '}
          <button className="text-primary font-semibold" onClick={() => navigate('/paywall')}>
            Unlock unlimited
          </button>
        </motion.div>
      )}

      {/* Learning Path */}
      <div className="relative pb-8">
        {allLessons.map((lesson, idx) => {
          const isCompleted = completedLessons.includes(lesson.id)
          const isCurrent = lesson.moduleIndex === currentModuleIndex && lesson.lessonIndex === currentLessonIndex
          const isLocked = !isCompleted && !isCurrent

          return (
            <div key={lesson.id}>
              {/* Module header */}
              {lesson.isFirst && (
                <div className="flex items-center gap-3 mb-4 mt-2">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                    {lesson.moduleTitle}
                  </span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>
              )}

              {/* Lesson node */}
              <div
                className="flex items-center gap-4 mb-3"
                style={{ paddingLeft: `${(idx % 3) * 24 + 8}px` }}
              >
                <motion.button
                  className={`relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
                    isCompleted
                      ? 'bg-primary'
                      : isCurrent
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'bg-gray-100'
                  }`}
                  whileTap={!isLocked ? { scale: 0.95 } : {}}
                  onClick={() => handleLessonTap(lesson, isLocked, isCurrent)}
                  {...(isCurrent ? {
                    animate: { scale: [1, 1.08, 1] },
                    transition: { duration: 2, repeat: Infinity },
                  } : {})}
                >
                  {isCompleted ? (
                    <span className="text-white text-lg font-bold">✓</span>
                  ) : isLocked ? (
                    <span className="text-gray-400 text-sm">🔒</span>
                  ) : (
                    <span className="text-primary text-lg font-bold">{lesson.lessonIndex + 1}</span>
                  )}

                  {isCurrent && (
                    <motion.div
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center"
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="text-[10px]">✨</span>
                    </motion.div>
                  )}
                </motion.button>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${
                    isLocked ? 'text-gray-400' : 'text-text-primary'
                  }`}>
                    {lesson.title}
                  </p>
                  <p className={`text-xs truncate ${
                    isLocked ? 'text-gray-300' : 'text-text-secondary'
                  }`}>
                    {lesson.concept}
                  </p>
                </div>
              </div>

              {/* Connector line */}
              {idx < allLessons.length - 1 && !allLessons[idx + 1].isFirst && (
                <div
                  className="h-2 w-0.5 bg-gray-200 mb-1"
                  style={{ marginLeft: `${(idx % 3) * 24 + 34}px` }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

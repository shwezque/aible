import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../store/AppContext'
import { CORRECT_MESSAGES, INCORRECT_MESSAGES } from '../data/constants'
import modules from '../data/lessons'
import PromptBuilder from '../components/exercises/PromptBuilder'
import OutputJudge from '../components/exercises/OutputJudge'
import FillBlank from '../components/exercises/FillBlank'
import RealWorld from '../components/exercises/RealWorld'

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function Lesson() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const { completeLesson, canPlayLesson, completedLessons } = useApp()

  // Guard: redirect to paywall if free tier limit reached (non-replay)
  const isReplay = completedLessons.includes(lessonId)
  if (!canPlayLesson && !isReplay) {
    navigate('/paywall', { replace: true })
    return null
  }

  const lesson = useMemo(() => {
    for (const mod of modules) {
      const found = mod.lessons.find(l => l.id === lessonId)
      if (found) return found
    }
    return null
  }, [lessonId])

  const [phase, setPhase] = useState('intro') // intro, exercise, feedback
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [feedbackMessage, setFeedbackMessage] = useState('')

  if (!lesson) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-text-secondary">Lesson not found</p>
      </div>
    )
  }

  const exercises = lesson.exercises
  const total = exercises.length
  const currentExercise = exercises[exerciseIndex]
  const progress = phase === 'intro' ? 0 : (exerciseIndex + (phase === 'feedback' ? 1 : 0)) / total

  const handleClose = () => {
    navigate(-1)
  }

  const handleStartExercises = () => {
    setPhase('exercise')
  }

  const handleCheck = (answer, correct) => {
    setSelectedAnswer(answer)
    setIsCorrect(correct)
    if (correct) {
      setScore(s => s + 1)
      setFeedbackMessage(pickRandom(CORRECT_MESSAGES))
    } else {
      setFeedbackMessage(pickRandom(INCORRECT_MESSAGES))
    }
    setPhase('feedback')
  }

  const handleContinue = () => {
    if (exerciseIndex + 1 >= total) {
      // Lesson complete
      completeLesson(lessonId, score, total)
      navigate('/lesson-complete', { replace: true })
    } else {
      setExerciseIndex(i => i + 1)
      setSelectedAnswer(null)
      setIsCorrect(null)
      setPhase('exercise')
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top bar */}
      {phase !== 'intro' && (
        <div className="flex items-center gap-3 px-4 pt-4 pb-2">
          <button onClick={handleClose} className="text-text-secondary text-xl font-light w-8 h-8 flex items-center justify-center">
            ✕
          </button>
          <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <ConceptIntro
              key="intro"
              lesson={lesson}
              onStart={handleStartExercises}
              onClose={handleClose}
            />
          )}

          {phase === 'exercise' && (
            <ExerciseScreen
              key={`exercise-${exerciseIndex}`}
              exercise={currentExercise}
              onCheck={handleCheck}
            />
          )}

          {phase === 'feedback' && (
            <motion.div
              key="feedback"
              className="flex flex-col h-full"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
            >
              {/* Exercise stays visible behind feedback */}
              <div className="flex-1 px-5 pt-4 opacity-50 pointer-events-none">
                <p className="text-sm text-text-secondary mb-2">{currentExercise.instruction}</p>
              </div>

              {/* Feedback overlay */}
              <motion.div
                className={`px-5 py-6 rounded-t-3xl ${
                  isCorrect ? 'bg-success/10' : 'bg-error/10'
                }`}
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
                <p className={`font-bold text-lg mb-2 ${
                  isCorrect ? 'text-success' : 'text-amber-600'
                }`}>
                  {feedbackMessage}
                </p>
                <p className="text-sm text-text-secondary mb-4">
                  {currentExercise.explanation}
                </p>
                <motion.button
                  className={`w-full py-4 rounded-2xl font-semibold text-white ${
                    isCorrect ? 'bg-success' : 'bg-amber-500'
                  }`}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleContinue}
                >
                  {isCorrect ? 'Continue' : 'Got it'}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function ConceptIntro({ lesson, onStart, onClose }) {
  return (
    <motion.div
      className="flex flex-col h-full px-6 pt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <button onClick={onClose} className="self-start text-text-secondary text-xl font-light w-8 h-8 flex items-center justify-center mb-4">
        ✕
      </button>

      <div className="flex-1">
        {/* Mascot */}
        <motion.div
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center mb-6"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <span className="text-2xl">💡</span>
        </motion.div>

        <h1 className="text-2xl font-bold text-text-primary mb-2">{lesson.title}</h1>
        <p className="text-text-secondary mb-6">{lesson.concept}</p>

        <div className="bg-surface rounded-2xl p-4 space-y-3">
          <p className="text-sm text-text-primary leading-relaxed">{lesson.introHook}</p>

          {lesson.introExample && (
            <div className="space-y-2 pt-2">
              <div className="flex gap-2 items-start">
                <span className="text-error text-sm mt-0.5">✕</span>
                <p className="text-sm text-text-secondary italic">"{lesson.introExample.bad}"</p>
              </div>
              <div className="flex gap-2 items-start">
                <span className="text-success text-sm mt-0.5">✓</span>
                <p className="text-sm text-text-primary">"{lesson.introExample.good}"</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="py-6">
        <motion.button
          className="w-full py-4 bg-primary text-white font-semibold text-lg rounded-2xl"
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
        >
          Let's practice!
        </motion.button>
      </div>
    </motion.div>
  )
}

function ExerciseScreen({ exercise, onCheck }) {
  const props = { exercise, onCheck }

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
    >
      {exercise.type === 'output-judge' && <OutputJudge {...props} />}
      {exercise.type === 'fill-blank' && <FillBlank {...props} />}
      {exercise.type === 'real-world' && <RealWorld {...props} />}
      {exercise.type === 'prompt-builder' && <PromptBuilder {...props} />}
    </motion.div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../store/AppContext'
import { ROLES, GOALS, EXPERIENCE_LEVELS } from '../data/constants'
import modules from '../data/lessons'

const steps = ['role', 'goal', 'experience']

export default function Onboarding() {
  const navigate = useNavigate()
  const { update } = useApp()
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState(null)

  const handleSelect = (value) => {
    setSelected(value)

    setTimeout(() => {
      if (step === 0) {
        update({ role: value })
      } else if (step === 1) {
        update({ goal: value })
      } else if (step === 2) {
        const exp = EXPERIENCE_LEVELS.find(e => e.id === value)
        update({
          experience: value,
          currentModuleIndex: exp.startModule,
          currentLessonIndex: exp.startLesson,
          difficultyTier: value,
          onboarded: true,
        })
        // Go straight to first lesson
        const modIdx = exp.startModule
        const lesIdx = exp.startLesson
        const lesson = modules[modIdx]?.lessons[lesIdx]
        if (lesson) {
          navigate(`/lesson/${lesson.id}`)
        } else {
          navigate('/home')
        }
        return
      }

      setStep(s => s + 1)
      setSelected(null)
    }, 300)
  }

  return (
    <div className="flex flex-col h-full px-6 pt-16 pb-8 bg-white">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-10">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i <= step ? 'bg-primary' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <StepContent key="role" title="What do you do?">
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map(role => (
                <OptionCard
                  key={role.id}
                  icon={role.icon}
                  label={role.label}
                  selected={selected === role.id}
                  onClick={() => handleSelect(role.id)}
                />
              ))}
            </div>
          </StepContent>
        )}

        {step === 1 && (
          <StepContent key="goal" title="What's your goal?">
            <div className="space-y-3">
              {GOALS.map(goal => (
                <OptionCardWide
                  key={goal.id}
                  icon={goal.icon}
                  title={goal.title}
                  subtitle={goal.subtitle}
                  selected={selected === goal.id}
                  onClick={() => handleSelect(goal.id)}
                />
              ))}
            </div>
          </StepContent>
        )}

        {step === 2 && (
          <StepContent key="experience" title="How much have you used AI?">
            <div className="space-y-3">
              {EXPERIENCE_LEVELS.map(exp => (
                <OptionCardWide
                  key={exp.id}
                  icon={exp.emoji}
                  title={exp.title}
                  subtitle={exp.subtitle}
                  selected={selected === exp.id}
                  onClick={() => handleSelect(exp.id)}
                />
              ))}
            </div>
          </StepContent>
        )}
      </AnimatePresence>
    </div>
  )
}

function StepContent({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.25 }}
    >
      <h1 className="text-2xl font-bold text-text-primary mb-6">{title}</h1>
      {children}
    </motion.div>
  )
}

function OptionCard({ icon, label, selected, onClick }) {
  return (
    <motion.button
      className={`flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 transition-colors ${
        selected ? 'border-primary bg-primary/5' : 'border-gray-100 bg-surface'
      }`}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
    >
      <span className="text-3xl">{icon}</span>
      <span className="text-sm font-medium text-text-primary">{label}</span>
    </motion.button>
  )
}

function OptionCardWide({ icon, title, subtitle, selected, onClick }) {
  return (
    <motion.button
      className={`flex items-center gap-4 w-full p-4 rounded-2xl border-2 text-left transition-colors ${
        selected ? 'border-primary bg-primary/5' : 'border-gray-100 bg-surface'
      }`}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="font-semibold text-text-primary">{title}</p>
        <p className="text-sm text-text-secondary">{subtitle}</p>
      </div>
    </motion.button>
  )
}

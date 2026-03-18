import { useState } from 'react'
import { motion } from 'framer-motion'

export default function RealWorld({ exercise, onCheck }) {
  const [selected, setSelected] = useState(null)

  const handleCheck = () => {
    if (selected === null) return
    const correct = selected === exercise.correct
    onCheck(selected, correct)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 px-5 pt-4 pb-4 space-y-3 overflow-y-auto">
        <p className="text-base font-semibold text-text-primary leading-snug">{exercise.instruction}</p>

        {exercise.options.map((option, i) => (
          <motion.button
            key={i}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-colors ${
              selected === i ? 'border-primary bg-primary/5' : 'border-gray-100 bg-surface'
            }`}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelected(i)}
          >
            <p className="text-sm text-text-primary leading-relaxed">{option}</p>
          </motion.button>
        ))}
      </div>

      <div className="px-5 py-4 border-t border-gray-50">
        <motion.button
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-colors ${
            selected !== null ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
          }`}
          whileTap={selected !== null ? { scale: 0.97 } : {}}
          onClick={handleCheck}
          disabled={selected === null}
        >
          Check
        </motion.button>
      </div>
    </div>
  )
}

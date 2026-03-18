import { useState } from 'react'
import { motion } from 'framer-motion'

export default function OutputJudge({ exercise, onCheck }) {
  const [selected, setSelected] = useState(null)

  const handleSelect = (choice) => {
    setSelected(choice)
  }

  const handleCheck = () => {
    if (!selected) return
    const correct = selected === exercise.correct
    onCheck(selected, correct)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 px-5 pt-4 pb-4 space-y-4 overflow-y-auto">
        <p className="text-base font-semibold text-text-primary">{exercise.instruction}</p>

        <motion.button
          className={`w-full text-left p-4 rounded-2xl border-2 transition-colors ${
            selected === 'A' ? 'border-primary bg-primary/5' : 'border-gray-100 bg-surface'
          }`}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelect('A')}
        >
          <span className="text-xs font-bold text-text-secondary mb-1 block">Output A</span>
          <p className="text-sm text-text-primary leading-relaxed">{exercise.optionA}</p>
        </motion.button>

        <motion.button
          className={`w-full text-left p-4 rounded-2xl border-2 transition-colors ${
            selected === 'B' ? 'border-primary bg-primary/5' : 'border-gray-100 bg-surface'
          }`}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelect('B')}
        >
          <span className="text-xs font-bold text-text-secondary mb-1 block">Output B</span>
          <p className="text-sm text-text-primary leading-relaxed">{exercise.optionB}</p>
        </motion.button>
      </div>

      <div className="px-5 py-4 border-t border-gray-50">
        <motion.button
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-colors ${
            selected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
          }`}
          whileTap={selected ? { scale: 0.97 } : {}}
          onClick={handleCheck}
          disabled={!selected}
        >
          Check
        </motion.button>
      </div>
    </div>
  )
}

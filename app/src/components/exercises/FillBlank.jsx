import { useState } from 'react'
import { motion } from 'framer-motion'

export default function FillBlank({ exercise, onCheck }) {
  const [filled, setFilled] = useState(Array(exercise.blanks).fill(null))
  const [bankUsed, setBankUsed] = useState([])

  const currentBlankIndex = filled.findIndex(f => f === null)

  const handleWordTap = (word) => {
    if (bankUsed.includes(word)) {
      // Deselect from blanks
      const idx = filled.indexOf(word)
      if (idx !== -1) {
        const newFilled = [...filled]
        newFilled[idx] = null
        setFilled(newFilled)
        setBankUsed(bankUsed.filter(w => w !== word))
      }
      return
    }

    if (currentBlankIndex === -1) return

    const newFilled = [...filled]
    newFilled[currentBlankIndex] = word
    setFilled(newFilled)
    setBankUsed([...bankUsed, word])
  }

  const allFilled = filled.every(f => f !== null)

  const handleCheck = () => {
    if (!allFilled) return
    const correct = filled.every((f, i) => f === exercise.correct[i])
    onCheck(filled, correct)
  }

  // Render the template with blanks
  const renderTemplate = () => {
    const parts = []
    let blankIdx = 0
    for (let i = 0; i < exercise.template.length; i++) {
      const part = exercise.template[i]
      if (part === '_____') {
        const val = filled[blankIdx]
        parts.push(
          <span
            key={`blank-${blankIdx}`}
            className={`inline-block min-w-[100px] px-2 py-1 mx-0.5 rounded-lg border-b-2 text-center ${
              val ? 'bg-primary/10 border-primary text-primary font-medium' : 'bg-gray-50 border-gray-300 text-gray-400'
            }`}
          >
            {val || '___'}
          </span>
        )
        blankIdx++
      } else {
        parts.push(
          <span key={`text-${i}`} className="text-text-primary">{part}</span>
        )
      }
    }
    return parts
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 px-5 pt-4 pb-4 space-y-5 overflow-y-auto">
        <p className="text-base font-semibold text-text-primary">{exercise.instruction}</p>

        <div className="bg-surface rounded-2xl p-4">
          <p className="text-sm leading-loose flex flex-wrap items-center gap-y-2">
            {renderTemplate()}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {exercise.wordBank.map((word) => {
            const used = bankUsed.includes(word)
            return (
              <motion.button
                key={word}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  used ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-surface border border-gray-200 text-text-primary'
                }`}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleWordTap(word)}
              >
                {word}
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className="px-5 py-4 border-t border-gray-50">
        <motion.button
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-colors ${
            allFilled ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
          }`}
          whileTap={allFilled ? { scale: 0.97 } : {}}
          onClick={handleCheck}
          disabled={!allFilled}
        >
          Check
        </motion.button>
      </div>
    </div>
  )
}

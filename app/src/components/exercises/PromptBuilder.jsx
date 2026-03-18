import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'

export default function PromptBuilder({ exercise, onCheck }) {
  // Shuffle components for initial display
  const shuffled = useMemo(() => {
    return [...exercise.components].sort(() => Math.random() - 0.5)
  }, [exercise.components])

  const [placed, setPlaced] = useState([])
  const [available, setAvailable] = useState(shuffled)

  const handlePlace = (comp) => {
    setPlaced([...placed, comp])
    setAvailable(available.filter(c => c !== comp))
  }

  const handleRemove = (comp) => {
    setPlaced(placed.filter(c => c !== comp))
    setAvailable([...available, comp])
  }

  const allPlaced = placed.length === exercise.components.length

  const handleCheck = () => {
    if (!allPlaced) return
    // Check if order matches correctOrder
    const correctComponents = exercise.correctOrder.map(i => exercise.components[i])
    const correct = placed.every((comp, i) => comp === correctComponents[i])
    onCheck(placed, correct)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 px-5 pt-4 pb-4 space-y-5 overflow-y-auto">
        <p className="text-base font-semibold text-text-primary">{exercise.instruction}</p>

        {/* Drop zone */}
        <div className="bg-surface rounded-2xl p-4 min-h-[120px] border-2 border-dashed border-gray-200">
          {placed.length === 0 ? (
            <p className="text-sm text-text-secondary text-center py-4">Tap components below to build your prompt</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {placed.map((comp, i) => (
                <motion.button
                  key={`placed-${i}`}
                  className="px-3 py-2.5 rounded-xl text-sm font-medium bg-primary/10 text-primary border border-primary/30"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRemove(comp)}
                  layout
                >
                  {comp}
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Available components */}
        <div className="flex flex-wrap gap-2">
          {available.map((comp, i) => (
            <motion.button
              key={`avail-${comp}`}
              className="px-3 py-2.5 rounded-xl text-sm font-medium bg-white border border-gray-200 text-text-primary shadow-sm"
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePlace(comp)}
              layout
            >
              {comp}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="px-5 py-4 border-t border-gray-50">
        <motion.button
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-colors ${
            allPlaced ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
          }`}
          whileTap={allPlaced ? { scale: 0.97 } : {}}
          onClick={handleCheck}
          disabled={!allPlaced}
        >
          Check
        </motion.button>
      </div>
    </div>
  )
}

import { motion, AnimatePresence } from 'framer-motion'

export default function XpToast({ amount, show, onDone }) {
  return (
    <AnimatePresence onExitComplete={onDone}>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.3, exit: { duration: 0.8 } }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="bg-primary text-white px-5 py-2.5 rounded-full font-bold text-lg shadow-lg flex items-center gap-1.5">
            +{amount} XP ✨
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

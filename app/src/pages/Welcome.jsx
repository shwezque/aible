import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="h-full flex flex-col bg-white px-6">
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mb-8"
        >
          <span className="text-white text-5xl font-bold">a</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-2xl font-bold text-gray-900 text-center"
        >
          Learn AI by talking about it
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="text-base text-gray-500 text-center mt-3 max-w-xs leading-relaxed"
        >
          Chat with expert AI tutors who explain things in plain English. No jargon. No coding. Just conversation.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="pb-10"
      >
        <button
          onClick={() => navigate('/pick-topic')}
          className="w-full bg-primary text-white font-semibold text-lg py-3.5 rounded-xl hover:bg-primary-dark active:scale-[0.98] transition-all"
        >
          Get Started
        </button>
      </motion.div>
    </div>
  )
}

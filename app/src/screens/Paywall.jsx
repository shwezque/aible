import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../store/AppContext'
import { useState } from 'react'

export default function Paywall() {
  const navigate = useNavigate()
  const { update } = useApp()
  const [selectedPlan, setSelectedPlan] = useState('annual')
  const [processing, setProcessing] = useState(false)

  const handleUpgrade = () => {
    setProcessing(true)
    // Simulate Stripe checkout
    setTimeout(() => {
      update({ isPro: true })
      setProcessing(false)
      navigate('/home', { replace: true })
    }, 1500)
  }

  return (
    <div className="flex flex-col h-full px-6 pt-10 pb-8 bg-white">
      <motion.div
        className="flex-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Mascot */}
        <div className="flex justify-center mb-6">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-2xl">🚀</span>
          </motion.div>
        </div>

        <h1 className="text-2xl font-bold text-text-primary text-center mb-2">
          You've completed your free lessons today
        </h1>
        <p className="text-text-secondary text-center mb-8">
          Unlock unlimited learning with Aible Pro.
        </p>

        {/* Feature comparison */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-surface rounded-2xl p-4">
            <p className="text-sm font-bold text-text-secondary mb-3">Free</p>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>3 lessons per day</li>
              <li>1 streak freeze/week</li>
              <li>Basic progress</li>
            </ul>
          </div>
          <div className="bg-primary/5 rounded-2xl p-4 border-2 border-primary">
            <p className="text-sm font-bold text-primary mb-3">Pro</p>
            <ul className="space-y-2 text-sm text-text-primary">
              <li>Unlimited lessons</li>
              <li>Unlimited freezes</li>
              <li>All badges</li>
              <li>Advanced content</li>
            </ul>
          </div>
        </div>

        {/* Plan cards */}
        <div className="space-y-3 mb-6">
          <motion.button
            className={`w-full text-left p-4 rounded-2xl border-2 transition-colors relative ${
              selectedPlan === 'annual' ? 'border-primary bg-primary/5' : 'border-gray-100 bg-surface'
            }`}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedPlan('annual')}
          >
            <span className="absolute -top-2.5 right-3 text-[10px] bg-primary text-white font-bold px-2 py-0.5 rounded-full">
              Best Value
            </span>
            <p className="font-bold text-text-primary">$59.99/year</p>
            <p className="text-sm text-text-secondary">$4.99/mo — Save 50%</p>
          </motion.button>

          <motion.button
            className={`w-full text-left p-4 rounded-2xl border-2 transition-colors ${
              selectedPlan === 'monthly' ? 'border-primary bg-primary/5' : 'border-gray-100 bg-surface'
            }`}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedPlan('monthly')}
          >
            <p className="font-bold text-text-primary">$9.99/month</p>
          </motion.button>
        </div>
      </motion.div>

      <div className="space-y-3">
        <motion.button
          className="w-full py-4 bg-primary text-white font-semibold text-lg rounded-2xl disabled:opacity-50"
          whileTap={{ scale: 0.97 }}
          onClick={handleUpgrade}
          disabled={processing}
        >
          {processing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing your upgrade...
            </span>
          ) : (
            'Start 7-day free trial'
          )}
        </motion.button>
        <p className="text-xs text-text-secondary text-center">
          Cancel anytime. You won't be charged until the trial ends.
        </p>
        <button
          className="w-full py-2 text-text-secondary text-sm"
          onClick={() => navigate('/home', { replace: true })}
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}

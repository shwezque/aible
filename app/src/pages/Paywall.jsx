import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../hooks/useStore'
import Icon from '../components/Icon'
import logoIcon from '../assets/logo-icon.png'

export default function Paywall() {
  const navigate = useNavigate()
  const { updateUser } = useStore()

  const handleUpgrade = () => {
    updateUser({ isPremium: true })
    navigate(-1)
  }

  const features = [
    { feature: 'Daily sessions', free: '2/day', pro: 'Unlimited' },
    { feature: 'All topics', free: true, pro: true },
    { feature: 'XP & streaks', free: true, pro: true },
    { feature: 'Full chat history', free: false, pro: true },
    { feature: 'Priority responses', free: false, pro: true },
  ]

  return (
    <div className="h-full flex flex-col bg-surface">
      {/* Header */}
      <div className="px-4 py-3 flex items-center">
        <button onClick={() => navigate(-1)} className="text-ink-secondary p-1.5 tap-target">
          <Icon name="x-mark" size={22} />
        </button>
      </div>

      <div className="flex-1 px-6 pb-10 flex flex-col">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-4 pb-8"
        >
          <img src={logoIcon} alt="Aible" className="w-16 h-16 rounded-2xl mx-auto mb-5 shadow-theme-md" />
          <h1 className="text-display text-ink">Unlock Aible Pro</h1>
          <p className="text-body text-ink-secondary mt-2">Keep the momentum going with unlimited learning.</p>
        </motion.div>

        {/* Feature Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-alt rounded-2xl p-5"
        >
          {/* Column headers */}
          <div className="flex items-center mb-4 pb-3 border-b border-line-subtle">
            <p className="flex-1" />
            <p className="w-16 text-center text-micro text-ink-tertiary">Free</p>
            <p className="w-16 text-center text-micro text-primary">Pro</p>
          </div>

          <div className="space-y-4">
            {features.map(row => (
              <div key={row.feature} className="flex items-center">
                <p className="flex-1 text-[15px] text-ink">{row.feature}</p>
                <div className="w-16 flex justify-center">
                  {typeof row.free === 'boolean' ? (
                    row.free ? (
                      <Icon name="check" size={16} className="text-ink-tertiary" strokeWidth={2} />
                    ) : (
                      <span className="w-4 h-[1.5px] bg-line rounded-full" />
                    )
                  ) : (
                    <span className="text-sm text-ink-tertiary">{row.free}</span>
                  )}
                </div>
                <div className="w-16 flex justify-center">
                  {typeof row.pro === 'boolean' ? (
                    <Icon name="check" size={16} className="text-primary" strokeWidth={2.5} />
                  ) : (
                    <span className="text-sm font-semibold text-primary">{row.pro}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pricing */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 space-y-3"
        >
          <button
            onClick={handleUpgrade}
            className="w-full bg-primary text-white py-4 rounded-2xl font-semibold text-[17px] tap-target shadow-theme-md"
          >
            Start 7-Day Free Trial
          </button>
          <div className="text-center space-y-1 pt-1">
            <p className="text-[15px] text-ink-secondary">
              Then <span className="font-semibold text-ink">$59.99/year</span>
              <span className="text-caption text-secondary ml-1.5">Best Value</span>
            </p>
            <p className="text-xs text-ink-tertiary">or $9.99/month</p>
          </div>
        </motion.div>

        <div className="mt-auto pt-6">
          <button
            onClick={() => navigate(-1)}
            className="w-full text-center text-caption text-ink-tertiary py-3 tap-target"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}

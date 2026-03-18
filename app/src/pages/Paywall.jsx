import { useNavigate } from 'react-router-dom'
import { useStore } from '../hooks/useStore'

export default function Paywall() {
  const navigate = useNavigate()
  const { updateUser } = useStore()

  const handleUpgrade = () => {
    updateUser({ isPremium: true })
    navigate(-1)
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-4 py-3 flex items-center">
        <button onClick={() => navigate(-1)} className="text-gray-600 p-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 px-6 pb-10 flex flex-col">
        {/* Hero */}
        <div className="text-center pt-6 pb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl font-bold">a</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Unlock Aible Pro</h1>
          <p className="text-base text-gray-500 mt-2">Keep the momentum going with unlimited learning.</p>
        </div>

        {/* Feature Comparison */}
        <div className="bg-gray-50 rounded-xl p-5 space-y-4">
          {[
            { feature: 'Daily sessions', free: '2 per day', pro: 'Unlimited' },
            { feature: 'All topics', free: '✓', pro: '✓' },
            { feature: 'XP & streaks', free: '✓', pro: '✓' },
            { feature: 'Full chat history', free: '—', pro: '✓' },
            { feature: 'Priority responses', free: '—', pro: '✓' },
          ].map(row => (
            <div key={row.feature} className="flex items-center">
              <p className="flex-1 text-sm text-gray-700">{row.feature}</p>
              <p className="w-16 text-center text-sm text-gray-400">{row.free}</p>
              <p className="w-16 text-center text-sm font-semibold text-primary">{row.pro}</p>
            </div>
          ))}
          <div className="flex items-center pt-2 border-t border-gray-200">
            <p className="flex-1" />
            <p className="w-16 text-center text-[11px] text-gray-400 font-medium">Free</p>
            <p className="w-16 text-center text-[11px] text-primary font-medium">Pro</p>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleUpgrade}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold text-base hover:bg-primary-dark active:scale-[0.98] transition-all"
          >
            Start 7-Day Free Trial
          </button>
          <div className="text-center space-y-1">
            <p className="text-sm text-gray-500">
              Then <span className="font-semibold text-gray-700">$59.99/year</span>
              <span className="text-xs text-teal-600 ml-1">(Best Value — $4.99/mo)</span>
            </p>
            <p className="text-xs text-gray-400">or $9.99/month</p>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <button
            onClick={() => navigate(-1)}
            className="w-full text-center text-sm text-gray-400 py-2"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}

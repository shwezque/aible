import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../store/AppContext'

export default function Signup() {
  const navigate = useNavigate()
  const { update, dailyGoalSet } = useApp()
  const [mode, setMode] = useState('signup') // signup | login
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!email.includes('@')) {
      setError('Enter a valid email address')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    // Simulate auth
    setTimeout(() => {
      const name = email.split('@')[0]
      update({
        email,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        accountCreated: true,
      })
      setLoading(false)
      if (dailyGoalSet) {
        navigate('/home', { replace: true })
      } else {
        navigate('/daily-goal', { replace: true })
      }
    }, 800)
  }

  const handleGoogleLogin = () => {
    setLoading(true)
    setTimeout(() => {
      update({
        email: 'user@gmail.com',
        name: 'User',
        accountCreated: true,
      })
      setLoading(false)
      if (dailyGoalSet) {
        navigate('/home', { replace: true })
      } else {
        navigate('/daily-goal', { replace: true })
      }
    }, 800)
  }

  const handleSkip = () => {
    if (dailyGoalSet) {
      navigate('/home', { replace: true })
    } else {
      navigate('/daily-goal', { replace: true })
    }
  }

  return (
    <div className="flex flex-col h-full px-6 pt-16 pb-8 bg-white">
      <motion.div
        className="flex-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          {mode === 'signup' ? 'Create a free account to save your progress' : 'Welcome back'}
        </h1>
        {mode === 'signup' && (
          <p className="text-text-secondary mb-8">Keep your streak alive across all your devices.</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text-primary block mb-1.5">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-surface text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-text-primary block mb-1.5">Password</label>
            <input
              type="password"
              placeholder="8+ characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-surface text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {error && (
            <p className="text-sm text-error">{error}</p>
          )}

          <motion.button
            type="submit"
            className="w-full py-4 bg-primary text-white font-semibold rounded-2xl disabled:opacity-50"
            whileTap={{ scale: 0.97 }}
            disabled={loading}
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              mode === 'signup' ? 'Create Account' : 'Log In'
            )}
          </motion.button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-text-secondary">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <motion.button
          className="w-full py-3.5 border border-gray-200 rounded-2xl font-medium text-text-primary flex items-center justify-center gap-2"
          whileTap={{ scale: 0.97 }}
          onClick={handleGoogleLogin}
        >
          <span className="text-lg">G</span>
          Continue with Google
        </motion.button>

        <button
          className="w-full py-3 text-text-secondary text-sm mt-4"
          onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
        >
          {mode === 'signup' ? 'I already have an account' : 'Create an account'}
        </button>
      </motion.div>

      {mode === 'signup' && (
        <button
          className="text-text-secondary text-sm py-3"
          onClick={handleSkip}
        >
          Skip for now
        </button>
      )}
    </div>
  )
}

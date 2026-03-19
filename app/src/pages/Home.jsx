import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../hooks/useStore'
import { useTopics } from '../hooks/useTopics'
import { getLevelForXp, getLevelProgress, getNextLevel } from '../lib/xp'
import Icon from '../components/Icon'
import TopicCard from '../components/TopicCard'
import { useTheme } from '../hooks/useTheme'
import logoMark from '../assets/logo-mark.png'
import logoMarkWhite from '../assets/logo-mark-white.png'

export default function Home() {
  const navigate = useNavigate()
  const { user, canStartSession } = useStore()
  const { resolved: theme } = useTheme()
  const { activeTopic, recentTopics } = useTopics(user.topicProgress)
  const level = getLevelForXp(user.xp)
  const levelProgress = getLevelProgress(user.xp)
  const nextLevel = getNextLevel(user.xp)

  const handleTopicTap = (topicId) => {
    if (!canStartSession) {
      navigate('/upgrade')
      return
    }
    navigate(`/chat/${topicId}`)
  }

  const goalProgress = Math.min((user.dailySessionsCompleted / (user.dailyGoal || 1)) * 100, 100)
  const goalMet = user.dailySessionsCompleted >= (user.dailyGoal || 1)

  return (
    <div className="bg-bg min-h-full">
      {/* Header */}
      <div className="bg-surface px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          <img src={theme === 'dark' ? logoMarkWhite : logoMark} alt="aible" className="h-7" />
          <div className="flex items-center gap-3">
            {user.streak > 0 && (
              <div className="flex items-center gap-1.5 bg-accent/10 rounded-full px-2.5 py-1">
                <Icon name="flame" size={14} className="text-accent" />
                <span className="text-[13px] font-bold text-accent">{user.streak}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-primary/8 rounded-full px-2.5 py-1">
              <Icon name="diamond" size={13} className="text-primary" />
              <span className="text-[13px] font-bold text-primary">{user.xp}</span>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-surface-alt rounded-xl p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-caption text-ink-secondary">Level {level.level} — {level.name}</span>
            <span className="text-[12px] text-ink-tertiary">{user.xp} / {nextLevel.xp} XP</span>
          </div>
          <div className="h-1.5 bg-line rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* Continue Card */}
        {activeTopic && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => handleTopicTap(activeTopic.id)}
            className="w-full bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-5 flex items-center gap-4 text-left tap-target shadow-theme-md"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
            >
              <Icon name={activeTopic.iconId} size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-[15px] tracking-tight">
                Continue: {activeTopic.name}
              </p>
              <p className="text-white/55 text-[13px] mt-0.5">
                {activeTopic.disciplineName} &middot; {activeTopic.subjectName}
              </p>
            </div>
            <Icon name="chevron-right" size={18} className="text-white/50 shrink-0" />
          </motion.button>
        )}

        {/* Daily Goal Mini-Bar */}
        <button
          className="w-full bg-surface rounded-2xl border border-line-subtle p-4 flex items-center gap-4 tap-target shadow-theme"
          onClick={() => navigate('/today')}
        >
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-caption text-ink-secondary">
                {goalMet ? 'Goal complete' : 'Daily Goal'}
              </span>
              <span className="text-[12px] text-ink-tertiary">
                {user.dailySessionsCompleted}/{user.dailyGoal || 1}
              </span>
            </div>
            <div className="h-2 bg-surface-alt rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: goalMet ? '#22c55e' : '#14b8a6' }}
                initial={{ width: 0 }}
                animate={{ width: `${goalProgress}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>
          <Icon name="chevron-right" size={16} className="text-ink-tertiary shrink-0" />
        </button>

        {/* Recent Topics */}
        {recentTopics.length > 0 && (
          <div>
            <h2 className="text-title text-ink mb-3">Recent Topics</h2>
            <div className="grid grid-cols-2 gap-3">
              {recentTopics.map((topic, i) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <TopicCard topic={topic} onTap={() => handleTopicTap(topic.id)} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Browse Topics */}
        <button
          onClick={() => navigate('/pick-topic')}
          className="w-full bg-surface rounded-2xl border border-line-subtle p-5 flex items-center gap-4 tap-target shadow-theme transition-all hover:shadow-theme-md"
        >
          <div className="w-11 h-11 rounded-xl bg-surface-alt flex items-center justify-center shrink-0">
            <Icon name="search" size={20} className="text-ink-secondary" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[15px] font-semibold text-ink tracking-tight">Browse All Topics</p>
            <p className="text-[13px] text-ink-tertiary mt-0.5">Math, Science, English, History, and more</p>
          </div>
          <Icon name="chevron-right" size={16} className="text-ink-tertiary shrink-0" />
        </button>

        {/* Empty state */}
        {!activeTopic && recentTopics.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-primary/6 rounded-2xl p-5 border border-primary/10"
          >
            <p className="text-[15px] text-primary font-medium tracking-tight">Pick a topic and start learning.</p>
            <p className="text-[13px] text-primary/60 mt-1">Your tutor is ready when you are.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

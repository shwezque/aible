import { useNavigate } from 'react-router-dom'
import { useStore } from '../hooks/useStore'
import { useTopics } from '../hooks/useTopics'
import { getLevelForXp } from '../lib/xp'
import TopicCard from '../components/TopicCard'
import logoFull from '../assets/logo-full.png'

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default function Home() {
  const navigate = useNavigate()
  const { user, canStartSession } = useStore()
  const { topics, activeTopic } = useTopics(user.topicProgress)
  const level = getLevelForXp(user.xp)

  const handleTopicTap = (topicId) => {
    if (!canStartSession) {
      navigate('/upgrade')
      return
    }
    navigate(`/chat/${topicId}`)
  }

  const mvpTopics = topics.filter(t => !t.isComingSoon)
  const comingSoon = topics.filter(t => t.isComingSoon)

  return (
    <div className="bg-bg min-h-full">
      {/* Header */}
      <div className="bg-surface px-5 py-4 flex items-center justify-between border-b border-line-subtle">
        <img src={logoFull} alt="aible" className="h-7" />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm">
            <span className="text-accent">⭐</span>
            <span className="font-semibold text-ink">{user.xp}</span>
          </div>
          {user.streak > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <span className="text-orange-500">🔥</span>
              <span className="font-semibold text-ink">{user.streak}</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-4 space-y-5">
        {/* Continue Card */}
        {activeTopic && (
          <button
            onClick={() => handleTopicTap(activeTopic.id)}
            className="w-full bg-gradient-to-r from-primary to-primary-dark rounded-xl p-4 flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0"
              style={{ backgroundColor: activeTopic.color + '80' }}
            >
              {activeTopic.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-base">
                Continue: {activeTopic.name}
              </p>
              <p className="text-white/70 text-[13px] mt-0.5">
                Last session: {timeAgo(activeTopic.progress?.lastActiveAt)}
              </p>
            </div>
            <svg className="w-5 h-5 text-white/70 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Daily Goal Mini-Bar */}
        <div
          className="bg-surface rounded-xl border border-line-subtle p-3 flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/today')}
        >
          <div className="flex-1">
            <div className="h-2 bg-surface-alt rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary rounded-full transition-all duration-500"
                style={{ width: `${Math.min((user.dailySessionsCompleted / (user.dailyGoal || 1)) * 100, 100)}%` }}
              />
            </div>
          </div>
          <p className="text-[13px] text-ink-secondary shrink-0">
            {user.dailySessionsCompleted} of {user.dailyGoal || 1} today
          </p>
        </div>

        {/* Topic Grid */}
        <div>
          <h2 className="text-base font-semibold text-ink mb-3">Your Topics</h2>
          <div className="grid grid-cols-2 gap-3">
            {mvpTopics.map(topic => (
              <TopicCard key={topic.id} topic={topic} onTap={() => handleTopicTap(topic.id)} />
            ))}
            {comingSoon.map(topic => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </div>

        {/* Empty state prompt */}
        {!activeTopic && (
          <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
            <p className="text-sm text-primary font-medium">Pick a topic and start chatting.</p>
            <p className="text-xs text-primary-light mt-1">Your AI tutor is ready.</p>
          </div>
        )}
      </div>
    </div>
  )
}

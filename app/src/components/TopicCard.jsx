import ProgressRing from './ProgressRing'

function timeAgo(dateStr) {
  if (!dateStr) return null
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default function TopicCard({ topic, onTap }) {
  const { name, icon, tutorName, color, isComingSoon, progressPercent, progress, conceptMap } = topic
  const coveredCount = progress?.conceptsCovered?.length || 0
  const totalConcepts = conceptMap?.length || 0
  const lastActive = timeAgo(progress?.lastActiveAt)

  if (isComingSoon) {
    return (
      <div className="bg-surface rounded-xl border border-line-subtle p-4 opacity-50 shadow-theme">
        <div className="text-2xl mb-2">{icon}</div>
        <p className="text-[15px] font-semibold text-ink-tertiary">{name}</p>
        <p className="text-xs text-ink-tertiary mt-0.5">with {tutorName}</p>
        <div className="mt-3 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-line" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
          </svg>
          <span className="text-[11px] text-ink-tertiary font-medium">Coming Soon</span>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={onTap}
      className="bg-surface rounded-xl border border-line-subtle p-4 text-left hover:border-line active:bg-surface-alt transition-all w-full shadow-theme"
    >
      <div className="flex items-start justify-between">
        <div className="text-2xl">{icon}</div>
        {progressPercent > 0 && (
          <ProgressRing percent={progressPercent} size={28} strokeWidth={2.5} color={color} />
        )}
      </div>
      <p className="text-[15px] font-semibold text-ink mt-2">{name}</p>
      <p className="text-xs mt-0.5" style={{ color }}>with {tutorName}</p>
      <div className="mt-2">
        {coveredCount > 0 ? (
          <p className="text-[11px] text-ink-secondary">{coveredCount} of {totalConcepts} concepts</p>
        ) : (
          <span className="inline-block text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
            New
          </span>
        )}
        {lastActive && (
          <p className="text-[11px] text-ink-tertiary mt-0.5">{lastActive}</p>
        )}
      </div>
    </button>
  )
}

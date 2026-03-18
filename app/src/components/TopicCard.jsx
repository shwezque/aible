import Icon from './Icon'
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
  const { name, iconId, tutorName, color, isComingSoon, progressPercent, progress, conceptMap } = topic
  const coveredCount = progress?.conceptsCovered?.length || 0
  const totalConcepts = conceptMap?.length || 0
  const lastActive = timeAgo(progress?.lastActiveAt)

  if (isComingSoon) {
    return (
      <div className="bg-surface rounded-2xl border border-line-subtle p-4 opacity-40 shadow-theme">
        <div className="w-9 h-9 rounded-xl bg-surface-alt flex items-center justify-center mb-3">
          <Icon name={iconId} size={18} className="text-ink-tertiary" />
        </div>
        <p className="text-[15px] font-semibold text-ink-tertiary tracking-tight">{name}</p>
        <p className="text-caption text-ink-tertiary mt-0.5">with {tutorName}</p>
        <div className="mt-3 flex items-center gap-1.5">
          <Icon name="lock" size={13} className="text-ink-tertiary" />
          <span className="text-micro text-ink-tertiary">Coming Soon</span>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={onTap}
      className="bg-surface rounded-2xl border border-line-subtle p-4 text-left transition-all w-full shadow-theme tap-target hover:shadow-theme-md"
    >
      <div className="flex items-start justify-between">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: color + '14' }}
        >
          <Icon name={iconId} size={18} className="text-ink" style={{ color }} />
        </div>
        {progressPercent > 0 && (
          <ProgressRing percent={progressPercent} size={28} strokeWidth={2.5} color={color} />
        )}
      </div>
      <p className="text-[15px] font-semibold text-ink mt-2.5 tracking-tight">{name}</p>
      <p className="text-caption mt-0.5" style={{ color }}>with {tutorName}</p>
      <div className="mt-2.5">
        {coveredCount > 0 ? (
          <p className="text-[12px] text-ink-secondary">{coveredCount} of {totalConcepts} concepts</p>
        ) : (
          <span className="inline-block text-[11px] font-semibold text-primary bg-primary/8 px-2.5 py-0.5 rounded-full">
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

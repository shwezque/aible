import Icon from './Icon'
import ProgressRing from './ProgressRing'

export default function TopicCard({ topic, onTap }) {
  const { name, iconId, color, progressPercent, progress, conceptMap, subjectName, disciplineName } = topic
  const coveredCount = progress?.conceptsCovered?.length || 0
  const totalConcepts = conceptMap?.length || 0

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
          <Icon name={iconId} size={18} style={{ color }} />
        </div>
        {progressPercent > 0 && (
          <ProgressRing percent={progressPercent} size={28} strokeWidth={2.5} color={color} />
        )}
      </div>
      <p className="text-[15px] font-semibold text-ink mt-2.5 tracking-tight">{name}</p>
      <p className="text-[12px] text-ink-tertiary mt-0.5">{disciplineName}</p>
      <div className="mt-2.5">
        {coveredCount > 0 ? (
          <p className="text-[12px] text-ink-secondary">{coveredCount} of {totalConcepts} concepts</p>
        ) : (
          <span className="inline-block text-[11px] font-semibold text-primary bg-primary/8 px-2.5 py-0.5 rounded-full">
            New
          </span>
        )}
      </div>
    </button>
  )
}

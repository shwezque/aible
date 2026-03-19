import { useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SUBJECTS, searchTopics } from '../data/topics'
import { useStore } from '../hooks/useStore'
import Icon from '../components/Icon'

// Discipline-level SVG illustrations (colorful flat icons)
const DISCIPLINE_ICONS = {
  // Math
  arithmetic: (c) => (
    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
      <circle cx="16" cy="16" r="12" fill={c} opacity="0.15"/>
      <path d="M11 16h10M16 11v10" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  algebra: (c) => (
    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
      <circle cx="16" cy="16" r="12" fill={c} opacity="0.15"/>
      <text x="16" y="21" textAnchor="middle" fill={c} fontSize="14" fontWeight="700" fontFamily="system-ui">x</text>
    </svg>
  ),
  geometry: (c) => (
    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
      <circle cx="16" cy="16" r="12" fill={c} opacity="0.15"/>
      <path d="M16 8L8 24h16L16 8z" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  ),
  statistics: (c) => (
    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
      <circle cx="16" cy="16" r="12" fill={c} opacity="0.15"/>
      <rect x="9" y="18" width="4" height="6" rx="1" fill={c}/>
      <rect x="14" y="14" width="4" height="10" rx="1" fill={c}/>
      <rect x="19" y="10" width="4" height="14" rx="1" fill={c}/>
    </svg>
  ),
  // Science
  physics: (c) => (
    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
      <circle cx="16" cy="16" r="12" fill={c} opacity="0.15"/>
      <circle cx="16" cy="16" r="3" fill={c}/>
      <ellipse cx="16" cy="16" rx="10" ry="4" stroke={c} strokeWidth="1.5" transform="rotate(30 16 16)"/>
      <ellipse cx="16" cy="16" rx="10" ry="4" stroke={c} strokeWidth="1.5" transform="rotate(-30 16 16)"/>
    </svg>
  ),
  chemistry: (c) => (
    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
      <circle cx="16" cy="16" r="12" fill={c} opacity="0.15"/>
      <path d="M13 8v8l-4 8h14l-4-8V8" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
      <path d="M13 8h6" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  biology: (c) => (
    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
      <circle cx="16" cy="16" r="12" fill={c} opacity="0.15"/>
      <path d="M16 8c-3 0-6 3-6 8s3 8 6 8 6-3 6-8-3-8-6-8z" stroke={c} strokeWidth="2"/>
      <path d="M10 16h12" stroke={c} strokeWidth="1.5"/>
      <path d="M16 8v16" stroke={c} strokeWidth="1.5"/>
    </svg>
  ),
  earth: (c) => (
    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
      <circle cx="16" cy="16" r="10" stroke={c} strokeWidth="2"/>
      <circle cx="16" cy="16" r="10" fill={c} opacity="0.1"/>
      <path d="M6 16h20M16 6c-4 3-4 17 0 20M16 6c4 3 4 17 0 20" stroke={c} strokeWidth="1.5"/>
    </svg>
  ),
  // English
  writing: (c) => (
    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
      <circle cx="16" cy="16" r="12" fill={c} opacity="0.15"/>
      <path d="M10 24l2-6 10-10 4 4-10 10-6 2z" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
      <path d="M20 10l4 4" stroke={c} strokeWidth="2"/>
    </svg>
  ),
  reading: (c) => (
    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
      <circle cx="16" cy="16" r="12" fill={c} opacity="0.15"/>
      <path d="M8 10c4-2 7 0 8 2 1-2 4-4 8-2v14c-4-2-7 0-8 2-1-2-4-4-8-2V10z" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
      <path d="M16 12v12" stroke={c} strokeWidth="1.5"/>
    </svg>
  ),
  communication: (c) => (
    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
      <circle cx="16" cy="16" r="12" fill={c} opacity="0.15"/>
      <rect x="7" y="10" width="12" height="9" rx="2" stroke={c} strokeWidth="2"/>
      <rect x="13" y="14" width="12" height="9" rx="2" stroke={c} strokeWidth="2" fill="var(--surface, #fff)"/>
    </svg>
  ),
  // History
  'world-history': (c) => (
    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
      <circle cx="16" cy="16" r="10" stroke={c} strokeWidth="2" fill={c} opacity="0.1"/>
      <path d="M6 16h20M10 8c2 4 2 12 0 16M22 8c-2 4-2 12 0 16" stroke={c} strokeWidth="1.5"/>
    </svg>
  ),
  'us-history': (c) => (
    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
      <circle cx="16" cy="16" r="12" fill={c} opacity="0.15"/>
      <rect x="10" y="8" width="12" height="16" rx="1" stroke={c} strokeWidth="2"/>
      <path d="M13 12h6M13 16h4M13 20h5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  'historical-thinking': (c) => (
    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
      <circle cx="16" cy="16" r="12" fill={c} opacity="0.15"/>
      <circle cx="16" cy="14" r="6" stroke={c} strokeWidth="2"/>
      <path d="M16 10v4l3 2" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 24h8" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  // CS
  programming: (c) => (
    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
      <circle cx="16" cy="16" r="12" fill={c} opacity="0.15"/>
      <path d="M12 12l-4 4 4 4M20 12l4 4-4 4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 10l-4 12" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  web: (c) => (
    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
      <circle cx="16" cy="16" r="12" fill={c} opacity="0.15"/>
      <rect x="7" y="9" width="18" height="14" rx="2" stroke={c} strokeWidth="2"/>
      <path d="M7 13h18" stroke={c} strokeWidth="1.5"/>
      <circle cx="10" cy="11" r="0.8" fill={c}/><circle cx="12.5" cy="11" r="0.8" fill={c}/><circle cx="15" cy="11" r="0.8" fill={c}/>
    </svg>
  ),
  'cs-concepts': (c) => (
    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
      <circle cx="16" cy="16" r="12" fill={c} opacity="0.15"/>
      <circle cx="16" cy="10" r="3" stroke={c} strokeWidth="2"/>
      <circle cx="10" cy="22" r="3" stroke={c} strokeWidth="2"/>
      <circle cx="22" cy="22" r="3" stroke={c} strokeWidth="2"/>
      <path d="M14.5 12.5L11.5 19.5M17.5 12.5L20.5 19.5" stroke={c} strokeWidth="1.5"/>
    </svg>
  ),
  // Economics
  micro: (c) => (
    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
      <circle cx="16" cy="16" r="12" fill={c} opacity="0.15"/>
      <path d="M8 24L24 8" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 8l16 16" stroke={c} strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3"/>
    </svg>
  ),
  macro: (c) => (
    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
      <circle cx="16" cy="16" r="12" fill={c} opacity="0.15"/>
      <path d="M8 22c2-2 4-8 8-8s6 6 8 2" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      <path d="M22 10v6h-6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'personal-finance': (c) => (
    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
      <circle cx="16" cy="16" r="12" fill={c} opacity="0.15"/>
      <circle cx="16" cy="16" r="7" stroke={c} strokeWidth="2"/>
      <text x="16" y="20" textAnchor="middle" fill={c} fontSize="11" fontWeight="700" fontFamily="system-ui">$</text>
    </svg>
  ),
}

export default function PickTopic() {
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0].id)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTopic, setSelectedTopic] = useState(null)
  const navigate = useNavigate()
  const { updateUser, updateTopicProgress, checkStreak } = useStore()
  const inputRef = useRef(null)
  const isSearching = searchQuery.length >= 2

  const searchResults = useMemo(() => {
    return isSearching ? searchTopics(searchQuery) : []
  }, [searchQuery, isSearching])

  const activeSubject = SUBJECTS.find(s => s.id === selectedSubject)

  const handleSelect = (topicId) => {
    setSelectedTopic(topicId === selectedTopic ? null : topicId)
  }

  const handleStart = () => {
    if (!selectedTopic) return
    updateUser({ onboardingComplete: true })
    updateTopicProgress(selectedTopic, {
      status: 'in_progress',
      lastActiveAt: new Date().toISOString(),
    })
    checkStreak()
    navigate(`/chat/${selectedTopic}`)
  }

  return (
    <div className="h-full flex flex-col bg-surface">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="px-6 pt-10 pb-2">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-headline text-ink"
          >
            What do you want to learn?
          </motion.h1>
        </div>

        {/* Search */}
        <div className="px-6 py-3 sticky top-0 bg-surface z-10">
          <div className="flex items-center bg-surface-alt rounded-xl px-3.5 py-2.5 gap-2.5">
            <Icon name="search" size={18} className="text-ink-tertiary shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any topic..."
              className="flex-1 bg-transparent text-[15px] text-ink placeholder:text-ink-tertiary outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-0.5 tap-target">
                <Icon name="x-mark" size={16} className="text-ink-tertiary" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        <AnimatePresence>
          {isSearching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-6 pb-4"
            >
              {searchResults.length === 0 ? (
                <p className="text-[14px] text-ink-tertiary py-4 text-center">No topics found</p>
              ) : (
                <div className="space-y-1">
                  {searchResults.map((topic) => {
                    const subject = SUBJECTS.find(s => s.id === topic.subjectId)
                    return (
                      <button
                        key={topic.id}
                        onClick={() => { handleSelect(topic.id); setSearchQuery('') }}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all tap-target flex items-center gap-3 ${
                          selectedTopic === topic.id
                            ? 'bg-primary/8 ring-1 ring-primary'
                            : 'hover:bg-surface-alt'
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: topic.color + '14' }}
                        >
                          <Icon name={topic.iconId} size={16} style={{ color: topic.color }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[15px] font-medium text-ink truncate">{topic.name}</p>
                          <p className="text-[12px] text-ink-tertiary truncate">
                            {topic.subjectName} &middot; {topic.disciplineName}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subject Pills + Topic Grid */}
        {!isSearching && (
          <>
            {/* Subject Pills */}
            <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
              {SUBJECTS.map((subject) => {
                const isActive = selectedSubject === subject.id
                return (
                  <button
                    key={subject.id}
                    onClick={() => setSelectedSubject(subject.id)}
                    className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[14px] font-medium transition-all tap-target ${
                      isActive
                        ? 'text-white shadow-theme'
                        : 'text-ink-secondary bg-surface-alt'
                    }`}
                    style={isActive ? { backgroundColor: subject.color } : undefined}
                  >
                    {subject.name}
                  </button>
                )
              })}
            </div>

            {/* Disciplines + Topics */}
            {activeSubject && (
              <div className="px-6 pt-4 pb-6 space-y-6">
                {activeSubject.disciplines.map((discipline, di) => {
                  const DisciplineIcon = DISCIPLINE_ICONS[discipline.id]
                  return (
                    <motion.div
                      key={discipline.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: di * 0.05, duration: 0.25 }}
                    >
                      {/* Discipline header with icon */}
                      <div className="flex items-center gap-2.5 mb-3">
                        {DisciplineIcon && DisciplineIcon(activeSubject.color)}
                        <p className="text-[14px] font-semibold text-ink tracking-tight">
                          {discipline.name}
                        </p>
                      </div>

                      <div className="space-y-2">
                        {discipline.topics.map((topic) => {
                          const isSelected = selectedTopic === topic.id
                          return (
                            <button
                              key={topic.id}
                              onClick={() => handleSelect(topic.id)}
                              className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all tap-target ${
                                isSelected
                                  ? 'border-transparent ring-2 shadow-theme'
                                  : 'border-line-subtle bg-surface hover:border-line'
                              }`}
                              style={isSelected ? {
                                backgroundColor: activeSubject.color + '0A',
                                '--tw-ring-color': activeSubject.color,
                              } : undefined}
                            >
                              <div className="flex items-center justify-between">
                                <div className="min-w-0">
                                  <p className={`text-[15px] font-medium tracking-tight ${isSelected ? 'text-ink' : 'text-ink'}`}>
                                    {topic.name}
                                  </p>
                                  <p className="text-[13px] text-ink-tertiary mt-0.5">{topic.subtitle}</p>
                                </div>
                                {isSelected && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 ml-3"
                                    style={{ backgroundColor: activeSubject.color }}
                                  >
                                    <Icon name="check" size={14} className="text-white" strokeWidth={3} />
                                  </motion.div>
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="px-6 pb-10 pt-3 bg-surface border-t border-line-subtle">
        <button
          onClick={handleStart}
          disabled={!selectedTopic}
          className={`w-full font-semibold text-[17px] py-4 rounded-2xl transition-all tap-target ${
            selectedTopic
              ? 'text-white shadow-theme-md'
              : 'bg-surface-alt text-ink-tertiary cursor-not-allowed'
          }`}
          style={selectedTopic && activeSubject ? { backgroundColor: activeSubject.color } : undefined}
        >
          Start Learning
        </button>
      </div>
    </div>
  )
}

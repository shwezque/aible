import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from '../hooks/useChat'
import { useStore } from '../hooks/useStore'
import { getTopicById } from '../data/topics'
import { XP_ACTIONS } from '../lib/xp'
import XpToast from '../components/XpToast'
import CelebrationOverlay from '../components/CelebrationOverlay'
import TopicIndex from '../components/TopicIndex'
import RenderMarkdown from '../lib/renderMarkdown'

function TutorAvatar({ color, name, size = 28 }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold shrink-0"
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.42 }}
    >
      {name?.[0] || '?'}
    </div>
  )
}

function SessionOpener({ topic }) {
  return (
    <div className="flex flex-col items-center py-6 px-4">
      <TutorAvatar color={topic.color} name={topic.tutorName} size={48} />
      <p className="text-base font-semibold mt-3 text-ink">
        Hey! I'm {topic.tutorName}, your {topic.name} tutor.
      </p>
      <p className="text-sm text-ink-secondary mt-1 text-center">
        Ready to explore {topic.subtitle.toLowerCase()}? Let's start with the basics.
      </p>
      <div className="mt-4 w-full bg-surface rounded-xl border border-line p-3 shadow-theme">
        <p className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wide">Today's goal</p>
        <ul className="mt-2 space-y-1">
          {(topic.conceptMap || []).slice(0, 3).map((c, i) => (
            <li key={i} className="text-sm text-ink-secondary flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
              {c.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function AIBubble({ content, color, tutorName }) {
  return (
    <div className="flex gap-2 items-start px-4">
      <TutorAvatar color={color} name={tutorName} size={28} />
      <div
        className="bg-surface rounded-2xl px-3.5 py-2.5 max-w-[82%] border-l-3"
        style={{ borderLeftColor: color }}
      >
        <div className="text-[15px] leading-relaxed text-ink">
          <RenderMarkdown text={content} />
        </div>
      </div>
    </div>
  )
}

function UserBubble({ content }) {
  return (
    <div className="flex justify-end px-4">
      <div className="bg-primary text-white rounded-2xl px-3.5 py-2.5 max-w-[75%]">
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  )
}

function QuizCard({ metadata, onAnswer }) {
  const [selected, setSelected] = useState(metadata?.userAnswer ?? null)
  const answered = selected !== null
  const { question, options, correctIndex, xpValue } = metadata || {}

  const handleSelect = (i) => {
    if (answered) return
    setSelected(i)
    onAnswer?.(i, i === correctIndex)
  }

  return (
    <div className="mx-4 bg-surface rounded-xl border border-primary/30 p-4 shadow-theme">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-2">Quick Check</p>
      <p className="text-[15px] font-semibold text-ink mb-3">{question}</p>
      <div className="space-y-2">
        {(options || []).map((opt, i) => {
          let bg = 'bg-surface', border = 'border-line', text = 'text-ink', icon = null
          if (answered) {
            if (i === correctIndex) {
              bg = 'bg-teal-50'; border = 'border-teal-400'; text = 'text-teal-800'; icon = '✓'
            } else if (i === selected && i !== correctIndex) {
              bg = 'bg-accent/10'; border = 'border-amber-300'; text = 'text-accent'
            }
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full text-left px-4 py-3 rounded-lg border ${border} ${bg} ${text} text-sm transition-all flex items-center justify-between`}
            >
              <span>{opt}</span>
              {icon && <span className="text-teal-600 font-bold">{icon}</span>}
            </button>
          )
        })}
      </div>
      {answered && selected === correctIndex && (
        <div className="mt-3 text-sm text-teal-700 font-medium">+{xpValue || 10} XP — Nice work!</div>
      )}
      {answered && selected !== correctIndex && (
        <div className="mt-3 text-sm text-amber-700">Not quite — the correct answer is highlighted above.</div>
      )}
    </div>
  )
}

function SuggestionChips({ suggestions, onTap }) {
  return (
    <div className="px-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {(suggestions || []).map((s, i) => (
        <button
          key={i}
          onClick={() => onTap(s)}
          className="shrink-0 px-4 py-2 rounded-full border border-line text-sm text-ink bg-surface hover:bg-surface-alt active:bg-surface-alt transition-colors"
        >
          {s}
        </button>
      ))}
    </div>
  )
}

function TypingIndicator({ color }) {
  return (
    <div className="flex gap-2 items-start px-4">
      <div className="bg-surface rounded-2xl px-4 py-3 border-l-3" style={{ borderLeftColor: color }}>
        <div className="flex gap-1">
          {[0, 150, 300].map(delay => (
            <span key={delay} className="w-2 h-2 bg-ink-tertiary rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ConceptCard({ conceptId }) {
  const title = conceptId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  return (
    <div className="mx-4 bg-surface rounded-xl border border-line p-4 shadow-theme">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-600 mb-1">Key Concept</p>
      <p className="text-base font-semibold text-ink">{title}</p>
      <div className="mt-3 h-0.5 bg-teal-500 rounded-full w-12" />
    </div>
  )
}

function SessionSummaryCard({ metadata }) {
  const { conceptsCovered = [], quizTotal = 0, quizPassed = 0 } = metadata || {}
  return (
    <div className="mx-4 bg-surface rounded-xl border-l-3 border-l-primary border border-line p-4 shadow-theme">
      <p className="text-sm font-semibold text-primary mb-3">Session Summary</p>
      {conceptsCovered.length > 0 && (
        <ul className="space-y-1.5 mb-3">
          {conceptsCovered.map((c, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-ink">
              <span className="text-teal-500">✓</span>
              {c.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </li>
          ))}
        </ul>
      )}
      {quizTotal > 0 && (
        <p className="text-sm text-ink-secondary">Quick Checks: {quizPassed}/{quizTotal} correct</p>
      )}
    </div>
  )
}

export default function Chat() {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const topic = getTopicById(topicId)
  const { user, addXp, checkStreak, completeSession, updateTopicProgress, canStartSession } = useStore()
  const handleConceptDiscovered = (concepts) => {
    const xpPerConcept = XP_ACTIONS.NEW_CONCEPT
    const total = concepts.length * xpPerConcept
    addXp(total)
    setSessionXp(prev => prev + total)
    setXpToast(total)
    setTimeout(() => setXpToast(null), 2000)
    updateTopicProgress(topicId, {
      conceptsCovered: [...(user.topicProgress?.[topicId]?.conceptsCovered || []), ...concepts],
    })
  }
  const { messages, isStreaming, error, sendMessage, addSystemMessage, session } = useChat(topicId, { onConceptDiscovered: handleConceptDiscovered, learningStyle: user.learningStyle })
  const scrollRef = useRef(null)
  const inputRef = useRef(null)
  const [inputValue, setInputValue] = useState('')
  const [showOverflow, setShowOverflow] = useState(false)
  const [showTopicIndex, setShowTopicIndex] = useState(false)
  const [xpToast, setXpToast] = useState(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [sessionXp, setSessionXp] = useState(0)
  const hasInitialized = useRef(false)

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isStreaming])

  // Send initial greeting if new conversation
  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true
    if (messages.length === 0 && topic) {
      checkStreak()
      updateTopicProgress(topicId, {
        status: 'in_progress',
        lastActiveAt: new Date().toISOString(),
      })
    }
  }, [])

  if (!topic) {
    navigate('/home')
    return null
  }

  const handleSend = (text) => {
    const content = text || inputValue.trim()
    if (!content || isStreaming) return
    setInputValue('')
    sendMessage(content)
  }

  const handleEndSession = () => {
    setShowOverflow(false)
    // Gather session stats
    const conceptsCovered = session.conceptsCovered || []
    const quizMessages = messages.filter(m => m.type === 'quiz')
    const quizPassed = quizMessages.filter(m => m.metadata?.userAnswer === m.metadata?.correctIndex).length
    const xpForSession = XP_ACTIONS.SESSION_COMPLETE
    const totalEarned = sessionXp + xpForSession

    // Call completeSession to award XP, update counters, check badges
    completeSession(topicId, totalEarned, conceptsCovered, [], quizPassed)
    setSessionXp(totalEarned)

    // Inject summary card into chat
    addSystemMessage({
      content: '',
      type: 'summary',
      metadata: {
        conceptsCovered,
        quizTotal: quizMessages.length,
        quizPassed,
        sessionDuration: 0,
      },
    })

    // Show celebration after a brief delay for the summary to render
    setTimeout(() => setShowCelebration(true), 400)
  }

  const handleQuizAnswer = (index, correct) => {
    if (correct) {
      const amount = XP_ACTIONS.QUIZ_CORRECT
      addXp(amount, 'quiz_correct')
      setSessionXp(prev => prev + amount)
      setXpToast(amount)
      setTimeout(() => setXpToast(null), 2000)
    }
  }

  const progressPercent = (() => {
    const conceptCount = topic.conceptMap?.length || 1
    const progress = user.topicProgress?.[topicId]
    const covered = progress?.conceptsCovered?.length || 0
    return Math.round((covered / conceptCount) * 100)
  })()

  // Filter out suggestion messages that have been acted on
  const lastSuggestionIdx = messages.findLastIndex(m => m.type === 'suggestion')

  return (
    <div className="h-full flex flex-col bg-chat-bg">
      {/* Top Bar */}
      <div className="bg-surface border-b border-line px-4 py-3 flex items-center justify-between shrink-0 relative z-20">
        <button onClick={() => navigate('/home')} className="text-ink-secondary p-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-center">
          <p className="text-base font-semibold text-ink">{topic.tutorName}</p>
          <p className="text-xs text-ink-secondary">{topic.name}</p>
        </div>
        <button className="text-ink-secondary p-1" onClick={() => setShowOverflow(!showOverflow)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
          </svg>
        </button>
        <AnimatePresence>
          {showOverflow && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-4 top-14 bg-surface rounded-xl shadow-theme-md border border-line py-1 z-50 w-48"
            >
              <button
                onClick={() => { setShowOverflow(false); setShowTopicIndex(true) }}
                className="w-full text-left px-4 py-2.5 text-sm text-ink hover:bg-surface-alt"
              >
                Topic Index
              </button>
              <button
                onClick={handleEndSession}
                className="w-full text-left px-4 py-2.5 text-sm text-ink hover:bg-surface-alt"
              >
                End Session
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-surface-alt shrink-0">
        <div
          className="h-full bg-secondary rounded-r-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-3">
        {messages.length === 0 && <SessionOpener topic={topic} />}

        {messages.map((msg, i) => {
          let content = null
          if (msg.type === 'quiz') {
            content = <QuizCard metadata={msg.metadata} onAnswer={handleQuizAnswer} />
          } else if (msg.type === 'suggestion') {
            if (i !== lastSuggestionIdx) return null
            content = (
              <SuggestionChips
                suggestions={msg.metadata?.suggestions}
                onTap={(text) => handleSend(text)}
              />
            )
          } else if (msg.type === 'concept') {
            content = <ConceptCard conceptId={msg.metadata?.conceptId || msg.content} />
          } else if (msg.type === 'summary') {
            content = <SessionSummaryCard metadata={msg.metadata} />
          } else if (msg.role === 'assistant') {
            // Strip raw tags from display content (BUG-07)
            // Also strip partial/incomplete tags that appear during streaming
            const displayText = msg.content
              .replace(/\[QUIZ\][\s\S]*?(\[\/QUIZ\]|$)/g, '')
              .replace(/\[CONCEPT\][\s\S]*?(\[\/CONCEPT\]|$)/g, '')
              .replace(/\[SUGGESTIONS\][\s\S]*?(\[\/SUGGESTIONS\]|$)/g, '')
              .replace(/\{[^}]*$/g, '')
              .trim()
            if (!displayText) return null
            content = <AIBubble content={displayText} color={topic.color} tutorName={topic.tutorName} />
          } else if (msg.role === 'user') {
            content = <UserBubble content={msg.content} />
          }
          if (!content) return null
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
            >
              {content}
            </motion.div>
          )
        })}

        {isStreaming && <TypingIndicator color={topic.color} />}

        {error && (
          <div className="mx-4 bg-accent/10 border border-accent/30 rounded-xl p-3">
            <p className="text-sm text-accent">{error}</p>
            <button
              onClick={() => sendMessage(messages.filter(m => m.role === 'user').pop()?.content || 'Hello')}
              className="text-sm text-primary font-medium mt-1"
            >
              Tap to retry
            </button>
          </div>
        )}

        {/* Starter suggestions if no messages */}
        {messages.length === 0 && topic.starterMessages && (
          <SuggestionChips
            suggestions={topic.starterMessages}
            onTap={(text) => handleSend(text)}
          />
        )}
      </div>

      {/* Input Area */}
      <div className="bg-surface border-t border-line px-4 py-3 shrink-0">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend() }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything..."
            disabled={isStreaming}
            className="flex-1 bg-surface-alt rounded-full px-4 py-2.5 text-sm text-ink placeholder:text-ink-tertiary outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isStreaming}
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-opacity ${
              inputValue.trim() && !isStreaming ? 'bg-primary opacity-100' : 'bg-primary opacity-40'
            }`}
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>

      {/* XP Toast */}
      <XpToast amount={xpToast} show={xpToast !== null} onDone={() => setXpToast(null)} />

      {/* Topic Index Bottom Sheet */}
      <TopicIndex
        show={showTopicIndex}
        onClose={() => setShowTopicIndex(false)}
        currentTopicId={topicId}
      />

      {/* Celebration Overlay */}
      {showCelebration && (
        <CelebrationOverlay
          topicId={topicId}
          sessionXp={sessionXp}
          onClose={() => { setShowCelebration(false); navigate('/home') }}
          onSwitchTopic={() => { setShowCelebration(false); navigate('/home') }}
        />
      )}
    </div>
  )
}

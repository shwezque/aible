import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from '../hooks/useChat'
import { useStore } from '../hooks/useStore'
import { getTopicById } from '../data/topics'
import { XP_ACTIONS } from '../lib/xp'
import Icon from '../components/Icon'
import XpToast from '../components/XpToast'
import CelebrationOverlay from '../components/CelebrationOverlay'
import TopicIndex from '../components/TopicIndex'
import TutorAvatar from '../components/TutorAvatar'
import RenderMarkdown from '../lib/renderMarkdown'

const ACRONYMS = { ai: 'AI', llm: 'LLM', eli5: 'ELI5' }
function formatConceptName(id) {
  return id.replace(/-/g, ' ').replace(/\b\w+/g, w => ACRONYMS[w] || w.charAt(0).toUpperCase() + w.slice(1))
}

function SessionOpener({ topic }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center py-8 px-5"
    >
      <TutorAvatar color={topic.color} name={topic.tutorName} size={48} />
      <p className="text-title mt-3 text-ink">
        Hey! I'm {topic.tutorName}, your {topic.name} tutor.
      </p>
      <p className="text-caption text-ink-secondary mt-1 text-center">
        Ready to explore {topic.subtitle.charAt(0).toLowerCase() + topic.subtitle.slice(1)}? Let's start with the basics.
      </p>
      <div className="mt-5 w-full bg-surface rounded-2xl border border-line-subtle p-4 shadow-theme">
        <p className="text-micro text-ink-tertiary mb-2.5">Today's goal</p>
        <ul className="space-y-1.5">
          {(topic.conceptMap || []).slice(0, 3).map((c, i) => (
            <li key={i} className="text-[14px] text-ink-secondary flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
              {formatConceptName(c)}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

function AIBubble({ content, color, tutorName }) {
  return (
    <div className="flex gap-2.5 items-start px-4">
      <TutorAvatar color={color} name={tutorName} size={28} />
      <div
        className="bg-surface rounded-2xl px-4 py-3 max-w-[82%] border-l-3 shadow-theme"
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
      <div className="bg-primary text-white rounded-2xl px-4 py-3 max-w-[75%]">
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
    <div className="mx-4 bg-surface rounded-2xl border border-primary/20 p-5 shadow-theme">
      <p className="text-micro text-primary mb-2.5">Quick Check</p>
      <p className="text-[15px] font-semibold text-ink mb-4">{question}</p>
      <div className="space-y-2">
        {(options || []).map((opt, i) => {
          let cls = 'bg-surface border-line-subtle text-ink'
          let icon = null
          if (answered) {
            if (i === correctIndex) {
              cls = 'bg-secondary/8 border-secondary/40 text-secondary'; icon = 'check'
            } else if (i === selected && i !== correctIndex) {
              cls = 'bg-accent/8 border-accent/40 text-accent'
            }
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full text-left px-4 py-3 rounded-xl border ${cls} text-sm transition-all flex items-center justify-between tap-target`}
            >
              <span>{opt}</span>
              {icon && <Icon name={icon} size={16} className="text-secondary" strokeWidth={2.5} />}
            </button>
          )
        })}
      </div>
      {answered && selected === correctIndex && (
        <div className="mt-3 flex items-center gap-1.5">
          <Icon name="diamond" size={14} className="text-primary" />
          <span className="text-sm text-primary font-medium">+{xpValue || 10} XP</span>
        </div>
      )}
      {answered && selected !== correctIndex && (
        <p className="mt-3 text-sm text-ink-secondary">Not quite — the correct answer is highlighted above.</p>
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
          className="shrink-0 px-4 py-2.5 rounded-full border border-line text-sm text-ink bg-surface tap-target transition-colors hover:bg-surface-alt"
        >
          {s}
        </button>
      ))}
    </div>
  )
}

function TypingIndicator({ color }) {
  return (
    <div className="flex gap-2.5 items-start px-4">
      <div className="bg-surface rounded-2xl px-4 py-3 border-l-3 shadow-theme" style={{ borderLeftColor: color }}>
        <div className="flex gap-1.5">
          {[0, 150, 300].map(delay => (
            <span key={delay} className="w-1.5 h-1.5 bg-ink-tertiary rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ConceptCard({ conceptId }) {
  const title = formatConceptName(conceptId)
  return (
    <div className="mx-4 bg-surface rounded-2xl border border-line-subtle p-4 shadow-theme">
      <p className="text-micro text-secondary mb-1.5">Key Concept</p>
      <p className="text-title text-ink">{title}</p>
      <div className="mt-3 h-0.5 bg-secondary rounded-full w-10" />
    </div>
  )
}

function SessionSummaryCard({ metadata }) {
  const { conceptsCovered = [], quizTotal = 0, quizPassed = 0 } = metadata || {}
  return (
    <div className="mx-4 bg-surface rounded-2xl border-l-3 border-l-primary border border-line-subtle p-5 shadow-theme">
      <p className="text-title text-primary mb-3">Session Summary</p>
      {conceptsCovered.length > 0 && (
        <ul className="space-y-2 mb-3">
          {conceptsCovered.map((c, i) => (
            <li key={i} className="flex items-center gap-2.5 text-sm text-ink">
              <Icon name="check" size={14} className="text-secondary" strokeWidth={2.5} />
              {formatConceptName(c)}
            </li>
          ))}
        </ul>
      )}
      {quizTotal > 0 && (
        <p className="text-caption text-ink-secondary">Quick Checks: {quizPassed}/{quizTotal} correct</p>
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isStreaming])

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
    const conceptsCovered = session.conceptsCovered || []
    const quizMessages = messages.filter(m => m.type === 'quiz')
    const quizPassed = quizMessages.filter(m => m.metadata?.userAnswer === m.metadata?.correctIndex).length
    const xpForSession = XP_ACTIONS.SESSION_COMPLETE
    const totalEarned = sessionXp + xpForSession

    completeSession(topicId, totalEarned, conceptsCovered, [], quizPassed)
    setSessionXp(totalEarned)

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

  const lastSuggestionIdx = messages.findLastIndex(m => m.type === 'suggestion')

  return (
    <div className="h-full flex flex-col bg-chat-bg">
      {/* Top Bar */}
      <div className="bg-surface/95 glass border-b border-line-subtle px-4 py-3 flex items-center justify-between shrink-0 relative z-20">
        <button onClick={() => navigate('/home')} className="text-ink-secondary p-1.5 -ml-1 tap-target">
          <Icon name="chevron-left" size={22} />
        </button>
        <div className="flex items-center gap-2.5">
          <TutorAvatar name={topic.tutorName} color={topic.color} size={32} />
          <div>
            <p className="text-[15px] font-semibold text-ink tracking-tight leading-tight">{topic.tutorName}</p>
            <p className="text-[11px] text-ink-tertiary leading-tight">{topic.name}</p>
          </div>
        </div>
        <button className="text-ink-secondary p-1.5 -mr-1 tap-target" onClick={() => setShowOverflow(!showOverflow)}>
          <Icon name="ellipsis-vertical" size={22} />
        </button>
        <AnimatePresence>
          {showOverflow && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute right-4 top-14 bg-surface rounded-2xl shadow-theme-lg border border-line-subtle py-1.5 z-50 w-48 overflow-hidden"
            >
              <button
                onClick={() => { setShowOverflow(false); setShowTopicIndex(true) }}
                className="w-full text-left px-4 py-2.5 text-[15px] text-ink hover:bg-surface-alt transition-colors"
              >
                Topic Index
              </button>
              <button
                onClick={handleEndSession}
                className="w-full text-left px-4 py-2.5 text-[15px] text-ink hover:bg-surface-alt transition-colors"
              >
                End Session
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div className="h-0.5 bg-line-subtle shrink-0">
        <motion.div
          className="h-full bg-secondary rounded-r-full"
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
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
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {content}
            </motion.div>
          )
        })}

        {isStreaming && <TypingIndicator color={topic.color} />}

        {error && (
          <div className="mx-4 bg-error/8 border border-error/15 rounded-2xl p-4">
            <p className="text-sm text-error">{error}</p>
            <button
              onClick={() => sendMessage(messages.filter(m => m.role === 'user').pop()?.content || 'Hello')}
              className="text-sm text-primary font-medium mt-2"
            >
              Tap to retry
            </button>
          </div>
        )}

        {messages.length === 0 && topic.starterMessages && (
          <SuggestionChips
            suggestions={topic.starterMessages}
            onTap={(text) => handleSend(text)}
          />
        )}
      </div>

      {/* Input Area */}
      <div className="bg-surface/95 glass border-t border-line-subtle px-4 py-3 shrink-0">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend() }}
          className="flex items-center gap-2.5"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything..."
            disabled={isStreaming}
            className="flex-1 bg-surface-alt rounded-2xl px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-tertiary outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isStreaming}
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
              inputValue.trim() && !isStreaming ? 'bg-primary opacity-100' : 'bg-primary opacity-30'
            }`}
          >
            <Icon name="arrow-up" size={16} className="text-white" strokeWidth={2.5} />
          </button>
        </form>
      </div>

      <XpToast amount={xpToast} show={xpToast !== null} onDone={() => setXpToast(null)} />

      <TopicIndex
        show={showTopicIndex}
        onClose={() => setShowTopicIndex(false)}
        currentTopicId={topicId}
      />

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

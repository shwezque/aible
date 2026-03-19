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
import VoiceMode from '../components/VoiceMode'

const ACRONYMS = { ai: 'AI', llm: 'LLM', eli5: 'ELI5' }
function formatConceptName(id) {
  return id.replace(/-/g, ' ').replace(/\b\w+/g, w => ACRONYMS[w] || w.charAt(0).toUpperCase() + w.slice(1))
}

function SessionOpener({ topic }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center py-10 px-6"
    >
      <TutorAvatar color={topic.color} name={topic.tutorName} size={44} />
      <p className="text-[17px] font-semibold mt-3 text-ink tracking-tight">
        {topic.tutorName}
      </p>
      <p className="text-[14px] text-ink-tertiary mt-0.5 text-center">
        {topic.name}
      </p>
    </motion.div>
  )
}

function AIBubble({ content }) {
  return (
    <div className="px-6">
      <div className="text-[15px] leading-[1.75] text-ink">
        <RenderMarkdown text={content} />
      </div>
    </div>
  )
}

function UserBubble({ content }) {
  return (
    <div className="flex justify-end px-5">
      <div className="bg-surface-alt rounded-2xl px-4 py-2.5 max-w-[80%]">
        <p className="text-[15px] leading-[1.6] text-ink whitespace-pre-wrap">{content}</p>
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
    <div className="mx-5 bg-surface-alt rounded-2xl p-5">
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
    <div className="px-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
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

function TypingIndicator() {
  return (
    <div className="px-5">
      <div className="flex gap-1.5 py-1">
        {[0, 150, 300].map(delay => (
          <span key={delay} className="w-1.5 h-1.5 bg-ink-tertiary rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
        ))}
      </div>
    </div>
  )
}

function ConceptCard({ conceptId }) {
  const title = formatConceptName(conceptId)
  return (
    <div className="mx-5 bg-surface-alt rounded-2xl p-4">
      <p className="text-micro text-secondary mb-1.5">Key Concept</p>
      <p className="text-title text-ink">{title}</p>
      <div className="mt-3 h-0.5 bg-secondary rounded-full w-10" />
    </div>
  )
}

function SessionSummaryCard({ metadata }) {
  const { conceptsCovered = [], quizTotal = 0, quizPassed = 0 } = metadata || {}
  return (
    <div className="mx-5 bg-surface-alt rounded-2xl p-5">
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
  const [showVoiceMode, setShowVoiceMode] = useState(false)

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

  const supportsVoice = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

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
      <div className="bg-surface border-b border-line-subtle px-4 py-3 flex items-center justify-between shrink-0 relative z-20">
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
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-5 space-y-5">
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
            content = <AIBubble content={displayText} />
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

        {isStreaming && <TypingIndicator />}

        {error && (
          <div className="mx-5 bg-error/8 border border-error/15 rounded-2xl p-4">
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
      <div className="bg-surface border-t border-line-subtle px-4 py-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend() }}
            className="flex-1 flex items-center bg-surface-alt rounded-2xl px-4 py-1"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything..."
              disabled={isStreaming}
              className="flex-1 bg-transparent py-2.5 text-[15px] text-ink placeholder:text-ink-tertiary outline-none"
            />
            {inputValue.trim() && (
              <button
                type="submit"
                disabled={isStreaming}
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 -mr-1 transition-all ${
                  !isStreaming ? 'bg-ink opacity-100' : 'bg-ink opacity-30'
                }`}
              >
                <Icon name="arrow-up" size={16} className="text-surface" strokeWidth={2.5} />
              </button>
            )}
          </form>
          {supportsVoice && (
            <button
              type="button"
              onClick={() => setShowVoiceMode(true)}
              disabled={isStreaming}
              className="w-10 h-10 rounded-full bg-ink flex items-center justify-center shrink-0 tap-target transition-opacity"
            >
              <Icon name="waveform" size={20} className="text-surface" strokeWidth={2} />
            </button>
          )}
        </div>
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

      <AnimatePresence>
        {showVoiceMode && (
          <VoiceMode
            show={showVoiceMode}
            onClose={() => setShowVoiceMode(false)}
            topic={topic}
            sendMessage={sendMessage}
            messages={messages}
            isStreaming={isStreaming}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

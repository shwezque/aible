import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from './Icon'
import TutorAvatar from './TutorAvatar'

// States: idle → listening → processing → speaking → idle
const PHASE = { IDLE: 'idle', LISTENING: 'listening', PROCESSING: 'processing', SPEAKING: 'speaking' }

function stripTags(text) {
  return text
    .replace(/\[QUIZ\][\s\S]*?(\[\/QUIZ\]|$)/g, '')
    .replace(/\[CONCEPT\][\s\S]*?(\[\/CONCEPT\]|$)/g, '')
    .replace(/\[SUGGESTIONS\][\s\S]*?(\[\/SUGGESTIONS\]|$)/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#+\s*/gm, '')
    .replace(/^[-*]\s+/gm, '')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ' ')
    .trim()
}

export default function VoiceMode({ show, onClose, topic, sendMessage, messages, isStreaming }) {
  const [phase, setPhase] = useState(PHASE.IDLE)
  const [transcript, setTranscript] = useState('')
  const [aiText, setAiText] = useState('')
  const recognitionRef = useRef(null)
  const synthRef = useRef(null)
  const prevMsgCount = useRef(messages.length)
  const autoListenRef = useRef(false)

  const supportsRecognition = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  const supportsSynthesis = typeof window !== 'undefined' && 'speechSynthesis' in window

  const stopEverything = useCallback(() => {
    recognitionRef.current?.abort()
    recognitionRef.current = null
    if (supportsSynthesis) window.speechSynthesis.cancel()
    setPhase(PHASE.IDLE)
    autoListenRef.current = false
  }, [supportsSynthesis])

  // Cleanup on unmount or close
  useEffect(() => {
    if (!show) stopEverything()
    return () => stopEverything()
  }, [show, stopEverything])

  const startListening = useCallback(() => {
    if (!supportsRecognition) return
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = navigator.language || 'en-US'
    recognition.interimResults = true
    recognition.continuous = false
    recognitionRef.current = recognition

    let finalResult = ''

    recognition.onresult = (event) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript
        if (event.results[i].isFinal) finalResult += t
        else interim = t
      }
      setTranscript(finalResult || interim)
    }

    recognition.onend = () => {
      if (finalResult.trim()) {
        setPhase(PHASE.PROCESSING)
        sendMessage(finalResult.trim())
      } else {
        setPhase(PHASE.IDLE)
      }
    }

    recognition.onerror = () => {
      setPhase(PHASE.IDLE)
    }

    setTranscript('')
    setAiText('')
    setPhase(PHASE.LISTENING)
    recognition.start()
  }, [supportsRecognition, sendMessage])

  // Watch for new assistant messages to speak
  useEffect(() => {
    if (!show || phase === PHASE.LISTENING) return

    const newCount = messages.length
    if (newCount > prevMsgCount.current && !isStreaming) {
      const lastMsg = messages[newCount - 1]
      if (lastMsg?.role === 'assistant' && lastMsg?.content) {
        const clean = stripTags(lastMsg.content)
        if (clean) {
          setAiText(clean)
          speakText(clean)
        }
      }
    }
    prevMsgCount.current = newCount
  }, [messages.length, isStreaming, show, phase])

  // When streaming starts, show processing
  useEffect(() => {
    if (isStreaming && phase === PHASE.PROCESSING) {
      // still processing, keep the state
    }
  }, [isStreaming, phase])

  const speakText = useCallback((text) => {
    if (!supportsSynthesis || !text) {
      setPhase(PHASE.IDLE)
      return
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.05
    utterance.pitch = 1.0
    utterance.lang = navigator.language || 'en-US'

    // Try to pick a natural-sounding voice
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v => v.name.includes('Samantha')) ||
      voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) ||
      voices.find(v => v.lang.startsWith('en') && v.localService) ||
      voices.find(v => v.lang.startsWith(navigator.language?.slice(0, 2) || 'en'))
    if (preferred) utterance.voice = preferred

    utterance.onend = () => {
      setPhase(PHASE.IDLE)
      // Auto-listen after AI finishes speaking
      autoListenRef.current = true
    }
    utterance.onerror = () => setPhase(PHASE.IDLE)

    synthRef.current = utterance
    setPhase(PHASE.SPEAKING)
    window.speechSynthesis.speak(utterance)
  }, [supportsSynthesis])

  // Auto-listen after speaking ends
  useEffect(() => {
    if (phase === PHASE.IDLE && autoListenRef.current && show) {
      autoListenRef.current = false
      const timer = setTimeout(() => startListening(), 400)
      return () => clearTimeout(timer)
    }
  }, [phase, show, startListening])

  // Start listening when voice mode opens
  useEffect(() => {
    if (show && phase === PHASE.IDLE && messages.length > 0) {
      const timer = setTimeout(() => startListening(), 500)
      return () => clearTimeout(timer)
    }
  }, [show])

  const handleTap = () => {
    if (phase === PHASE.LISTENING) {
      // Stop listening early — will trigger onend which sends
      recognitionRef.current?.stop()
    } else if (phase === PHASE.SPEAKING) {
      // Stop speaking
      window.speechSynthesis.cancel()
      setPhase(PHASE.IDLE)
    } else if (phase === PHASE.IDLE) {
      startListening()
    }
  }

  if (!show) return null

  const ringColor = topic?.color || '#7C3AED'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-surface flex flex-col"
    >
      {/* Close button */}
      <div className="flex justify-end p-4">
        <button onClick={onClose} className="p-2 tap-target text-ink-secondary">
          <Icon name="x-mark" size={24} />
        </button>
      </div>

      {/* Center area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Tutor avatar with animated ring */}
        <div className="relative mb-8">
          <AnimatePresence>
            {(phase === PHASE.LISTENING || phase === PHASE.SPEAKING) && (
              <>
                <motion.div
                  key="ring1"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full"
                  style={{ background: ringColor, margin: -20 }}
                />
                <motion.div
                  key="ring2"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.05, 0.2] }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute inset-0 rounded-full"
                  style={{ background: ringColor, margin: -35 }}
                />
              </>
            )}
          </AnimatePresence>
          <div className="relative z-10">
            <TutorAvatar name={topic?.tutorName} color={ringColor} size={80} />
          </div>
        </div>

        {/* Tutor name */}
        <p className="text-[17px] font-semibold text-ink tracking-tight mb-2">
          {topic?.tutorName}
        </p>

        {/* Status text */}
        <p className="text-[14px] text-ink-tertiary text-center min-h-[20px] mb-8">
          {phase === PHASE.LISTENING && 'Listening...'}
          {phase === PHASE.PROCESSING && 'Thinking...'}
          {phase === PHASE.SPEAKING && 'Speaking...'}
          {phase === PHASE.IDLE && 'Tap to speak'}
        </p>

        {/* Transcript / AI response */}
        <div className="w-full max-w-[300px] min-h-[60px] text-center">
          {phase === PHASE.LISTENING && transcript && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[15px] text-ink leading-relaxed"
            >
              {transcript}
            </motion.p>
          )}
          {(phase === PHASE.SPEAKING || (phase === PHASE.IDLE && aiText)) && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[15px] text-ink-secondary leading-relaxed"
            >
              {aiText.length > 200 ? aiText.slice(0, 200) + '...' : aiText}
            </motion.p>
          )}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="pb-12 pt-4 flex items-center justify-center gap-6">
        {/* Main mic button */}
        <button
          onClick={handleTap}
          className="w-16 h-16 rounded-full flex items-center justify-center tap-target transition-all"
          style={{
            backgroundColor: phase === PHASE.LISTENING ? ringColor : 'var(--surface-alt)',
          }}
        >
          {phase === PHASE.LISTENING ? (
            <div className="w-5 h-5 rounded-sm bg-white" />
          ) : phase === PHASE.PROCESSING ? (
            <div className="flex gap-1">
              {[0, 150, 300].map(d => (
                <span key={d} className="w-1.5 h-1.5 bg-ink-tertiary rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          ) : (
            <Icon name="mic" size={24} className={phase === PHASE.SPEAKING ? 'text-ink-tertiary' : 'text-ink'} />
          )}
        </button>
      </div>
    </motion.div>
  )
}

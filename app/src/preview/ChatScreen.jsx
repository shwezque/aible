import { useState } from 'react'

const TUTOR = {
  name: 'Ada',
  topic: 'AI Basics',
  color: '#7C3AED',
  initial: 'A',
}

const FAKE_MESSAGES = [
  {
    id: 1,
    type: 'opener',
  },
  {
    id: 2,
    role: 'assistant',
    type: 'text',
    content: "Great question! Let me start with something that might surprise you — AI isn't actually \"intelligent\" the way you and I are. It's more like a very sophisticated pattern-matching engine.",
  },
  {
    id: 3,
    role: 'assistant',
    type: 'text',
    content: "Think of it this way: if you showed a toddler thousands of pictures of cats, eventually they'd learn to recognize a cat. AI works similarly — it learns patterns from enormous amounts of data.",
  },
  {
    id: 4,
    role: 'user',
    type: 'text',
    content: "So it's not actually thinking?",
  },
  {
    id: 5,
    role: 'assistant',
    type: 'text',
    content: "Exactly! It's predicting what comes next based on patterns it's seen. When ChatGPT writes a sentence, it's choosing each word based on \"what word would most likely come next?\" — not because it understands meaning.",
  },
  {
    id: 6,
    role: 'assistant',
    type: 'concept',
    title: 'Pattern Matching vs. Understanding',
    body: "AI processes patterns in data to generate outputs. It doesn't \"understand\" the way humans do — it predicts based on statistical relationships learned from training data.",
  },
  {
    id: 7,
    role: 'assistant',
    type: 'text',
    content: "This is actually great news for you. It means you don't need to be technical to use AI well — you just need to learn how to give it good patterns to work with. That's what prompting is all about.",
  },
  {
    id: 8,
    role: 'assistant',
    type: 'quiz',
    question: 'When ChatGPT writes a response, what is it actually doing?',
    options: [
      'Thinking about the answer like a human would',
      'Predicting the most likely next words based on patterns',
      'Searching the internet for answers',
    ],
    correctIndex: 1,
  },
  {
    id: 9,
    role: 'user',
    type: 'text',
    content: "Predicting the most likely next words based on patterns",
  },
  {
    id: 10,
    role: 'assistant',
    type: 'xp',
    amount: 10,
  },
  {
    id: 11,
    role: 'assistant',
    type: 'text',
    content: "That's it! And here's why this matters for you — since AI is predicting based on patterns, the better your input (your prompt), the better its prediction (its output). Garbage in, gold out... if you know what you're doing. 😄",
  },
  {
    id: 12,
    role: 'assistant',
    type: 'suggestions',
    suggestions: [
      'How do I write a good prompt?',
      'Give me an example',
      "What can't AI do?",
      "What's next?",
    ],
  },
]

function TutorAvatar({ size = 28 }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold shrink-0"
      style={{ width: size, height: size, backgroundColor: TUTOR.color, fontSize: size * 0.45 }}
    >
      {TUTOR.initial}
    </div>
  )
}

function SessionOpener() {
  return (
    <div className="flex flex-col items-center py-6 px-4">
      <TutorAvatar size={48} />
      <p className="text-base font-semibold mt-3 text-gray-900">Hey! I'm Ada, your AI Basics tutor.</p>
      <p className="text-sm text-gray-500 mt-1 text-center">Ready to explore what AI actually is? Let's start with the basics.</p>
      <div className="mt-4 w-full bg-white rounded-xl border border-gray-200 p-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Today's goal</p>
        <ul className="mt-2 space-y-1">
          <li className="text-sm text-gray-600 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
            Understand what AI actually does
          </li>
          <li className="text-sm text-gray-600 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
            Know the difference between AI and human thinking
          </li>
          <li className="text-sm text-gray-600 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
            See why prompting matters
          </li>
        </ul>
      </div>
    </div>
  )
}

function AIMessage({ content }) {
  return (
    <div className="flex gap-2 items-start px-4">
      <TutorAvatar />
      <div
        className="bg-white rounded-2xl px-3.5 py-2.5 max-w-[82%] border-l-3"
        style={{ borderLeftColor: TUTOR.color }}
      >
        <p className="text-[15px] leading-relaxed text-gray-900">{content}</p>
      </div>
    </div>
  )
}

function UserMessage({ content }) {
  return (
    <div className="flex justify-end px-4">
      <div className="bg-primary text-white rounded-2xl px-3.5 py-2.5 max-w-[75%]">
        <p className="text-[15px] leading-relaxed">{content}</p>
      </div>
    </div>
  )
}

function ConceptCard({ title, body }) {
  return (
    <div className="mx-4 bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-600 mb-1">Key Concept</p>
      <p className="text-base font-semibold text-gray-900 mb-1.5">{title}</p>
      <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
      <div className="mt-3 h-0.5 bg-teal-500 rounded-full w-12" />
    </div>
  )
}

function QuizCard({ question, options, correctIndex }) {
  const [selected, setSelected] = useState(null)
  const answered = selected !== null

  return (
    <div className="mx-4 bg-white rounded-xl border border-purple-200 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-2">Quick Check</p>
      <p className="text-[15px] font-semibold text-gray-900 mb-3">{question}</p>
      <div className="space-y-2">
        {options.map((opt, i) => {
          let bg = 'bg-white'
          let border = 'border-gray-200'
          let text = 'text-gray-700'
          let icon = null

          if (answered) {
            if (i === correctIndex) {
              bg = 'bg-teal-50'
              border = 'border-teal-400'
              text = 'text-teal-800'
              icon = '✓'
            } else if (i === selected && i !== correctIndex) {
              bg = 'bg-amber-50'
              border = 'border-amber-300'
              text = 'text-amber-800'
            }
          } else if (i === selected) {
            border = 'border-primary'
            bg = 'bg-purple-50'
          }

          return (
            <button
              key={i}
              onClick={() => !answered && setSelected(i)}
              className={`w-full text-left px-4 py-3 rounded-lg border ${border} ${bg} ${text} text-sm transition-all flex items-center justify-between`}
            >
              <span>{opt}</span>
              {icon && <span className="text-teal-600 font-bold">{icon}</span>}
            </button>
          )
        })}
      </div>
      {answered && selected === correctIndex && (
        <div className="mt-3 text-sm text-teal-700 font-medium flex items-center gap-1">
          ✨ +10 XP — Nice work!
        </div>
      )}
      {answered && selected !== correctIndex && (
        <div className="mt-3 text-sm text-amber-700">
          Not quite — AI predicts based on patterns, not by searching or thinking like humans.
        </div>
      )}
    </div>
  )
}

function XpMoment({ amount }) {
  return (
    <div className="flex justify-center py-2">
      <div className="text-primary font-bold text-lg animate-bounce">
        +{amount} XP ✨
      </div>
    </div>
  )
}

function SuggestedActions({ suggestions }) {
  return (
    <div className="px-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {suggestions.map((s, i) => (
        <button
          key={i}
          className="shrink-0 px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          {s}
        </button>
      ))}
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-2 items-start px-4">
      <TutorAvatar />
      <div className="bg-white rounded-2xl px-4 py-3 border-l-3" style={{ borderLeftColor: TUTOR.color }}>
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

export default function ChatScreen() {
  const [showOverflow, setShowOverflow] = useState(false)
  const progressPercent = 35

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
        <button className="text-gray-600 p-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-center">
          <p className="text-base font-semibold text-gray-900">{TUTOR.name}</p>
          <p className="text-xs text-gray-500">{TUTOR.topic}</p>
        </div>
        <button
          className="text-gray-600 p-1 relative"
          onClick={() => setShowOverflow(!showOverflow)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
          </svg>
        </button>
        {showOverflow && (
          <div className="absolute right-4 top-14 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50 w-48">
            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">Topic Index</button>
            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">End Session</button>
          </div>
        )}
      </div>

      {/* Session Progress Bar */}
      <div className="h-1 bg-gray-200 shrink-0">
        <div
          className="h-full bg-secondary rounded-r-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {FAKE_MESSAGES.map((msg) => {
          if (msg.type === 'opener') return <SessionOpener key={msg.id} />
          if (msg.type === 'text' && msg.role === 'assistant') return <AIMessage key={msg.id} content={msg.content} />
          if (msg.type === 'text' && msg.role === 'user') return <UserMessage key={msg.id} content={msg.content} />
          if (msg.type === 'concept') return <ConceptCard key={msg.id} title={msg.title} body={msg.body} />
          if (msg.type === 'quiz') return <QuizCard key={msg.id} question={msg.question} options={msg.options} correctIndex={msg.correctIndex} />
          if (msg.type === 'xp') return <XpMoment key={msg.id} amount={msg.amount} />
          if (msg.type === 'suggestions') return <SuggestedActions key={msg.id} suggestions={msg.suggestions} />
          return null
        })}

        {/* Typing indicator at the bottom for demo */}
        {/* <TypingIndicator /> */}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm text-gray-400">
            Ask anything...
          </div>
          <button
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 opacity-40"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

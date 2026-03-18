import { useState, useCallback, useRef } from 'react'
import { loadChat, saveChat, pruneMessages } from '../lib/storage'
import { parseAIResponse } from '../lib/parseResponse'
import { getTopicById } from '../data/topics'

function createSession(topicId) {
  return {
    topicId,
    messages: [],
    startedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    messageCount: 0,
    conceptsCovered: [],
    conceptsMastered: [],
    checkpointsPassed: 0,
    totalXpEarned: 0,
    sessionsCompleted: 0,
  }
}

export function useChat(topicId, { onConceptDiscovered } = {}) {
  const [session, setSession] = useState(() => {
    return loadChat(topicId) || createSession(topicId)
  })
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  const messages = session.messages

  const persist = useCallback((updated) => {
    const pruned = {
      ...updated,
      messages: pruneMessages(updated.messages),
    }
    saveChat(topicId, pruned)
  }, [topicId])

  const addMessage = useCallback((msg) => {
    setSession(prev => {
      const updated = {
        ...prev,
        messages: [...prev.messages, msg],
        messageCount: prev.messageCount + 1,
        lastActiveAt: new Date().toISOString(),
      }
      persist(updated)
      return updated
    })
  }, [persist])

  const sendMessage = useCallback(async (content) => {
    if (isStreaming) return
    setError(null)

    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      type: 'text',
      timestamp: new Date().toISOString(),
      metadata: null,
    }

    const currentMessages = [...session.messages, userMsg]

    setSession(prev => {
      const updated = {
        ...prev,
        messages: [...prev.messages, userMsg],
        messageCount: prev.messageCount + 1,
        lastActiveAt: new Date().toISOString(),
      }
      persist(updated)
      return updated
    })

    setIsStreaming(true)

    const topic = getTopicById(topicId)
    const apiMessages = currentMessages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .slice(-20)
      .map(m => ({ role: m.role, content: m.content }))

    const assistantId = crypto.randomUUID()
    let fullContent = ''

    // Add placeholder streaming message
    setSession(prev => ({
      ...prev,
      messages: [...prev.messages, {
        id: assistantId,
        role: 'assistant',
        content: '',
        type: 'text',
        timestamp: new Date().toISOString(),
        metadata: null,
      }],
    }))

    try {
      const controller = new AbortController()
      abortRef.current = controller

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          topicId,
          systemPrompt: topic?.systemPrompt || '',
        }),
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(response.status === 429
          ? 'Lots of people learning right now! Try again in a moment.'
          : 'Something went wrong. Tap to retry.')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        for (const line of chunk.split('\n')) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            if (data === '[DONE]') continue
            try {
              const parsed = JSON.parse(data)
              if (parsed.type === 'content_block_delta') {
                fullContent += parsed.delta?.text || ''
              } else if (parsed.delta?.text) {
                fullContent += parsed.delta.text
              } else if (typeof parsed === 'string') {
                fullContent += parsed
              }
            } catch {
              // Non-JSON SSE data — treat as text
              if (data !== '[DONE]') fullContent += data
            }
          }
        }

        // Update streaming message
        setSession(prev => {
          const msgs = [...prev.messages]
          const idx = msgs.findIndex(m => m.id === assistantId)
          if (idx !== -1) {
            msgs[idx] = { ...msgs[idx], content: fullContent }
          }
          return { ...prev, messages: msgs }
        })
      }

      // Parse final content for directives
      const parsed = parseAIResponse(fullContent)

      setSession(prev => {
        const msgs = [...prev.messages]
        const idx = msgs.findIndex(m => m.id === assistantId)
        if (idx !== -1) {
          msgs[idx] = { ...msgs[idx], content: fullContent }
        }

        // Add quiz as separate message if present
        if (parsed.quiz) {
          msgs.push({
            id: crypto.randomUUID(),
            role: 'assistant',
            content: parsed.quiz.question,
            type: 'quiz',
            timestamp: new Date().toISOString(),
            metadata: parsed.quiz,
          })
        }

        // Add suggestions as separate message if present
        if (parsed.suggestions) {
          msgs.push({
            id: crypto.randomUUID(),
            role: 'assistant',
            content: '',
            type: 'suggestion',
            timestamp: new Date().toISOString(),
            metadata: { suggestions: parsed.suggestions },
          })
        }

        const newConcepts = [...prev.conceptsCovered]
        const freshConcepts = []
        for (const c of parsed.concepts) {
          if (!newConcepts.includes(c)) {
            newConcepts.push(c)
            freshConcepts.push(c)
          }
        }
        if (freshConcepts.length > 0 && onConceptDiscovered) {
          onConceptDiscovered(freshConcepts)
        }

        const updated = {
          ...prev,
          messages: msgs,
          messageCount: prev.messageCount + 1,
          conceptsCovered: newConcepts,
          lastActiveAt: new Date().toISOString(),
        }
        persist(updated)
        return updated
      })
    } catch (err) {
      if (err.name === 'AbortError') return
      setError(err.message)
      // Remove the empty streaming message on error
      setSession(prev => {
        const msgs = prev.messages.filter(m => m.id !== assistantId)
        return { ...prev, messages: msgs }
      })
    } finally {
      setIsStreaming(false)
      abortRef.current = null
    }

    return { fullContent }
  }, [topicId, session.messages, isStreaming, persist])

  const retryLast = useCallback(() => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')
    if (lastUserMsg) {
      // Remove last failed messages
      setSession(prev => {
        const msgs = [...prev.messages]
        while (msgs.length > 0 && msgs[msgs.length - 1].role !== 'user') {
          msgs.pop()
        }
        return { ...prev, messages: msgs }
      })
      sendMessage(lastUserMsg.content)
    }
  }, [messages, sendMessage])

  const addSystemMessage = useCallback((msg) => {
    addMessage({
      id: crypto.randomUUID(),
      role: 'assistant',
      ...msg,
      timestamp: new Date().toISOString(),
    })
  }, [addMessage])

  return {
    messages,
    isStreaming,
    error,
    sendMessage,
    retryLast,
    session,
    addSystemMessage,
  }
}

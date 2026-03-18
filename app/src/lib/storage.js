const USER_KEY = 'aible_user'
const CHAT_KEY_PREFIX = 'aible_chat_'

export function loadUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveUser(user) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch (e) {
    console.warn('Failed to save user state:', e)
  }
}

export function loadChat(topicId) {
  try {
    const raw = localStorage.getItem(CHAT_KEY_PREFIX + topicId)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveChat(topicId, session) {
  try {
    localStorage.setItem(CHAT_KEY_PREFIX + topicId, JSON.stringify(session))
  } catch (e) {
    console.warn('Failed to save chat:', e)
  }
}

export function pruneMessages(messages, maxMessages = 150) {
  if (messages.length <= maxMessages) return messages
  const keep = messages.slice(-100)
  const pruned = messages.slice(0, messages.length - 100)
  const concepts = pruned
    .filter(m => m.type === 'concept')
    .map(m => m.metadata?.conceptId)
    .filter(Boolean)
  const summary = {
    id: 'summary-' + Date.now(),
    role: 'system',
    content: `Previous conversation covered ${pruned.length} messages. Concepts discussed: ${concepts.join(', ') || 'various topics'}.`,
    type: 'summary',
    timestamp: new Date().toISOString(),
    metadata: { conceptsCovered: concepts, sessionDuration: 0 },
  }
  return [summary, ...keep]
}

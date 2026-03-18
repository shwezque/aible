import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { loadUser, saveUser } from '../lib/storage'
import { getLevelForXp } from '../lib/xp'
import { checkNewBadges } from '../lib/badges'

function createDefaultUser() {
  return {
    userId: crypto.randomUUID(),
    displayName: '',
    role: '',
    goal: '',
    experienceLevel: 'none',
    learningStyle: 'metaphor',
    xp: 0,
    level: 1,
    streak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    badges: [],
    dailySessionsCompleted: 0,
    dailyGoal: 1,
    isPremium: false,
    topicProgress: {},
    createdAt: new Date().toISOString(),
    onboardingComplete: false,
    quizStreak: 0,
    dailyDate: null,
  }
}

function getToday() {
  return new Date().toISOString().split('T')[0]
}

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = loadUser()
    if (saved) {
      const today = getToday()
      if (saved.dailyDate !== today) {
        saved.dailySessionsCompleted = 0
        saved.dailyDate = today
      }
      return saved
    }
    return createDefaultUser()
  })

  useEffect(() => {
    saveUser(user)
  }, [user])

  const updateUser = useCallback((updates) => {
    setUser(prev => {
      const next = typeof updates === 'function' ? updates(prev) : { ...prev, ...updates }
      return next
    })
  }, [])

  const addXp = useCallback((amount) => {
    setUser(prev => {
      const newXp = prev.xp + amount
      const levelInfo = getLevelForXp(newXp)
      const updated = { ...prev, xp: newXp, level: levelInfo.level }
      const newBadges = checkNewBadges(updated)
      if (newBadges.length > 0) {
        updated.badges = [...(updated.badges || []), ...newBadges]
      }
      return updated
    })
    return amount
  }, [])

  const checkStreak = useCallback(() => {
    setUser(prev => {
      const today = getToday()
      if (prev.lastActiveDate === today) return prev

      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      let newStreak = 1
      if (prev.lastActiveDate === yesterdayStr) {
        newStreak = (prev.streak || 0) + 1
      }

      const updated = {
        ...prev,
        streak: newStreak,
        longestStreak: Math.max(newStreak, prev.longestStreak || 0),
        lastActiveDate: today,
      }
      const newBadges = checkNewBadges(updated)
      if (newBadges.length > 0) {
        updated.badges = [...(updated.badges || []), ...newBadges]
      }
      return updated
    })
  }, [])

  const completeSession = useCallback((topicId, xpEarned, conceptsCovered, conceptsMastered, checkpointsPassed) => {
    setUser(prev => {
      const today = getToday()
      const isFirstToday = prev.dailyDate !== today || prev.dailySessionsCompleted === 0
      const topicProgress = { ...prev.topicProgress }
      const existing = topicProgress[topicId] || {
        topicId, status: 'not_started', conceptsCovered: [], conceptsMastered: [],
        totalMessages: 0, totalXp: 0, checkpointsPassed: 0, lastActiveAt: null, sessionsCompleted: 0,
      }
      topicProgress[topicId] = {
        ...existing,
        status: 'in_progress',
        conceptsCovered: [...new Set([...existing.conceptsCovered, ...(conceptsCovered || [])])],
        conceptsMastered: [...new Set([...existing.conceptsMastered, ...(conceptsMastered || [])])],
        totalXp: existing.totalXp + xpEarned,
        checkpointsPassed: existing.checkpointsPassed + (checkpointsPassed || 0),
        lastActiveAt: new Date().toISOString(),
        sessionsCompleted: existing.sessionsCompleted + 1,
      }
      const totalXp = prev.xp + xpEarned + (isFirstToday ? 5 : 0)
      const levelInfo = getLevelForXp(totalXp)
      const updated = {
        ...prev, xp: totalXp, level: levelInfo.level, topicProgress,
        dailySessionsCompleted: (prev.dailyDate === today ? prev.dailySessionsCompleted : 0) + 1,
        dailyDate: today,
      }
      const newBadges = checkNewBadges(updated)
      if (newBadges.length > 0) {
        updated.badges = [...(updated.badges || []), ...newBadges]
      }
      return updated
    })
  }, [])

  const updateTopicProgress = useCallback((topicId, updates) => {
    setUser(prev => {
      const topicProgress = { ...prev.topicProgress }
      const existing = topicProgress[topicId] || {
        topicId, status: 'not_started', conceptsCovered: [], conceptsMastered: [],
        totalMessages: 0, totalXp: 0, checkpointsPassed: 0, lastActiveAt: null, sessionsCompleted: 0,
      }
      topicProgress[topicId] = { ...existing, ...updates }
      return { ...prev, topicProgress }
    })
  }, [])

  const canStartSession = user.isPremium || user.dailySessionsCompleted < 2

  const value = { user, updateUser, addXp, checkStreak, completeSession, updateTopicProgress, canStartSession }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

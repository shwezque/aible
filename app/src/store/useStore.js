import { useState, useCallback, useMemo } from 'react'
import modules from '../data/lessons'
import { LEVELS, XP_PER_EXERCISE, XP_LESSON_BONUS, XP_PERFECT_BONUS, FREE_LESSONS_PER_DAY, BADGES, STREAK_MILESTONES } from '../data/constants'

const STORAGE_KEY = 'aible-state'

function getToday() {
  return new Date().toLocaleDateString('en-CA')
}

function getDefaultState() {
  return {
    onboarded: false,
    role: null,
    goal: null,
    experience: null,
    dailyGoal: 'steady',
    email: null,
    name: null,
    isPro: false,
    xp: 0,
    streak: 0,
    lastActiveDate: null,
    streakFreezeUsedThisWeek: false,
    streakFreezeAvailable: true,
    completedLessons: [],
    currentModuleIndex: 0,
    currentLessonIndex: 0,
    difficultyTier: 'beginner',
    recentScores: [],
    badges: [],
    lessonsCompletedToday: 0,
    todayDate: getToday(),
    firstLessonDone: false,
    accountCreated: false,
    dailyGoalSet: false,
  }
}

function getYesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toLocaleDateString('en-CA')
}

function getWeekNumber() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  return Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7)
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultState()
    const saved = JSON.parse(raw)
    const state = { ...getDefaultState(), ...saved }
    const today = getToday()

    // Reset daily counters if new day
    if (state.todayDate !== today) {
      state.lessonsCompletedToday = 0

      // Check streak continuity on app open
      if (state.lastActiveDate && state.lastActiveDate !== today && state.streak > 0) {
        const yesterday = getYesterday()
        if (state.lastActiveDate !== yesterday) {
          // Missed at least one day — try streak freeze
          if (state.streakFreezeAvailable && !state.streakFreezeUsedThisWeek) {
            state.streakFreezeAvailable = false
            state.streakFreezeUsedThisWeek = true
            state._streakFrozen = true // flag for UI notification
          } else {
            state.streak = 0
          }
        }
      }

      // Reset streak freeze weekly
      const currentWeek = getWeekNumber()
      if (state._lastFreezeResetWeek !== currentWeek) {
        state.streakFreezeAvailable = true
        state.streakFreezeUsedThisWeek = false
        state._lastFreezeResetWeek = currentWeek
      }

      state.todayDate = today
    }
    return state
  } catch {
    return getDefaultState()
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch { /* silent */ }
}

export function useStore() {
  const [state, setStateRaw] = useState(loadState)

  const setState = useCallback((updater) => {
    setStateRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }
      saveState(next)
      return next
    })
  }, [])

  const update = useCallback((partial) => {
    setState(prev => ({ ...prev, ...partial }))
  }, [setState])

  const getLevel = useCallback(() => {
    let lvl = LEVELS[0]
    for (const l of LEVELS) {
      if (state.xp >= l.xpRequired) lvl = l
    }
    return lvl
  }, [state.xp])

  const getCurrentLesson = useCallback(() => {
    const mod = modules[state.currentModuleIndex]
    if (!mod) return null
    return mod.lessons[state.currentLessonIndex] || null
  }, [state.currentModuleIndex, state.currentLessonIndex])

  const completeLesson = useCallback((lessonId, score, total) => {
    setState(prev => {
      const isReplay = prev.completedLessons.includes(lessonId)
      const perfect = score === total
      const earnedXp = isReplay ? 0 : (total * XP_PER_EXERCISE) + XP_LESSON_BONUS + (perfect ? XP_PERFECT_BONUS : 0)
      const newXp = prev.xp + earnedXp
      const newCompleted = isReplay ? prev.completedLessons : [...prev.completedLessons, lessonId]
      const lessonsToday = isReplay ? prev.lessonsCompletedToday : prev.lessonsCompletedToday + 1

      // Update streak
      const today = getToday()
      let newStreak = prev.streak
      let freezeAvailable = prev.streakFreezeAvailable
      let freezeUsedThisWeek = prev.streakFreezeUsedThisWeek
      if (prev.lastActiveDate !== today) {
        const yesterdayStr = getYesterday()
        if (prev.lastActiveDate === yesterdayStr || prev.streak === 0) {
          newStreak = prev.streak + 1
        } else if (freezeAvailable && !freezeUsedThisWeek) {
          // streak freeze saves it — consume the freeze
          newStreak = prev.streak + 1
          freezeAvailable = false
          freezeUsedThisWeek = true
        } else {
          newStreak = 1
        }
      }

      // Update difficulty tier
      const recentScores = [...prev.recentScores, score / total].slice(-3)
      const avg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length
      let tier = prev.difficultyTier
      if (recentScores.length >= 3) {
        if (avg > 0.8) tier = tier === 'beginner' ? 'intermediate' : tier === 'intermediate' ? 'advanced' : 'advanced'
        else if (avg < 0.5) tier = tier === 'advanced' ? 'intermediate' : tier === 'intermediate' ? 'beginner' : 'beginner'
      }

      // Advance to next lesson
      let nextMod = prev.currentModuleIndex
      let nextLesson = prev.currentLessonIndex + 1
      if (nextLesson >= modules[nextMod]?.lessons.length) {
        nextMod++
        nextLesson = 0
      }

      // Check badges
      const newBadges = [...prev.badges]
      if (newCompleted.length === 1 && !newBadges.includes('first-prompt')) {
        newBadges.push('first-prompt')
      }
      if (newStreak >= 7 && !newBadges.includes('on-fire')) {
        newBadges.push('on-fire')
      }
      if (newCompleted.filter(id => id.startsWith('lesson-1-')).length >= 6 && !newBadges.includes('prompt-crafter')) {
        newBadges.push('prompt-crafter')
      }
      if (perfect && !newBadges.includes('perfect-score')) {
        newBadges.push('perfect-score')
      }
      if (newCompleted.length >= 10 && !newBadges.includes('ai-explorer')) {
        newBadges.push('ai-explorer')
      }

      // Check streak milestone
      let streakMilestone = null
      if (STREAK_MILESTONES.includes(newStreak) && newStreak > prev.streak) {
        streakMilestone = newStreak
      }

      return {
        ...prev,
        xp: newXp,
        completedLessons: newCompleted,
        lessonsCompletedToday: lessonsToday,
        currentModuleIndex: nextMod,
        currentLessonIndex: nextLesson,
        streak: newStreak,
        streakFreezeAvailable: freezeAvailable,
        streakFreezeUsedThisWeek: freezeUsedThisWeek,
        lastActiveDate: today,
        todayDate: today,
        recentScores,
        difficultyTier: tier,
        badges: newBadges,
        firstLessonDone: true,
        _lastEarnedXp: earnedXp,
        _lastPerfect: perfect,
        _lastScore: score,
        _lastTotal: total,
        _streakMilestone: streakMilestone,
        _newBadges: newBadges.filter(b => !prev.badges.includes(b)),
      }
    })
  }, [setState])

  const canPlayLesson = useMemo(() => {
    if (state.isPro) return true
    return state.lessonsCompletedToday < FREE_LESSONS_PER_DAY
  }, [state.isPro, state.lessonsCompletedToday])

  const dailyGoalMet = useMemo(() => {
    const targets = { quick: 1, steady: 2, ambitious: 3 }
    return state.lessonsCompletedToday >= (targets[state.dailyGoal] || 2)
  }, [state.lessonsCompletedToday, state.dailyGoal])

  const resetState = useCallback(() => {
    const fresh = getDefaultState()
    saveState(fresh)
    setStateRaw(fresh)
  }, [])

  return {
    ...state,
    update,
    getLevel,
    getCurrentLesson,
    completeLesson,
    canPlayLesson,
    dailyGoalMet,
    resetState,
    modules,
  }
}

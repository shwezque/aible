import { useMemo } from 'react'
import { TOPICS } from '../data/topics'

export function useTopics(userTopicProgress = {}) {
  const topics = useMemo(() => {
    return TOPICS.map(topic => {
      const progress = userTopicProgress[topic.id] || {
        status: 'not_started',
        conceptsCovered: [],
        conceptsMastered: [],
        totalMessages: 0,
        totalXp: 0,
        checkpointsPassed: 0,
        lastActiveAt: null,
        sessionsCompleted: 0,
      }

      const conceptCount = topic.conceptMap?.length || 1
      const coveredCount = progress.conceptsCovered?.length || 0
      const progressPercent = Math.round((coveredCount / conceptCount) * 100)

      return {
        ...topic,
        progress,
        progressPercent,
        isStarted: progress.status !== 'not_started',
      }
    })
  }, [userTopicProgress])

  const activeTopic = useMemo(() => {
    const started = topics
      .filter(t => t.isStarted && !t.isComingSoon)
      .sort((a, b) => {
        const aTime = a.progress.lastActiveAt || ''
        const bTime = b.progress.lastActiveAt || ''
        return bTime.localeCompare(aTime)
      })
    return started[0] || null
  }, [topics])

  const getTopic = (id) => topics.find(t => t.id === id)

  return { topics, activeTopic, getTopic }
}

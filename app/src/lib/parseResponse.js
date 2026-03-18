export function parseAIResponse(rawContent) {
  const result = {
    displayContent: rawContent,
    quiz: null,
    concepts: [],
    suggestions: null,
  }

  const quizMatch = rawContent.match(/\[QUIZ\](.*?)\[\/QUIZ\]/s)
  if (quizMatch) {
    try {
      result.quiz = JSON.parse(quizMatch[1])
    } catch { /* skip malformed */ }
    result.displayContent = result.displayContent
      .replace(/\[QUIZ\].*?\[\/QUIZ\]/s, '').trim()
  }

  const conceptMatches = rawContent.matchAll(/\[CONCEPT\](.*?)\[\/CONCEPT\]/g)
  for (const match of conceptMatches) {
    result.concepts.push(match[1].trim())
  }
  result.displayContent = result.displayContent
    .replace(/\[CONCEPT\].*?\[\/CONCEPT\]/g, '').trim()

  const sugMatch = rawContent.match(/\[SUGGESTIONS\](.*?)\[\/SUGGESTIONS\]/s)
  if (sugMatch) {
    try {
      result.suggestions = JSON.parse(sugMatch[1]).suggestions
    } catch { /* skip malformed */ }
    result.displayContent = result.displayContent
      .replace(/\[SUGGESTIONS\].*?\[\/SUGGESTIONS\]/s, '').trim()
  }

  return result
}

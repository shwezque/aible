# Technical Specification — Aible (Chat-Based Pivot)

> Version 2.0 — Conversational SLM architecture
> Last updated: 2026-03-18

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────┐
│  React App (Vite + Tailwind + React Router) │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐ │
│  │ useStore  │  │ useChat   │  │ useTopic  │ │
│  │ (user     │  │ (messages,│  │ (topic    │ │
│  │  state)   │  │  stream)  │  │  data)    │ │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘ │
│        │              │              │       │
│        ▼              ▼              ▼       │
│   localStorage   Vercel Edge    Static JSON  │
│                  Function                    │
│                  (LLM proxy)                 │
└─────────────────────────────────────────────┘
                       │
                       ▼
              Anthropic API (Claude Haiku)
              (single model, per-topic system prompts)
```

---

## 2. SLM Integration Strategy

### Prototype Approach

**Use Claude 3.5 Haiku with topic-specific system prompts.** Each "specialized tutor" is one model wearing a different hat.

- One API, one billing account, one env var
- System prompts give strong behavioral differentiation
- Haiku: ~$0.25/1M input tokens, $1.25/1M output — cheap for prototype
- Streaming support for real-time chat feel

### Production Evolution

- Fine-tuned models per topic domain
- RAG with topic-specific knowledge bases
- System prompt approach remains the foundation regardless

---

## 3. API Integration Pattern

### Serverless Proxy (Vercel Edge Function)

API keys never touch the client. A Vercel Edge Function proxies all LLM calls.

**File: `api/chat.js`**

```javascript
export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { messages, topicId } = await req.json();

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1024,
      system: getSystemPrompt(topicId),
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      stream: true,
    }),
  });

  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
}
```

### Streaming (Client Side)

```javascript
async function* streamChat(messages, topicId) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, topicId }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    for (const line of chunk.split('\n')) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6));
        if (data.type === 'content_block_delta') {
          yield data.delta.text;
        }
      }
    }
  }
}
```

### Error Handling

| Error | User Experience |
|-------|----------------|
| Network offline | "You're offline. Your chat history is saved." |
| API rate limit (429) | "Lots of people learning right now! Try again in a moment." |
| API error (500) | "Something went wrong. Your message is saved — tap to retry." |
| Timeout (>15s) | "This is taking longer than usual. Tap to retry." |

---

## 4. State Management

### Three Hooks

#### `useStore()` — User State

```javascript
const { user, updateUser, addXp, checkStreak, addBadge } = useStore();
```

Persisted in localStorage `aible_user`. Global scope.

#### `useChat(topicId)` — Chat for a Topic

```javascript
const {
  messages,
  isStreaming,
  sendMessage,
  retryLast,
  session,
} = useChat('ai-basics');
```

Persisted in localStorage `aible_chat_{topicId}`. Per-chat-screen scope.

`sendMessage` flow:
1. Append user message to local state + localStorage
2. POST `/api/chat` with last 20 messages + summary prefix
3. Stream response tokens into growing assistant message
4. On completion: save, parse for directives, check XP triggers, update TopicProgress

#### `useTopics()` — Topic Definitions

```javascript
const { topics, getTopic, isUnlocked } = useTopics();
```

Static data merged with user progress. Not persisted separately.

---

## 5. System Prompt Architecture

### Base Template (shared by all tutors)

```
You are {tutorName}, an AI tutor in the Aible learning app.
Your topic area: {topicDescription}

## Your Personality
{personalityDescription}

## Teaching Approach
- Start with what the user already knows
- Give concrete examples before abstract explanations
- Keep responses to 2-4 short paragraphs max
- After explaining, end with a question that nudges deeper thinking
- Every 8-10 exchanges, introduce a Quick Check

## Quick Checks
Format exactly like this on its own line:
[QUIZ]{"question":"...","options":["A","B","C"],"correctIndex":1,"xpValue":10}[/QUIZ]

Make checks feel natural ("Let me see if this clicked..."), not test-like.

## Concept Tracking
When you cover a core concept, include this tag:
[CONCEPT]concept-id-here[/CONCEPT]

Your core concepts: {conceptMapList}

## Suggested Follow-ups
Every 3-4 exchanges, offer suggestions:
[SUGGESTIONS]{"suggestions":["Question 1?","Question 2?","Question 3?"]}[/SUGGESTIONS]

## Boundaries
- Stay within your topic area
- If asked about something outside scope, redirect: "That's more of a {otherTutor} topic!"
- Never give answers directly — guide through Socratic questioning
- Never generate harmful content

## User Context
- Experience level: {experienceLevel}
- Learning goal: {userGoal}
- Role: {userRole}
```

### Context Window Management

- **Send last 20 messages** to the API (not full history)
- **Prepend a summary** of older conversation if available
- System prompt ~800 tokens + 20 messages ~4000 tokens = ~5K tokens per request
- At $0.25/1M input: ~$0.00125 per exchange
- 1000 daily users × 10 messages = ~$12.50/day

---

## 6. Parsing AI Responses

The AI embeds structured directives. The client parses before rendering.

```javascript
function parseAIResponse(rawContent) {
  const result = {
    displayContent: rawContent,
    quiz: null,
    concepts: [],
    suggestions: null,
  };

  // Extract quiz
  const quizMatch = rawContent.match(/\[QUIZ\](.*?)\[\/QUIZ\]/s);
  if (quizMatch) {
    result.quiz = JSON.parse(quizMatch[1]);
    result.displayContent = result.displayContent
      .replace(/\[QUIZ\].*?\[\/QUIZ\]/s, '').trim();
  }

  // Extract concepts
  const conceptMatches = rawContent.matchAll(/\[CONCEPT\](.*?)\[\/CONCEPT\]/g);
  for (const match of conceptMatches) {
    result.concepts.push(match[1].trim());
  }
  result.displayContent = result.displayContent
    .replace(/\[CONCEPT\].*?\[\/CONCEPT\]/g, '').trim();

  // Extract suggestions
  const sugMatch = rawContent.match(/\[SUGGESTIONS\](.*?)\[\/SUGGESTIONS\]/s);
  if (sugMatch) {
    result.suggestions = JSON.parse(sugMatch[1]).suggestions;
    result.displayContent = result.displayContent
      .replace(/\[SUGGESTIONS\].*?\[\/SUGGESTIONS\]/s, '').trim();
  }

  return result;
}
```

---

## 7. localStorage Strategy

### Storage Budget

| Key | Budget |
|-----|--------|
| User state | ~5 KB |
| Chat sessions (3 MVP topics) | ~600 KB max |
| **Total** | **~605 KB** |

### Message Pruning

When a topic exceeds **150 messages**:
1. Keep last 100 messages intact
2. Generate summary from pruned messages (client-side, from concept tags)
3. Store summary as first message in array
4. Delete pruned messages

### Data Integrity

- All writes use `try/catch` around `localStorage.setItem`
- `useChat` debounces writes (save after stream completes, not per token)
- On app load, validate stored data shape; if corrupt, reset with notice

---

## 8. File Structure (Post-Pivot)

```
app/
├── api/
│   └── chat.js              # Vercel Edge Function (LLM proxy)
├── src/
│   ├── components/
│   │   ├── ChatBubble.jsx
│   │   ├── ChatInput.jsx
│   │   ├── QuizCard.jsx
│   │   ├── SuggestionChips.jsx
│   │   ├── ConceptCard.jsx
│   │   ├── TopicCard.jsx
│   │   ├── XpToast.jsx
│   │   ├── MilestoneModal.jsx
│   │   ├── StreakBanner.jsx
│   │   ├── ProgressRing.jsx
│   │   └── Header.jsx
│   ├── data/
│   │   └── topics.js         # Topic definitions + system prompts
│   ├── hooks/
│   │   ├── useStore.js        # User state (localStorage)
│   │   ├── useChat.js         # Chat state + API streaming
│   │   └── useTopics.js       # Topic data + progress merging
│   ├── lib/
│   │   ├── parseResponse.js   # AI response parser
│   │   ├── xp.js              # XP calculations, level thresholds
│   │   ├── badges.js          # Badge definitions + triggers
│   │   └── storage.js         # localStorage helpers, pruning
│   ├── pages/
│   │   ├── Onboarding.jsx
│   │   ├── Home.jsx           # Topic selection grid
│   │   ├── Chat.jsx           # Main chat screen
│   │   ├── Today.jsx          # Daily dashboard
│   │   ├── Profile.jsx        # Stats, badges, settings
│   │   └── Paywall.jsx        # Premium upgrade
│   └── App.jsx                # Routes
└── vite.config.js
```

---

## 9. Route Structure

| Route | Page | Params |
|-------|------|--------|
| `/` | Home (or Onboarding if new) | — |
| `/onboarding` | Onboarding flow | — |
| `/chat/:topicId` | Chat with topic tutor | `topicId` |
| `/today` | Daily dashboard | — |
| `/profile` | User profile + stats | — |
| `/upgrade` | Paywall | — |

---

## 10. Environment Variables

### Prototype (1 env var)

| Variable | Where | Purpose |
|----------|-------|---------|
| `ANTHROPIC_API_KEY` | Vercel env vars | LLM API access |

### Future (Production)

| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL` | Database + Auth |
| `SUPABASE_ANON_KEY` | Client-side access |
| `STRIPE_SECRET_KEY` | Payments |

---

## 11. Migration Path

| Phase | What Changes |
|-------|-------------|
| **1. Add Auth** | `aible_user` → Supabase `users` table, add Supabase Auth |
| **2. Persist Chats** | `aible_chat_*` → Supabase `chat_sessions` + `messages` tables |
| **3. Server-Side XP** | Move XP/badge logic to Edge Functions |
| **4. Real Payments** | Simulated premium → Stripe Checkout |
| **5. Fine-Tuned Models** | System prompts → fine-tuned models per topic + RAG |

The prototype is structured so **no component needs to know** where data comes from. Hooks abstract storage. Swapping localStorage for Supabase is a hook-level change.

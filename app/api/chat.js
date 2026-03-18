export const config = { runtime: 'edge' }

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { messages, systemPrompt } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages', { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Ensure alternating roles (Anthropic requires this)
    const cleaned = []
    for (const m of messages.slice(-20)) {
      const msg = { role: m.role, content: m.content }
      if (cleaned.length > 0 && cleaned[cleaned.length - 1].role === msg.role) {
        // Merge consecutive same-role messages
        cleaned[cleaned.length - 1].content += '\n' + msg.content
      } else {
        cleaned.push(msg)
      }
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: systemPrompt || 'You are a helpful AI tutor.',
        messages: cleaned,
        stream: true,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Anthropic API error:', response.status, errText)
      return new Response(errText, { status: response.status })
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (err) {
    console.error('Chat handler error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

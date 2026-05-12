const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

/**
 * Call the Anthropic Claude API.
 * @param {string} userMessage
 * @param {string} systemMessage
 * @returns {Promise<string>} - text response
 */
export async function callClaude(userMessage, systemMessage = '') {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemMessage,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err?.error?.message || 'Claude API error')
  }

  const data = await response.json()
  return data.content?.[0]?.text || ''
}

/**
 * Call Claude and parse the response as JSON.
 * Strips markdown code fences if present.
 */
export async function callClaudeJSON(userMessage, systemMessage = '') {
  const text = await callClaude(userMessage, systemMessage)
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

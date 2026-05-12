const API_KEY = import.meta.env.VITE_GROQ_API_KEY
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'


export async function callClaude(userMessage, systemMessage = '') {
  const messages = []
  if (systemMessage) messages.push({ role: 'system', content: systemMessage })
  messages.push({ role: 'user', content: userMessage })

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err?.error?.message || 'Groq API error')
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}


export async function callClaudeJSON(userMessage, systemMessage = '') {
  const text = await callClaude(userMessage, systemMessage)
  console.log('Groq raw response:', text)
  const clean = text.replace(/```json/gi, '').replace(/```/g, '').trim()
  const match = clean.match(/(\[[\s\S]*\]|\{[\s\S]*\})/)
  if (!match) throw new Error('No JSON found in response: ' + clean)
  return JSON.parse(match[0])
}

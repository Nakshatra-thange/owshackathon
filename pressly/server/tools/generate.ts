import OpenAI from 'openai'
import { broadcast } from '../index'
import { logTransaction } from '../ledger'

export async function generateNewsletter(topic: string, scrapedContent: string): Promise<string> {
  console.log('[Generate] Starting...')
  
  // Create client INSIDE function — dotenv is loaded by then
  const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': 'https://pressly.xyz',
      'X-OpenRouter-Title': 'Pressly'
    }
  })

  broadcast({ event: 'agent_step', message: `Writing newsletter about: ${topic}`, status: 'running' })

  try {
    const response = await (client.chat.completions.create as any)({
      model: 'qwen/qwen3.6-plus:free',
      max_tokens: 500,
      extra_body: {
        thinking: false
      },
      messages: [
        {
          role: 'system',
          content: `You are Pressly, a newsletter writing agent. Output ONLY the newsletter. No thinking. No explanations. No word counts. First line must be: Subject: [subject line]. Then write the newsletter body. Maximum 200 words total. Do not explain what you are doing. Just write the newsletter.`
        },
        {
          role: 'user',
          content: `Write a newsletter about "${topic}" using these trending articles:\n${scrapedContent}\n\nOutput only the newsletter, nothing else.`
        }
      ]
    })

    const content = response.choices[0].message.content || ''
    console.log('[Generate] Responded:', content.slice(0, 60))
    logTransaction('spend', 0, 'Nemotron generation (free)')
    broadcast({ event: 'agent_step', message: `✅ Newsletter written.`, status: 'done' })
    return content

  } catch(err: any) {
    console.error('[Generate] Error:', err.message)
    throw err
  }
}
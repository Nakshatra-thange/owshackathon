
import OpenAI from 'openai'
import { broadcast } from '../index'
import { logTransaction } from '../ledger'

export async function generateNewsletter(topic: string, scrapedContent: string): Promise<string> {
  const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
  })

  broadcast({
    event: 'agent_step',
    message: `✍️ Writing newsletter about: ${topic}`,
    status: 'running'
  })

  const response = await openai.chat.completions.create({
    model: "openai/gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are Pressly, an elite AI newsletter agent. Write sharp, insightful, high-signal newsletters.`
      },
      {
        role: "user",
        content: `Topic: ${topic}\n\nContent:\n${scrapedContent}`
      }
    ]
  })

  const content = response.choices[0].message.content || ''

  logTransaction('spend', 0.002, 'Newsletter generation')

  broadcast({
    event: 'agent_step',
    message: `✅ Newsletter written`,
    status: 'done'
  })

  return content
}
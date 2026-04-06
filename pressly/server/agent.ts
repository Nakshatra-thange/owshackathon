import { broadcast , isPaused } from './index'
import { scrapeTrendingTopics } from './tools/scrape'
import { generateNewsletter } from './tools/generate'
import { chargeSubscribers } from './tools/charge'
import { sendNewsletter } from './tools/sendEmail'

import { resetSession, getSessionData } from './ledger'
import { saveRun } from './database'
const SPEND_CAP = 0.10 
let totalSpent = 0

export async function runAgent(topic: string) {
  resetSession()
  console.log(`[Agent] Starting run. Topic: ${topic}`)
  
  broadcast({ event: 'agent_start', message: `Pressly agent starting. Topic: "${topic}"` })
  totalSpent = 0

  try {
    console.log('[Agent] Calling scrape...') 
    const content = await scrapeTrendingTopics(topic)
    totalSpent += 0.01
    console.log('[Agent] Scrape done. Calling generate...')
    if (!content || content.length < 20) {
        broadcast({
          event: 'agent_error',
          message: `No useful content found. Stopping.`
        })
        return
      }
    if (totalSpent >= SPEND_CAP) {
      broadcast({ event: 'agent_halt', message: `🛑 Spend cap reached. Halting.` })
      return
    }
    let newsletter = await generateNewsletter(topic, content)
    totalSpent += 0.002
    if (!newsletter || newsletter.length < 100) {
        broadcast({
          event: 'agent_step',
          message: `Content weak → regenerating...`,
          status: 'warning'
        })
  
        newsletter = await generateNewsletter(topic, content)
        totalSpent += 0.002
      }
    const lines = newsletter.split('\n')
    const subject = lines[0]
  .replace(/^subject:/i, '')
  .replace(/[\n\r\u2028\u2029]/g, ' ')  
  .replace(/\*/g, '')
  .replace(/[^\x20-\x7E]/g, '')          
  .trim()
    const body = lines.slice(1).join('\n')

    
    broadcast({ 
        event: 'awaiting_approval', 
        subject, 
        preview: body.slice(0, 200) 
    })
    await waitForApproval() 
    console.log('[Agent] Approval done. Charging subscribers...')
    
    await chargeSubscribers()

    console.log('[Agent] Charging done. Sending email...')
    console.log('[Agent] Subject being sent:', JSON.stringify(subject))
console.log('[Agent] Body length:', body.length)
const cleanSubject = subject.replace(/[^\x20-\x7E]/g, '').trim()
console.log('[Agent] Clean subject:', JSON.stringify(cleanSubject))
    await sendNewsletter(cleanSubject,body)
    console.log('[Agent] Email sent.')

    const session = getSessionData()
saveRun({
  topic,
  subject,
  startedAt: new Date().toISOString(),
  completedAt: new Date().toISOString(),
  earned: session.earned,
  spent: session.spent,
  profit: session.earned - session.spent,
  transactions: session.transactions
})

    broadcast({ 
        event: 'agent_done', 
        message: `Pressly cycle complete. 
        Check P&L for profit.` 
    })

  } catch (err: any) {
    broadcast({ 
        event: 'agent_error', 
        message: `Agent error: ${err.message}` 
    })
  }
}

function waitForApproval(): Promise<void> {
  return new Promise(resolve => {
    // Auto-approve after 5 seconds if never paused
    let elapsed = 0
    const check = setInterval(() => {
      elapsed += 500
      if (!isPaused()) {
        if (elapsed >= 5000) {  // only auto-approve after 5 seconds
          clearInterval(check)
          resolve()
        }
      }
      // If paused, keep waiting — don't resolve
      // Resolves only when unpaused AND 5 seconds have passed
    }, 500)
  })
}
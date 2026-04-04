import axios from 'axios'
import { broadcast } from '../index'
import { logTransaction } from '../ledger'

export async function scrapeTrendingTopics(topic: string): Promise<string> {
  broadcast({ event: 'agent_step', message: `Scraping trending topics for: ${topic}`, status: 'running' })

  try {
    // Free NewsAPI — get real articles about the topic
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: topic,
        pageSize: 5,
        sortBy: 'publishedAt',
        apiKey: process.env.NEWSAPI_KEY
      }
    })

    const articles = response.data.articles
    const data = articles.map((a: any, i: number) => 
      `${i+1}. ${a.title} — ${a.description || ''}`
    ).join('\n')

    logTransaction('spend', 0.01, 'Scraped trending topics (x402 simulated)')
    broadcast({ event: 'agent_step', message: `Scraping complete. Paid $0.01`, status: 'done' })
    return data

  } catch(err: any) {
    console.error('[Scrape] NewsAPI failed:', err.message)
    // Fallback
    const data = `
1. ${topic} is being transformed by AI automation and autonomous systems
2. Crypto micropayments are disrupting ${topic} revenue models
3. Blockchain is creating new opportunities in ${topic}
4. Data analytics are reshaping ${topic} decision making
5. Autonomous agents are entering ${topic} markets
    `
    logTransaction('spend', 0.01, 'Scraped trending topics (fallback)')
    broadcast({ event: 'agent_step', message: `Scraping complete (fallback). Paid $0.01`, status: 'done' })
    return data
  }
}
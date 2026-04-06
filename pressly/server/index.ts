import dotenv from 'dotenv'
dotenv.config()
import { getRuns, getTotals } from './database'
import express from 'express'
import WebSocket from 'ws'
import { createServer } from 'http'
import cors from 'cors'
import { runAgent } from './agent'

const PORT = process.env.PORT || 3001

const app = express()
app.use(cors({
  origin: [
    'http://localhost:8080',
    'https://pressly-iota.vercel.app',
    /\.vercel\.app$/
  ]
}))
app.use(express.json())

app.get('/', (_, res) => {
  res.json({ status: 'Pressly server running' })
})

const server = createServer(app)
const wss = new WebSocket.Server({ port: 3002 })

// SSE clients map
const sseClients = new Map<number, any>()

wss.on('connection', (ws) => {
  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) ws.ping()
  }, 30000)
  ws.on('close', () => clearInterval(interval))
})

export function broadcast(event: object) {
  const msg = JSON.stringify(event)

  // WebSocket — works locally
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) client.send(msg)
  })

  // SSE — works on Render
  sseClients.forEach(res => {
    res.write(`data: ${msg}\n\n`)
  })
}

// SSE endpoint
app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.flushHeaders()

  const clientId = Date.now()
  sseClients.set(clientId, res)

  // Keep alive ping every 20 seconds
  const keepAlive = setInterval(() => {
    res.write(': ping\n\n')
  }, 20000)

  req.on('close', () => {
    sseClients.delete(clientId)
    clearInterval(keepAlive)
  })
})

app.post('/api/run', async (req, res) => {
  const { topic } = req.body
  console.log(`[Server] /api/run called with topic: ${topic}`)
  res.json({ status: 'started' })
  runAgent(topic || 'AI and technology').catch(console.error)
})

let paused = false
export const isPaused = () => paused

app.post('/api/pause', (_, res) => {
  paused = true
  broadcast({ event: 'agent_step', message: '⏸ Agent paused by human', status: 'warning' })
  res.json({ paused: true })
})

app.post('/api/resume', (_, res) => {
  paused = false
  broadcast({ event: 'agent_step', message: '▶ Agent resumed', status: 'running' })
  res.json({ paused: false })
})

app.get('/api/history', (_, res) => {
  res.json({ runs: getRuns(), totals: getTotals() })
})

server.listen(PORT, () => console.log(`Pressly server on :${PORT}`))
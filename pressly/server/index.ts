import  dotenv from 'dotenv'
dotenv.config()
import { getRuns, getTotals } from './database'


import express from 'express'
import  WebSocket from 'ws'
import { createServer } from 'http'

import cors from 'cors'

import { runAgent } from './agent'
const PORT = process.env.PORT || 3001

const app = express()
app.use(cors({
    origin: ['http://localhost:8080',
    'https://pressly-iota.vercel.app'
  ]}))
  
app.use(express.json())
app.get('/', (_, res) => {
  res.json({ status: 'Pressly server running' })
})


const server = createServer(app)
const wss = new WebSocket.Server({ port: 3002 })
wss.on('connection', (ws) => {
  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping()
    }
  }, 30000)
  ws.on('close', () => clearInterval(interval))
})

export function broadcast(event: object) {
  const msg = JSON.stringify(event)
  wss.clients.forEach(client => {
    if (client.readyState ==WebSocket.OPEN){ client.send(msg)}
  })
}
app.post('/api/run', async (req, res) => {
  const { topic } = req.body
  console.log(`[Server] /api/run called with topic: ${topic}`) // add this
  res.json({ status: 'started' })
  runAgent(topic || 'AI and technology').catch(console.error) // add .catch
})

let paused = false
export const isPaused = () => paused
app.post('/api/pause', (_, res) => { paused = true; res.json({ paused: true }) })
app.post('/api/resume', (_, res) => { paused = false; res.json({ paused: false }) })
app.get('/api/history', (_, res) => {
  res.json({
    runs: getRuns(),
    totals: getTotals()
  })
})

server.listen(PORT, () => console.log(`Pressly server on :${PORT}`))
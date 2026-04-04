import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(__dirname, 'db.json')

interface Run {
  id: string
  topic: string
  subject: string
  startedAt: string
  completedAt: string
  earned: number
  spent: number
  profit: number
  transactions: Transaction[]
}

interface Transaction {
  type: 'earn' | 'spend'
  amount: number
  description: string
  timestamp: string
}

interface DB {
  runs: Run[]
  totals: {
    earned: number
    spent: number
  }
}

function readDB(): DB {
  if (!fs.existsSync(DB_PATH)) {
    const empty: DB = { runs: [], totals: { earned: 0, spent: 0 } }
    fs.writeFileSync(DB_PATH, JSON.stringify(empty, null, 2))
    return empty
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
}

function writeDB(data: DB): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

export function saveRun(run: Omit<Run, 'id'>): Run {
  const db = readDB()
  const newRun: Run = { id: Date.now().toString(), ...run }
  db.runs.unshift(newRun) // newest first
  db.totals.earned += run.earned
  db.totals.spent += run.spent
  writeDB(db)
  return newRun
}

export function getTotals(): { earned: number; spent: number; profit: number } {
  const db = readDB()
  return {
    earned: db.totals.earned,
    spent: db.totals.spent,
    profit: db.totals.earned - db.totals.spent
  }
}

export function getRuns(): Run[] {
  return readDB().runs
}
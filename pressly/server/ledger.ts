import { broadcast } from './index'
import { getTotals } from './database'

interface Transaction {
  type: 'earn' | 'spend'
  amount: number
  description: string
  timestamp: string
}

// Session transactions (current run only)
let sessionTransactions: Transaction[] = []
let sessionEarned = 0
let sessionSpent = 0

export function resetSession() {
  sessionTransactions = []
  sessionEarned = 0
  sessionSpent = 0
}

export function logTransaction(type: 'earn' | 'spend', amount: number, description: string) {
  const tx: Transaction = {
    type, amount, description,
    timestamp: new Date().toISOString()
  }
  sessionTransactions.push(tx)

  if (type === 'earn') sessionEarned += amount
  else sessionSpent += amount

  // Get all-time totals from DB and add current session
  const allTime = getTotals()

  broadcast({
    event: 'pnl_update',
    // Session (current run)
    earned: sessionEarned.toFixed(4),
    spent: sessionSpent.toFixed(4),
    profit: (sessionEarned - sessionSpent).toFixed(4),
    // All time (persistent)
    totalEarned: (allTime.earned + sessionEarned).toFixed(4),
    totalSpent: (allTime.spent + sessionSpent).toFixed(4),
    totalProfit: (allTime.profit + sessionEarned - sessionSpent).toFixed(4),
    lastTx: tx
  })
}

export function getSessionData() {
  return {
    earned: sessionEarned,
    spent: sessionSpent,
    transactions: sessionTransactions
  }
}
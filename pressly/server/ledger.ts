import { broadcast } from './index'
import { getTotals } from './database'

interface Transaction {
  type: 'earn' | 'spend'
  amount: number
  description: string
  timestamp: string
}


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

  const allTime = getTotals()

  broadcast({
    event: 'pnl_update',
    
    earned: sessionEarned.toFixed(4),
    spent: sessionSpent.toFixed(4),
    profit: (sessionEarned - sessionSpent).toFixed(4),
   
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
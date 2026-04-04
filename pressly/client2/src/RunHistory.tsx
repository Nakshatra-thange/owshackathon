import { useEffect, useState } from 'react'

interface Run {
  id: string
  topic: string
  subject: string
  completedAt: string
  earned: number
  spent: number
  profit: number
}

export default function RunHistory() {
  const [runs, setRuns] = useState<Run[]>([])
  const [totals, setTotals] = useState({ earned: 0, spent: 0, profit: 0 })

  useEffect(() => {
    fetch('http://localhost:3001/api/history')
      .then(r => r.json())
      .then(data => {
        setRuns(data.runs)
        setTotals(data.totals)
      })
  }, [])

  if (runs.length === 0) return (
    <div style={{ color: '#444', fontSize: '0.875rem' }}>No runs yet.</div>
  )

  return (
    <div>
      {/* All time totals */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
        {[
          { label: 'ALL TIME EARNED', value: `$${totals.earned.toFixed(4)}`, color: '#22c55e' },
          { label: 'ALL TIME SPENT', value: `$${totals.spent.toFixed(4)}`, color: '#ef4444' },
          { label: 'ALL TIME PROFIT', value: `$${totals.profit.toFixed(4)}`, color: totals.profit >= 0 ? '#22c55e' : '#ef4444' },
        ].map(card => (
          <div key={card.label} style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '6px', padding: '0.75rem', textAlign: 'center' }}>
            <div style={{ color: '#444', fontSize: '0.65rem', marginBottom: '0.25rem' }}>{card.label}</div>
            <div style={{ color: card.color, fontSize: '1.1rem', fontWeight: 'bold' }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Run list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {runs.map(run => (
          <div key={run.id} style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '6px', padding: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#fff', marginBottom: '0.25rem' }}>{run.subject || run.topic}</div>
                <div style={{ fontSize: '0.7rem', color: '#444' }}>{new Date(run.completedAt).toLocaleString()}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: run.profit >= 0 ? '#22c55e' : '#ef4444', fontSize: '0.875rem', fontWeight: 'bold' }}>
                  {run.profit >= 0 ? '+' : ''}{run.profit.toFixed(4)}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#444' }}>profit</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
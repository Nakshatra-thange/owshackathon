import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import RunHistory from '../RunHistory'
interface LogEntry { message: string; status?: string; timestamp: string }
interface PnL { earned: string; spent: string; profit: string; lastTx?: any }

export default function Dashboard() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [pnl, setPnl] = useState<PnL>({ earned: '0.0000', spent: '0.0000', profit: '0.0000' });
  const [running, setRunning] = useState(false);
  const [topic, setTopic] = useState('AI agents and technology');
  const logRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
  const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3002'
  useEffect(() => {
  
    const ws = new WebSocket(WS_URL)
    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.event === 'pnl_update') {
        setPnl({ earned: data.earned, spent: data.spent, profit: data.profit, lastTx: data.lastTx });
      }
      if (data.message) {
        setLogs(prev => [...prev, { message: data.message, status: data.status, timestamp: new Date().toLocaleTimeString() }]);
        setTimeout(() => logRef.current?.scrollTo(0, logRef.current.scrollHeight), 50);
      }
      if (data.event === 'agent_done' || data.event === 'agent_error') setRunning(false);
    };
    return () => ws.close();
  }, []);

  const runAgent = async () => {
    setRunning(true);
    setLogs([]);
    await fetch(`${API_URL}/api/run`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    });
  };

  const profit = parseFloat(pnl.profit);

  const cards = [
    { label: 'EARNED', value: `$${pnl.earned}`, colorClass: 'text-earn' },
    { label: 'SPENT', value: `$${pnl.spent}`, colorClass: 'text-spend' },
    { label: 'PROFIT', value: `$${pnl.profit}`, colorClass: profit >= 0 ? 'text-earn' : 'text-spend' },
  ];

  return (
    <div className="relative min-h-screen bg-background">
      <div className="stars" />
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-gold transition-colors duration-200 text-sm"
            >
              ← Home
            </button>
            <div className="w-px h-5 bg-border" />
            <h1 className="font-display text-2xl font-semibold text-foreground tracking-wide">Pressly</h1>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-card border border-border rounded-sm">
            <span className={`inline-block w-2 h-2 rounded-full ${running ? 'bg-earn animate-pulse' : 'bg-muted-foreground/40'}`} />
            <span className="text-xs text-muted-foreground tracking-wide uppercase">
              {running ? 'Agent Running' : 'Agent Idle'}
            </span>
          </div>
        </div>

        {/* P&L Cards */}
        <div className="grid grid-cols-3 gap-5 mb-10">
          {cards.map(card => (
            <div
              key={card.label}
              className="bg-card border border-border rounded-sm p-7 text-center
                         hover:border-gold transition-all duration-300 group"
            >
              <div className="text-[10px] font-semibold text-muted-foreground tracking-[0.25em] mb-3 group-hover:text-gold transition-colors duration-300">
                {card.label}
              </div>
              <div className={`text-3xl md:text-4xl font-bold font-mono ${card.colorClass}`}>
                {card.value}
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-3 mb-10">
          <input
            value={topic}
            onChange={e => setTopic(e.target.value)}
            className="flex-1 bg-card border border-border rounded-sm px-5 py-3.5 text-foreground text-sm
                       placeholder:text-muted-foreground/40 focus:outline-none focus:border-gold
                       transition-colors duration-200"
            placeholder="Newsletter topic..."
          />
          <button
            onClick={runAgent}
            disabled={running}
            className={`px-7 py-3.5 rounded-sm font-semibold text-sm tracking-wide transition-all duration-200
              ${running
                ? 'bg-secondary text-muted-foreground cursor-not-allowed'
                : 'bg-earn text-primary-foreground hover:brightness-110 cursor-pointer'
              }`}
          >
            {running ? 'Running...' : '▶ Run Agent'}
          </button>
          <button
            onClick={() => fetch(`${API_URL}/api/pause`, { method: 'POST' })}
            className="px-5 py-3.5 rounded-sm font-semibold text-sm bg-warning text-primary-foreground
                       hover:brightness-110 transition-all duration-200 cursor-pointer"
          >
            ⏸ Pause
          </button>
          <button
  onClick={() => fetch(`${API_URL}/api/resume`, { method: 'POST' })}
  className="px-5 py-3.5 rounded-sm font-semibold text-sm bg-warning text-primary-foreground
                       hover:brightness-110 transition-all duration-200 cursor-pointer"
>
  ▶ Resume
</button>
        </div>

       
        <div className="bg-card border border-border rounded-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <span className="text-[10px] font-semibold text-muted-foreground tracking-[0.25em] uppercase">Agent Log</span>
            <span className="text-[10px] text-muted-foreground/40">{logs.length} entries</span>
          </div>
          <div ref={logRef} className="h-80 overflow-y-auto px-6 py-4">
            {logs.length === 0 && (
              <div className="text-muted-foreground/30 font-mono text-sm py-8 text-center">
                Agent idle. Press Run to start.
              </div>
            )}
            {logs.map((log, i) => (
              <div key={i} className="font-mono text-sm py-2.5 border-b border-border/30 last:border-0 flex gap-4">
                <span className="text-muted-foreground/40 shrink-0 text-xs leading-6">{log.timestamp}</span>
                <span className="text-foreground/90">{log.message}</span>
              </div>
          ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-sm overflow-hidden mt-6">
          <div className="px-6 py-4 border-b border-border">
            <span className="text-[10px] font-semibold text-muted-foreground tracking-[0.25em] uppercase">Run History</span>
          </div>
          <div className="px-6 py-4">
            <RunHistory />
          </div>
        </div>
      </div>
    </div>
  );
}

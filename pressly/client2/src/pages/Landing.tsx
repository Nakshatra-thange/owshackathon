import { useNavigate } from 'react-router-dom';
import heroAgent from '@/assets/hero-agent.jpg';

import workflowVisual from '@/assets/workflow-visual.jpg';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <div className="stars" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 md:px-16 py-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-gold-strong flex items-center justify-center">
            <span className="text-gold font-display text-sm font-bold">P</span>
          </div>
          <span className="font-display text-lg text-foreground tracking-wide">Pressly</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#about" className="hover:text-gold transition-colors duration-200">About</a>
          <a href="#architecture" className="hover:text-gold transition-colors duration-200">Architecture</a>
          <a href="#workflow" className="hover:text-gold transition-colors duration-200">Workflow</a>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2 border border-gold rounded-sm text-gold text-sm hover:bg-gold hover:text-primary-foreground transition-all duration-200"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-8 md:px-16 pt-12 md:pt-20 pb-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-6 animate-float-up">
              Autonomous AI Agent
            </p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-[0.95] mb-6 animate-float-up-delay-1">
              PR<span className="text-gold">E</span>SSLY
            </h1>
            <div className="h-px bg-gold-strong animate-line-grow mb-8" style={{ maxWidth: '120px' }} />
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-lg mb-4 animate-float-up-delay-2">
              An autonomous AI agent that operates as a self-sustaining digital business.
              It independently executes an entire economic workflow—spending, creating, earning,
              and delivering—using a wallet-backed system.
            </p>
            <p className="text-muted-foreground/70 text-sm leading-relaxed max-w-lg mb-10 animate-float-up-delay-3">
              Not just content generation. <span className="text-gold-light italic font-display">Financial autonomy.</span>
            </p>
            <div className="flex gap-4 animate-float-up-delay-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-3.5 bg-gold text-primary-foreground font-semibold text-sm tracking-wide
                           hover:brightness-110 transition-all duration-200 rounded-sm"
              >
                Enter Dashboard
              </button>
              <a
                href="#about"
                className="px-8 py-3.5 border border-border text-muted-foreground font-medium text-sm
                           hover:border-gold hover:text-gold transition-all duration-200 rounded-sm"
              >
                Read More →
              </a>
            </div>
          </div>

          {/* Right — Hero image */}
          <div className="relative flex justify-center animate-fade-in-slow">
            <div className="relative">
              {/* Glow behind image */}
              <div className="absolute inset-0 rounded-full blur-3xl opacity-20"
                   style={{ background: 'radial-gradient(circle, hsl(40 60% 55% / 0.4), transparent 70%)' }} />
              <img
                src={heroAgent}
                alt="Pressly AI Agent"
                width={500}
                height={600}
                className="relative z-10 max-w-sm md:max-w-md lg:max-w-lg w-full rounded-sm"
              />
              {/* Decorative arc */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-px"
                   style={{ background: 'linear-gradient(90deg, transparent, hsl(40 60% 55% / 0.4), transparent)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16">
        <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, hsl(220 15% 14%), hsl(40 60% 55% / 0.3), hsl(220 15% 14%), transparent)' }} />
      </div>

      {/* Core Architecture Section */}
      <section id="about" className="relative z-10 px-8 md:px-16 py-24">
        <div className="max-w-7xl mx-auto">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">The Core</p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-16 leading-tight">
            Three Pillars of<br /><span className="text-gold italic">Autonomy</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                number: '01',
                title: 'AI Decision Layer',
                desc: 'An intelligent reasoning engine that evaluates, plans, and executes tasks with minimal human intervention. It drives every decision the agent makes.',
              },
              {
                number: '02',
                title: 'Modular Tool System',
                desc: 'A composable set of tools—data retrieval, content synthesis, email delivery—that the agent orchestrates to complete its business cycle.',
              },
              {
                number: '03',
                title: 'Wallet Infrastructure',
                desc: 'The financial backbone. Every transaction—costs and earnings—flows through a wallet abstraction, giving the agent true economic awareness.',
              },
            ].map((pillar) => (
              <div
                key={pillar.number}
                className="group bg-card border border-border rounded-sm p-8 hover:border-gold transition-all duration-300"
              >
                <span className="text-gold font-display text-2xl font-bold opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                  {pillar.number}
                </span>
                <h3 className="font-display text-xl text-foreground mt-4 mb-3">{pillar.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="architecture" className="relative z-10 px-8 md:px-16 py-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <img
              src={workflowVisual}
              alt="Pressly Workflow"
              loading="lazy"
              width={600}
              height={400}
              className="w-full rounded-sm glow-gold"
            />
          </div>
          <div>
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">The Workflow</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-8 leading-tight">
              A Complete<br /><span className="text-gold italic">Business Cycle</span>
            </h2>
            <div className="space-y-6">
              {[
                { step: 'Source', desc: 'Identifies and retrieves relevant information, simulating a paid data acquisition process.' },
                { step: 'Synthesize', desc: 'Processes raw data into a structured, publication-ready newsletter using a language model.' },
                { step: 'Monetize', desc: 'Charges subscribers for the finished product, generating revenue for the agent.' },
                { step: 'Deliver', desc: 'Distributes the newsletter to subscribers, completing the full business cycle.' },
              ].map((item, i) => (
                <div key={item.step} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full border border-gold flex items-center justify-center text-gold text-xs font-semibold shrink-0 group-hover:bg-gold group-hover:text-primary-foreground transition-all duration-200">
                      {i + 1}
                    </div>
                    {i < 3 && <div className="w-px h-full bg-border mt-1" />}
                  </div>
                  <div className="pb-2">
                    <h4 className="text-foreground font-medium mb-1">{item.step}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Financial Autonomy Section */}
      <section id="workflow" className="relative z-10 px-8 md:px-16 py-24">
        <div className="max-w-3xl mx-auto">
          <div>
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">What Sets It Apart</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6 leading-tight">
              Not the Newsletter.<br /><span className="text-gold italic">The Autonomy Behind It.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              What distinguishes Pressly is not the newsletter itself, but the financial autonomy behind it.
              The agent is designed to operate with economic awareness: it tracks spending, enforces limits,
              evaluates output quality, and completes tasks with minimal human intervention.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              The wallet abstraction enables this behavior by acting as the agent's financial backbone,
              allowing it to simulate or execute transactions as part of its workflow. Every transaction—both
              costs and earnings—is tracked in real time through a live profit-and-loss system.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3.5 border border-gold text-gold font-medium text-sm
                         hover:bg-gold hover:text-primary-foreground transition-all duration-200 rounded-sm"
            >
              View Live P&L →
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-8 md:px-16 py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
            Watch the Agent <span className="text-gold italic">Work</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Launch the dashboard to see Pressly source, create, monetize, and deliver—all autonomously, with every transaction tracked in real time.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-10 py-4 bg-gold text-primary-foreground font-semibold text-sm tracking-wide
                       hover:brightness-110 transition-all duration-200 rounded-sm"
          >
            Launch Agent Dashboard
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-8 md:px-16 py-8 border-t border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display text-sm text-gold">Pressly</span>
            <span className="text-muted-foreground/40 text-xs">© 2025</span>
          </div>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#about" className="hover:text-gold transition-colors duration-200">About</a>
            <a href="#architecture" className="hover:text-gold transition-colors duration-200">Architecture</a>
            <a href="#workflow" className="hover:text-gold transition-colors duration-200">Workflow</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

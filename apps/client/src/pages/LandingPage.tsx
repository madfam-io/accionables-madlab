import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  Sparkles,
  Brain,
  Clock,
  ArrowRight,
  CheckCircle2,
  Moon,
  Sun,
} from 'lucide-react';

export function LandingPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with email service (Resend, ConvertKit, etc.)
    console.log('Waitlist signup:', email);
    setSubmitted(true);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      theme === 'dark'
        ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100'
        : 'bg-gradient-to-b from-stone-50 via-white to-stone-100 text-slate-800'
    }`}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 p-3 rounded-full transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-slate-700/50 hover:bg-slate-700 text-amber-300'
            : 'bg-stone-200/50 hover:bg-stone-200 text-slate-600'
        }`}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Hero Section */}
      <header className="container mx-auto px-6 pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Brand */}
          <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full mb-8 ${
            theme === 'dark' ? 'bg-slate-800/50' : 'bg-stone-100'
          }`}>
            <Brain className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} size={24} />
            <span className="font-medium tracking-wide">MADLAB</span>
          </div>

          {/* Headline */}
          <h1 className={`text-4xl md:text-6xl font-light leading-tight mb-6 ${
            theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
          }`}>
            Project management that{' '}
            <span className={`font-medium ${
              theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
            }`}>
              gets your brain
            </span>
          </h1>

          {/* Subheadline */}
          <p className={`text-xl md:text-2xl font-light leading-relaxed mb-12 max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            An event convergence orchestrator designed for neurodivergent minds.
            Visual calm. AI assistance. Synchronized flow.
          </p>

          {/* Waitlist Form */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className={`flex flex-col sm:flex-row gap-3 p-2 rounded-2xl ${
                theme === 'dark' ? 'bg-slate-800/50' : 'bg-stone-100'
              }`}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className={`flex-1 px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-indigo-500 transition-all ${
                    theme === 'dark'
                      ? 'bg-slate-700/50 text-slate-100 placeholder-slate-500'
                      : 'bg-white text-slate-800 placeholder-slate-400'
                  }`}
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:gap-3"
                >
                  Join Waitlist
                  <ArrowRight size={18} />
                </button>
              </div>
              <p className={`text-sm mt-4 ${
                theme === 'dark' ? 'text-slate-500' : 'text-slate-500'
              }`}>
                No spam. Just updates when we launch.
              </p>
            </form>
          ) : (
            <div className={`max-w-md mx-auto p-6 rounded-2xl ${
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-stone-100'
            }`}>
              <CheckCircle2 className="mx-auto mb-4 text-emerald-500" size={48} />
              <p className="text-lg font-medium">You're on the list!</p>
              <p className={`text-sm mt-2 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                We'll reach out when MADLAB is ready for you.
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Value Props */}
      <section className={`py-20 ${
        theme === 'dark' ? 'bg-slate-800/30' : 'bg-stone-50'
      }`}>
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className={`text-2xl md:text-3xl font-light text-center mb-16 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Built different, for those who think different
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Visual Calm */}
              <ValueCard
                theme={theme}
                icon={<Moon size={28} />}
                title="Visual Calm"
                description="An interface that feels like an eyes and brain massage. Muted colors, generous spacing, no visual noise."
              />

              {/* AI Agents */}
              <ValueCard
                theme={theme}
                icon={<Sparkles size={28} />}
                title="AI That Helps"
                description="Agents that handle executive function gaps. Break down tasks, send reminders, draft communications."
              />

              {/* Event Convergence */}
              <ValueCard
                theme={theme}
                icon={<Calendar size={28} />}
                title="Event Convergence"
                description="Everything flows toward the moment. Not scattered tasks — synchronized movement toward your goal."
              />

              {/* Time Awareness */}
              <ValueCard
                theme={theme}
                icon={<Clock size={28} />}
                title="Time Blindness Aids"
                description="Visual countdowns, smart reminders, transition warnings. Time becomes visible and manageable."
              />

              {/* Multiplayer */}
              <ValueCard
                theme={theme}
                icon={<Users size={28} />}
                title="Multiplayer First"
                description="Collaborate without chaos. Shared events, personal views. Your interface adapts to your brain."
              />

              {/* ND Profiles */}
              <ValueCard
                theme={theme}
                icon={<Brain size={28} />}
                title="ND Profiles"
                description="ADHD, Autism, Dyslexia presets — or calibrate your own. The tool adapts to you, not the other way around."
              />
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className={`text-2xl md:text-3xl font-light mb-8 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
            }`}>
              You've tried everything
            </h2>
            <p className={`text-lg leading-relaxed mb-8 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Notion, Asana, Monday, Todoist — they all felt like work.
              Cluttered interfaces. Guilt-inducing red badges.
              Systems designed for brains that work differently than yours.
            </p>
            <p className={`text-xl font-light ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
            }`}>
              MADLAB is the first tool built{' '}
              <span className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}>
                with
              </span>{' '}
              your brain, not against it.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${
        theme === 'dark' ? 'bg-slate-800/30' : 'bg-stone-50'
      }`}>
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className={`text-3xl md:text-4xl font-light mb-6 ${
              theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
            }`}>
              Ready for calm?
            </h2>
            <p className={`text-lg mb-8 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Join the waitlist. Be first to experience MADLAB.
            </p>

            {!submitted && (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className={`flex flex-col sm:flex-row gap-3 p-2 rounded-2xl ${
                  theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'
                }`}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className={`flex-1 px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-indigo-500 transition-all ${
                      theme === 'dark'
                        ? 'bg-slate-700/50 text-slate-100 placeholder-slate-500'
                        : 'bg-stone-50 text-slate-800 placeholder-slate-400'
                    }`}
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Join Waitlist
                  </button>
                </div>
              </form>
            )}

            {/* Dashboard Preview Link */}
            <Link
              to="/app"
              className={`inline-flex items-center gap-2 mt-8 text-sm transition-colors ${
                theme === 'dark'
                  ? 'text-slate-500 hover:text-slate-300'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Preview the dashboard
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 border-t ${
        theme === 'dark' ? 'border-slate-800' : 'border-stone-200'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Brain size={20} className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} />
              <span className="font-medium">MADLAB</span>
            </div>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-slate-500' : 'text-slate-500'
            }`}>
              Built for neurodivergent minds. By neurodivergent minds.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface ValueCardProps {
  theme: 'light' | 'dark';
  icon: React.ReactNode;
  title: string;
  description: string;
}

function ValueCard({ theme, icon, title, description }: ValueCardProps) {
  return (
    <div className={`p-6 rounded-2xl transition-all duration-300 ${
      theme === 'dark'
        ? 'bg-slate-800/50 hover:bg-slate-800/70'
        : 'bg-white hover:shadow-lg'
    }`}>
      <div className={`mb-4 ${
        theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
      }`}>
        {icon}
      </div>
      <h3 className={`text-lg font-medium mb-2 ${
        theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
      }`}>
        {title}
      </h3>
      <p className={`text-sm leading-relaxed ${
        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
      }`}>
        {description}
      </p>
    </div>
  );
}

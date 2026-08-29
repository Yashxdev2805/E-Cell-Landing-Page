import { useState, useEffect } from 'react';
import { ArrowRight, Users, Flame, Calendar, Lightbulb, ExternalLink } from 'lucide-react';
import { crossAppBus } from '../utils/crossAppEvents';

interface HeroSectionProps {
  onJoinClick: () => void;
}

export function HeroSection({ onJoinClick }: HeroSectionProps) {
  const [attendeeCount, setAttendeeCount] = useState(250);

  useEffect(() => {
    const unsubscribe = crossAppBus.subscribe((event) => {
      if (event.type === 'REGISTRATION_SUCCESS') {
        setAttendeeCount((prev) => prev + 1);
      }
    });
    return unsubscribe;
  }, []);

  const scrollToEvents = () => {
    document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center justify-center pt-28 sm:pt-36 pb-16 overflow-hidden"
    >
      {/* Floating Geometric Badges */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[15%] left-[8%] w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/15 to-blue-600/5 border border-blue-500/10 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-[25%] right-[12%] w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/15 to-amber-600/5 border border-amber-500/10 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[20%] left-[15%] w-14 h-14 rounded-xl rotate-45 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/10 animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-[30%] right-[8%] w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/10 animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Live E-Summit 2026 Announcement Pill */}
        <a
          href="https://esummituietkuk.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-500/30 mb-8 hover:bg-amber-500/25 transition-all group animate-fade-in-up"
        >
          <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-xs sm:text-sm font-bold text-amber-300">
            E-SUMMIT 2026 | "IGNITING THE SHIFT" • 7–8 OCT 2026
          </span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
        </a>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading leading-tight tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <span className="text-white">Fostering </span>
          <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">Innovation</span>
          <br />
          <span className="text-white">Fueling </span>
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">Entrepreneurship</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          The Entrepreneurship Cell of UIET, Kurukshetra University — building the next generation
          of student founders through flagship summits, high-stakes competitions, and an empowered startup ecosystem.
        </p>

        {/* Quick Stats */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          {[
            { icon: Lightbulb, label: 'Startups Incubated', value: '50+', color: 'text-amber-400' },
            { icon: Users, label: 'Active Community', value: '500+', color: 'text-blue-400' },
            { icon: Calendar, label: 'E-Summit Events', value: '7 Tracks', color: 'text-emerald-400' },
            { icon: Flame, label: 'Live Registrations', value: `${attendeeCount}+`, color: 'text-purple-400' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-xs text-slate-500 uppercase font-mono">{stat.label}</span>
              <span className="text-sm font-bold text-white font-heading tabular-nums">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Action CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3.5 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <a
            href="https://esummituietkuk.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm sm:text-base py-3 px-6 shadow-xl"
          >
            <Flame className="w-4 h-4 text-amber-300" />
            <span>Register for E-Summit 2026</span>
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
          <button onClick={scrollToEvents} className="btn-secondary text-sm sm:text-base py-3 px-5">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Explore All 7 Events</span>
          </button>
          <button onClick={onJoinClick} className="btn-secondary text-sm sm:text-base py-3 px-5">
            <Users className="w-4 h-4 text-blue-400" />
            <span>Join Council</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-16 flex flex-col items-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Scroll to explore</span>
          <div className="w-5 h-8 rounded-full border-2 border-slate-600 flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-slate-400 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}

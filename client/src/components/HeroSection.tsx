import { useState, useEffect, memo } from 'react';
import {
  Flame,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { fetchPortalStats, type TelemetryData } from '../services/api';
import { syncBus } from '../utils/crossAppEvents';

interface HeroSectionProps {
  onJoinClick: () => void;
}

export const HeroSection = memo(function HeroSection({ onJoinClick }: HeroSectionProps) {
  const [stats, setStats] = useState<TelemetryData>({
    startupsRegistered: 150,
    totalApplicants: 540,
    workshopsHosted: 28,
    activeCommunity: 1200,
    lastUpdated: '',
  });

  useEffect(() => {
    // 1. Initial SWR fetch
    fetchPortalStats().then(setStats).catch(() => {});

    // 2. Refresh on real-time cross-tab sync events
    const unsubscribe = syncBus.subscribe((msg) => {
      if (msg.type === 'PITCH_REGISTRATION_COMMITTED' || msg.type === 'JOIN_APPLICATION_COMMITTED') {
        fetchPortalStats().then(setStats).catch(() => {});
      }
    });

    // 3. Periodic SWR polling every 30 seconds
    const interval = setInterval(() => {
      fetchPortalStats().then(setStats).catch(() => {});
    }, 30000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return (
    <section id="hero" className="relative pt-28 sm:pt-36 pb-20 overflow-hidden">
      {/* Ambient center glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[36rem] h-96 sm:h-[36rem] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Real E-Summit 2026 Announcement Capsule */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/25 text-xs font-semibold text-amber-300 mb-8 backdrop-blur-md shadow-lg">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <span className="font-bold text-amber-400">E-Summit 2026: “IGNITING THE SHIFT”</span>
          <span className="text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-300">
            {stats.startupsRegistered}+ Startups Registered
          </span>
          <a
            href="https://esummituietkuk.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-white flex items-center gap-0.5 ml-1"
          >
            Portal <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white font-heading tracking-tight max-w-5xl mx-auto leading-[1.1]">
          Igniting the Shift in <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300">
            Student Entrepreneurship
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          The official innovation catalyst at <strong>UIET, Kurukshetra University</strong>. Empowering student
          founders with seed funding, expert mentorship, hackathons, and venture incubators.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://esummituietkuk.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-600/20"
          >
            <Flame className="w-4 h-4 text-white" />
            <span>Register for E-Summit '26</span>
          </a>

          <button
            onClick={onJoinClick}
            className="btn-primary text-sm py-3.5 px-6"
          >
            <span>Join E-Cell Council</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Summit Stats Strip */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-extrabold text-white font-mono">{stats.startupsRegistered}+</p>
            <p className="text-xs text-slate-400 font-medium">Startups Registered</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-amber-300 font-mono">₹15L+</p>
            <p className="text-xs text-slate-400 font-medium">Prize Pool & Grants</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-blue-400 font-mono">{stats.workshopsHosted}+</p>
            <p className="text-xs text-slate-400 font-medium">Workshops & Events</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-emerald-400 font-mono">{stats.activeCommunity}+</p>
            <p className="text-xs text-slate-400 font-medium">Active Innovators</p>
          </div>
        </div>
      </div>
    </section>
  );
});

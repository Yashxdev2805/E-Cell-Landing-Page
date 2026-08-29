import { useState, useMemo } from 'react';
import {
  Calendar,
  MapPin,
  ArrowRight,
  Flame,
  Clock,
  Trophy,
  Code2,
  Phone,
  Filter,
  ExternalLink,
  LineChart,
  Lightbulb,
  Users2,
  GraduationCap,
} from 'lucide-react';
import { events, type EcellEvent } from '../data/events';

type CategoryFilter = 'all' | 'hackathon' | 'competition' | 'pitch' | 'networking' | 'workshop';

const CATEGORY_CONFIG: { key: CategoryFilter; label: string; icon: React.ElementType }[] = [
  { key: 'all', label: 'All Events (7)', icon: Filter },
  { key: 'hackathon', label: 'Hackathon', icon: Code2 },
  { key: 'competition', label: 'Simulations & Trading', icon: LineChart },
  { key: 'pitch', label: 'Pitch Competitions', icon: Lightbulb },
  { key: 'networking', label: 'Networking', icon: Users2 },
  { key: 'workshop', label: 'Workshops', icon: GraduationCap },
];

function getCountdown(dateStr: string): string {
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff <= 0) return 'Event Live';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return days > 0 ? `${days}d ${hours}h remaining` : `${hours}h remaining`;
}

function getCategoryBadge(cat: EcellEvent['category']): { text: string; bg: string; border: string; label: string } {
  switch (cat) {
    case 'flagship':
      return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/25', label: 'FLAGSHIP SUMMIT' };
    case 'hackathon':
      return { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/25', label: '36H HACKATHON' };
    case 'competition':
      return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', label: 'SIMULATION' };
    case 'pitch':
      return { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/25', label: 'PITCH STAGE' };
    case 'networking':
      return { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/25', label: 'NETWORKING' };
    case 'workshop':
      return { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/25', label: 'WORKSHOP' };
  }
}

function FlagshipCard({ event }: { event: EcellEvent }) {
  return (
    <div className="relative ecell-card overflow-hidden mb-10 bg-gradient-to-br from-[#0d111a] via-[#121927] to-[#1d1607] border border-amber-500/20 shadow-2xl">
      {/* Radiant glow orbs */}
      <div className="absolute -top-12 -right-12 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative p-6 sm:p-8 lg:p-10">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs font-extrabold text-amber-300">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            E-SUMMIT 2026 • REGISTRATIONS OPEN
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
            <Clock className="w-3.5 h-3.5" />
            {getCountdown(event.date)}
          </span>
        </div>

        {/* Title & Tagline */}
        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading tracking-tight mb-2">
          {event.title}
        </h3>
        <p className="text-amber-400 font-semibold text-sm sm:text-base font-mono mb-4">
          “IGNITING THE SHIFT” 🔥
        </p>

        <p className="text-slate-300 leading-relaxed max-w-3xl mb-6 text-sm sm:text-base">
          {event.description}
        </p>

        {/* Meta details */}
        <div className="flex flex-wrap items-center gap-5 text-sm text-slate-300 mb-8 bg-white/5 border border-white/10 rounded-xl p-4 w-fit">
          <span className="flex items-center gap-2 font-medium">
            <Calendar className="w-4 h-4 text-amber-400" />
            <strong className="text-white">{event.dateDisplay}</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-2 font-medium">
            <MapPin className="w-4 h-4 text-amber-400" />
            <strong className="text-white">{event.venue}</strong>
          </span>
        </div>

        {/* 7 Main Events Included */}
        <div className="mb-8">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            🎯 7 Core Competitions & Experiences:
          </p>
          <div className="flex flex-wrap gap-2.5">
            {event.highlights?.map((item) => (
              <span
                key={item}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-200 shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons & Coordinators Contact */}
        <div className="flex flex-wrap items-center justify-between gap-6 pt-4 border-t border-slate-800">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm sm:text-base py-3 px-6 shadow-xl"
            >
              <Flame className="w-4 h-4 text-amber-300" />
              <span>Register on Official Portal</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm py-3 px-5"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Step-by-Step Guide</span>
            </a>
          </div>

          {/* Coordinators Contact Box */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              Questions? Call:
            </span>
            {event.coordinators?.map((c) => (
              <a
                key={c.name}
                href={`tel:${c.phone.replace(/\s+/g, '')}`}
                className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-300 hover:bg-blue-500/20 hover:text-white transition-all flex items-center gap-1.5"
              >
                <span>{c.name}:</span>
                <span className="font-mono font-bold text-white">{c.phone}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: EcellEvent }) {
  const badge = getCategoryBadge(event.category);

  return (
    <div className="ecell-card p-6 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold uppercase tracking-wider ${badge.text} ${badge.bg} ${badge.border}`}
          >
            {badge.label}
          </span>
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-500" />
            {event.dateDisplay}
          </span>
        </div>

        <h4 className="text-lg font-bold text-white font-heading leading-snug group-hover:text-blue-300 transition-colors mb-2">
          {event.title}
        </h4>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">{event.description}</p>
      </div>

      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <span className="text-xs text-slate-400 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate">{event.venue}</span>
        </span>

        <a
          href={event.registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline shrink-0"
        >
          <span>Register</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

export function EventsSection() {
  const [filter, setFilter] = useState<CategoryFilter>('all');

  const flagshipEvent = events.find((e) => e.isFlagship);
  const subEvents = useMemo(
    () => events.filter((e) => !e.isFlagship && (filter === 'all' || e.category === filter)),
    [filter]
  );

  return (
    <section id="events" className="section-container content-auto">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400 mb-4">
          <Flame className="w-4 h-4 text-amber-400" />
          Official E-Cell Calendar
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading mt-2">
          E-Summit 2026 & Upcoming Events
        </h2>
        <p className="mt-4 text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          From the 36-Hour Hackathon and IPL Auction Simulation to The Golden Pitch and VC Networking
          — explore all official competitions and secure your spot today.
        </p>
      </div>

      {/* Flagship E-Summit 2026 Card */}
      {flagshipEvent && <FlagshipCard event={flagshipEvent} />}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {CATEGORY_CONFIG.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filter === key
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-md'
                : 'bg-white/5 text-slate-400 border border-white/8 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Grid of Sub-Events */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {subEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}

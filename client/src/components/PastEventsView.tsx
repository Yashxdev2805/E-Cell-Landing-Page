import { useState, useMemo, memo } from 'react';
import {
  ArrowLeft,
  Calendar,
  Search,
} from 'lucide-react';
import { pastEvents, type PastEvent } from '../data/pastEvents';

interface PastEventsViewProps {
  onBack: () => void;
}

const CATEGORY_BADGES: Record<PastEvent['category'], { label: string; color: string }> = {
  hackathon: { label: 'Hackathon', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25' },
  workshop: { label: 'Workshop', color: 'bg-rose-500/10 text-rose-400 border-rose-500/25' },
  competition: { label: 'Competition', color: 'bg-amber-500/10 text-amber-400 border-amber-500/25' },
  lecture: { label: 'Guest Lecture', color: 'bg-purple-500/10 text-purple-400 border-purple-500/25' },
  exhibition: { label: 'Exhibition', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' },
};

const YEARS = ['All', '2023', '2022', '2021', '2020', '2019'];

// ── O(1) Precomputed Inverted Index Data Structures ──
const yearIndexMap = new Map<string, PastEvent[]>();
const categoryIndexMap = new Map<string, PastEvent[]>();
const eventSearchCorpus = new Map<string, string>();

// Initialize O(1) inverted indices once at module load
YEARS.forEach((y) => yearIndexMap.set(y, []));
pastEvents.forEach((ev) => {
  if (!yearIndexMap.has(ev.year)) yearIndexMap.set(ev.year, []);
  yearIndexMap.get(ev.year)!.push(ev);
  yearIndexMap.get('All')!.push(ev);

  if (!categoryIndexMap.has(ev.category)) categoryIndexMap.set(ev.category, []);
  categoryIndexMap.get(ev.category)!.push(ev);

  const corpus = `${ev.name} ${ev.description}`.toLowerCase();
  eventSearchCorpus.set(ev.id, corpus);
});

export const PastEventsView = memo(function PastEventsView({ onBack }: PastEventsViewProps) {
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<PastEvent | null>(null);

  // ── O(K) Optimized Filtering utilizing pre-indexed sets ──
  const filteredEvents = useMemo(() => {
    const candidates = yearIndexMap.get(selectedYear) || pastEvents;
    const query = searchQuery.trim().toLowerCase();

    return candidates.filter((ev) => {
      if (selectedCategory !== 'all' && ev.category !== selectedCategory) {
        return false;
      }
      if (query) {
        const corpus = eventSearchCorpus.get(ev.id);
        if (!corpus || !corpus.includes(query)) return false;
      }
      return true;
    });
  }, [selectedYear, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Nav Bar */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all text-xs font-semibold cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Hub</span>
        </button>

        <span className="text-xs text-slate-400 font-mono">
          Showing <strong className="text-white">{filteredEvents.length}</strong> of {pastEvents.length} Events
        </span>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400 mb-4">
          <Calendar className="w-3.5 h-3.5" /> Official Event Archive
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading tracking-tight">
          Past Events & Milestones
        </h1>
        <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
          Explore the rich legacy of hackathons, startup bootcamps, IPR workshops, and investor pitch sessions
          hosted by E-Cell UIET, Kurukshetra University.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="ecell-card p-5 sm:p-6 mb-10 bg-[#0c1220]/90 border-slate-800 backdrop-blur-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search past events by name, topic..."
              className="ecell-input !pl-10 !py-2.5 text-xs sm:text-sm bg-[#12192c] border-slate-700"
            />
          </div>

          {/* Year Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {YEARS.map((y) => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  selectedYear === y
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {y}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="ecell-input !py-2.5 text-xs sm:text-sm bg-[#12192c] border-slate-700 cursor-pointer"
            >
              <option value="all">All Categories ({pastEvents.length})</option>
              <option value="hackathon">Hackathons</option>
              <option value="workshop">Workshops & Bootcamps</option>
              <option value="competition">Competitions & Shark Tanks</option>
              <option value="lecture">Guest Lectures & Keynotes</option>
              <option value="exhibition">Exhibitions & Demos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-16 ecell-card bg-[#0a0e18]">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No matching events found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            Try adjusting your search keywords or switching the year and category filters.
          </p>
          <button
            onClick={() => { setSelectedYear('All'); setSelectedCategory('all'); setSearchQuery(''); }}
            className="btn-primary text-xs py-2 px-4"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((ev) => {
            const badge = CATEGORY_BADGES[ev.category] || { label: ev.category, color: 'bg-blue-500/10 text-blue-400 border-blue-500/25' };
            return (
              <div
                key={ev.id}
                onClick={() => setSelectedEvent(ev)}
                className="ecell-card p-6 bg-[#0a0f1d] border-slate-800 hover:border-blue-500/40 cursor-pointer transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-xs text-slate-500 font-mono font-bold bg-white/5 px-2 py-0.5 rounded">
                      {ev.year}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white font-heading group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                    {ev.name}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {ev.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                  <span>{ev.date}</span>
                  <span className="text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Details →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up">
          <div className="ecell-card w-full max-w-xl p-6 sm:p-8 relative bg-[#0a0e1a] border border-slate-700 shadow-2xl">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                CATEGORY_BADGES[selectedEvent.category]?.color || 'bg-blue-500/10 text-blue-400'
              }`}>
                {CATEGORY_BADGES[selectedEvent.category]?.label || selectedEvent.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">Year {selectedEvent.year}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white font-heading mb-4">
              {selectedEvent.name}
            </h3>

            <div className="space-y-3 text-xs text-slate-300 mb-6 bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Date:</span>
                <span className="font-medium text-white">{selectedEvent.date}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              {selectedEvent.description}
            </p>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="btn-primary text-xs py-2 px-6"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

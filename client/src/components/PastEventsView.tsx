import { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Calendar,
  Search,
  ExternalLink,
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

export function PastEventsView({ onBack }: PastEventsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedModalEvent, setSelectedModalEvent] = useState<PastEvent | null>(null);

  const filteredEvents = useMemo(() => {
    return pastEvents.filter((event) => {
      const matchesSearch =
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.date.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesYear = selectedYear === 'All' || event.year === selectedYear;
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      return matchesSearch && matchesYear && matchesCategory;
    });
  }, [searchQuery, selectedYear, selectedCategory]);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in-up">
      {/* Top Breadcrumb & Back Navigation */}
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
              <option value="all">All Categories</option>
              <option value="hackathon">Hackathons (SIH, Kavach...)</option>
              <option value="workshop">Workshops (IPR, BMC...)</option>
              <option value="competition">Competitions & Quizzes</option>
              <option value="lecture">Guest Lectures & Alumni Talks</option>
              <option value="exhibition">Exhibitions & Demos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => {
          const badge = CATEGORY_BADGES[event.category];
          return (
            <div
              key={event.id}
              onClick={() => setSelectedModalEvent(event)}
              className="ecell-card overflow-hidden flex flex-col justify-between group cursor-pointer hover:border-blue-500/40 transition-all"
            >
              {event.image ? (
                <div className="h-44 w-full overflow-hidden bg-slate-900 relative">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d111a] via-transparent to-transparent" />
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${badge.color} backdrop-blur-md`}
                  >
                    {badge.label}
                  </span>
                </div>
              ) : (
                <div className="p-4 pb-0 flex items-center justify-between">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${badge.color}`}
                  >
                    {badge.label}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{event.year}</span>
                </div>
              )}

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{event.date || event.year}</span>
                </div>

                <h3 className="text-lg font-bold text-white font-heading leading-snug group-hover:text-blue-300 transition-colors mb-2">
                  {event.name}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3 mb-4">
                  {event.description}
                </p>

                <div className="mt-auto pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-400">
                  <span>View Details</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="ecell-card p-12 text-center my-8">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-base text-slate-300 font-semibold mb-1">No past events match your criteria</p>
          <p className="text-xs text-slate-500">Try changing the year filter or clearing search keywords.</p>
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up">
          <div className="ecell-card w-full max-w-lg p-6 sm:p-8 relative bg-[#0b101c] border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedModalEvent(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
            >
              ✕
            </button>

            {selectedModalEvent.image && (
              <img
                src={selectedModalEvent.image}
                alt={selectedModalEvent.name}
                className="w-full h-52 object-cover rounded-xl mb-4 border border-slate-800"
              />
            )}

            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${
                  CATEGORY_BADGES[selectedModalEvent.category].color
                }`}
              >
                {CATEGORY_BADGES[selectedModalEvent.category].label}
              </span>
              <span className="text-xs text-slate-400 font-mono">{selectedModalEvent.date}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white font-heading mb-3">
              {selectedModalEvent.name}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {selectedModalEvent.description}
            </p>

            <button
              onClick={() => setSelectedModalEvent(null)}
              className="btn-primary w-full text-xs py-2.5 justify-center"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

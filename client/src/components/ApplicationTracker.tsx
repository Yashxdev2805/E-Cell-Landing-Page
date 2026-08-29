import { useState, useEffect, type FormEvent } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Shield,
  Radio,
} from 'lucide-react';
import { trackApplication, type MaskedTrackingData } from '../services/api';
import { syncBus } from '../utils/crossAppEvents';

const DEMO_PRESETS = [
  { id: 'EC-2026-AIML-101', label: 'Council: AIML (Shortlisted)' },
  { id: 'EC-2026-CSE-402', label: 'Council: CSE (Under Review)' },
  { id: 'EC26-A8K2M', label: 'Pitch Arena: Nexora AI' },
];

export function ApplicationTracker() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<MaskedTrackingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [livePill, setLivePill] = useState<string | null>(null);

  // Subscribe to real-time sync across open tabs and Project 1
  useEffect(() => {
    const unsubscribe = syncBus.subscribe((msg) => {
      if (msg.refId) {
        setQuery(msg.refId);
        setLivePill(`New registration detected: ${msg.refId}`);
        setTimeout(() => setLivePill(null), 5000);
        executeSearch(msg.refId);
      }
    });
    return unsubscribe;
  }, []);

  const executeSearch = async (refIdToSearch: string) => {
    const clean = refIdToSearch.trim().toUpperCase();
    if (!clean) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const data = await trackApplication(clean);
      setResult(data);
    } catch (err: any) {
      setResult(null);
      setError(err?.message || 'No application or pitch team found matching this code.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e?: FormEvent) => {
    if (e) e.preventDefault();
    executeSearch(query);
  };

  return (
    <section id="tracker" className="section-container content-auto">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 mb-4">
          <Shield className="w-3.5 h-3.5" /> Unified Status Tracker
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading mt-2">
          Track Your Application
        </h2>
        <p className="mt-4 text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Lookup status for both <strong>Council Recruitment (EC-2026-...)</strong> and{' '}
          <strong>Startup Pitch Arena (EC26-...)</strong> submissions.
        </p>
      </div>

      {/* Live sync banner */}
      {livePill && (
        <div className="max-w-xl mx-auto mb-4 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-between animate-fade-in-up">
          <span className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            {livePill}
          </span>
          <span className="text-[10px] font-mono text-amber-400/80">LIVE SYNC</span>
        </div>
      )}

      {/* Search Input Box */}
      <div className="max-w-2xl mx-auto mb-6">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            placeholder="Enter Ref Code (e.g. EC-2026-AIML-101 or EC26-A8K2M)"
            className="ecell-input w-full !py-3.5 !pl-5 !pr-16 text-sm font-mono tracking-wider bg-[#0c1220] border-slate-700 shadow-xl"
          />

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md"
            aria-label="Search Application Status"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </button>
        </form>

        {/* Preset quick test tags */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="text-[11px] text-slate-500">Quick Test Codes:</span>
          {DEMO_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setQuery(p.id);
                executeSearch(p.id);
              }}
              className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-mono border border-white/10 transition-colors cursor-pointer"
            >
              {p.id}
            </button>
          ))}
        </div>
      </div>

      {/* Result Card */}
      {searched && (
        <div className="max-w-2xl mx-auto animate-fade-in-up">
          {error && (
            <div className="ecell-card p-6 bg-red-950/20 border-red-500/30 text-center">
              <p className="text-sm text-red-300 font-semibold mb-1">{error}</p>
              <p className="text-xs text-slate-400">
                Please double-check your reference number or check your confirmation email.
              </p>
            </div>
          )}

          {result && (
            <div className="ecell-card p-6 sm:p-8 bg-[#0a0f1d] border-blue-500/30 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                    {result.sourceType === 'PITCH_ARENA' ? 'Startup Pitch Docket' : 'Council Recruitment'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-heading mt-0.5">
                    {result.titleOrTeam}
                  </h3>
                  <p className="text-xs text-amber-400 font-mono mt-0.5">{result.categoryOrDomain}</p>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      result.status === 'SHORTLISTED' || result.status === 'ACCEPTED'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : result.status === 'UNDER_REVIEW'
                        ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    {result.status.replace('_', ' ')}
                  </span>
                  <p className="text-[11px] text-slate-500 font-mono mt-1">Ref: {result.refId}</p>
                </div>
              </div>

              {/* Status Stepper Timeline */}
              <div className="mt-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Review Milestones
                </p>
                <div className="space-y-4">
                  {result.timeline.map((t, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                          t.completed
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-white/5 text-slate-500 border border-white/10'
                        }`}
                      >
                        {t.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <div className="flex-1 flex items-center justify-between">
                        <p
                          className={`text-xs sm:text-sm font-semibold ${
                            t.completed ? 'text-white' : 'text-slate-500'
                          }`}
                        >
                          {t.step}
                        </p>
                        {t.timestamp && (
                          <span className="text-[11px] text-slate-500 font-mono">{t.timestamp}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

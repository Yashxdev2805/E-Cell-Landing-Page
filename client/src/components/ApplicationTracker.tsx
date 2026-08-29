import { useState, useRef, useCallback, useEffect } from 'react';
import { Search, CheckCircle2, Clock, FileSearch, AlertCircle, Loader2, Zap } from 'lucide-react';
import { crossAppBus } from '../utils/crossAppEvents';

interface TrackerResult {
  refId: string;
  maskedTeam: string;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'pitch_allocated';
  submittedAt: string;
}

const TIMELINE_STEPS = [
  { key: 'submitted', label: 'Submitted', icon: CheckCircle2 },
  { key: 'under_review', label: 'Under Review', icon: Clock },
  { key: 'shortlisted', label: 'Shortlisted', icon: FileSearch },
  { key: 'pitch_allocated', label: 'Pitch Slot Allocated', icon: CheckCircle2 },
] as const;

const MOCK_RESULTS: Record<string, TrackerResult> = {
  'EC26-A8K2M': { refId: 'EC26-A8K2M', maskedTeam: 'Team: Alph***', status: 'shortlisted', submittedAt: '2026-08-15T10:30:00Z' },
  'EC26-B3P7N': { refId: 'EC26-B3P7N', maskedTeam: 'Team: Nova***', status: 'under_review', submittedAt: '2026-08-20T14:15:00Z' },
  'EC26-C9R1Q': { refId: 'EC26-C9R1Q', maskedTeam: 'Team: Zenith***', status: 'submitted', submittedAt: '2026-08-25T09:00:00Z' },
};

function getStepIndex(status: TrackerResult['status']): number {
  return TIMELINE_STEPS.findIndex((s) => s.key === status);
}

export function ApplicationTracker() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<TrackerResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [crossTabNotice, setCrossTabNotice] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const performLookup = useCallback((searchId: string) => {
    const trimmed = searchId.trim().toUpperCase();
    if (!trimmed) return;

    setLoading(true);
    setTimeout(() => {
      const found = MOCK_RESULTS[trimmed];
      if (found) {
        setResult(found);
        setNotFound(false);
      } else {
        // Optimistic handling for newly generated refIds from Project 1
        if (trimmed.startsWith('EC26-')) {
          setResult({
            refId: trimmed,
            maskedTeam: 'Your Registered Startup Team',
            status: 'submitted',
            submittedAt: new Date().toISOString(),
          });
          setNotFound(false);
        } else {
          setResult(null);
          setNotFound(true);
        }
      }
      setLoading(false);
    }, 350);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    setNotFound(false);
    setResult(null);
    setCrossTabNotice(null);
    clearTimeout(debounceRef.current);
    if (!value.trim()) return;

    debounceRef.current = setTimeout(() => {
      performLookup(value);
    }, 300);
  }, [performLookup]);

  // Listen for registration events from Project 1 via BroadcastChannel
  useEffect(() => {
    const unsubscribe = crossAppBus.subscribe((event) => {
      if (event.type === 'REGISTRATION_SUCCESS' && event.refId) {
        setQuery(event.refId);
        setCrossTabNotice(`⚡ Auto-detected registration for "${event.teamName || 'Startup'}"!`);
        performLookup(event.refId);
      }
    });

    return unsubscribe;
  }, [performLookup]);

  const activeStepIndex = result ? getStepIndex(result.status) : -1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearTimeout(debounceRef.current);
    performLookup(query);
  };

  return (
    <section id="tracker" className="section-container content-auto">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-4">
          <FileSearch className="w-3.5 h-3.5" /> Track Your Application
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading mt-3">
          Application Status Tracker
        </h2>
        <p className="mt-4 text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Enter your Reference ID (e.g., <span className="font-mono text-blue-300">EC26-A8K2M</span>) to check the status of your Pitch Arena registration or E-Cell application.
        </p>
      </div>

      {crossTabNotice && (
        <div className="max-w-lg mx-auto mb-4 px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center gap-2 text-xs font-semibold text-blue-300 animate-fade-in-up">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>{crossTabNotice}</span>
        </div>
      )}

      {/* Search Input Box with Right-Aligned Search Button */}
      <div className="max-w-lg mx-auto mb-10">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Enter Reference ID (EC26-XXXXX)"
            className="ecell-input !pl-5 !pr-14 !py-4 text-sm sm:text-base font-mono rounded-xl bg-[#0f1422] border-slate-700/80 focus:border-blue-500 shadow-inner text-white placeholder:text-slate-500"
            aria-label="Application Reference ID"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
            aria-label="Search Reference ID"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : (
              <Search className="w-4 h-4 text-white" />
            )}
          </button>
        </form>
      </div>

      {/* Results Container */}
      <div aria-live="polite" aria-busy={loading} className="max-w-2xl mx-auto">
        {result && (
          <div className="ecell-card p-6 sm:p-8 animate-fade-in-up">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-1">Reference ID</p>
                <p className="text-lg font-bold text-white font-mono">{result.refId}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-1">Team</p>
                <p className="text-sm font-semibold text-slate-300">{result.maskedTeam}</p>
              </div>
            </div>

            <div className="space-y-0">
              {TIMELINE_STEPS.map((step, idx) => {
                const isCompleted = idx <= activeStepIndex;
                const isCurrent = idx === activeStepIndex;
                const StepIcon = step.icon;
                return (
                  <div key={step.key} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          isCurrent
                            ? 'bg-blue-500/20 border-2 border-blue-400 animate-pulse-glow'
                            : isCompleted
                            ? 'bg-emerald-500/15 border-2 border-emerald-500'
                            : 'bg-slate-800 border-2 border-slate-700'
                        }`}
                      >
                        <StepIcon
                          className={`w-4 h-4 ${isCurrent ? 'text-blue-400' : isCompleted ? 'text-emerald-400' : 'text-slate-600'}`}
                        />
                      </div>
                      {idx < TIMELINE_STEPS.length - 1 && (
                        <div
                          className={`w-0.5 h-10 ${isCompleted && idx < activeStepIndex ? 'bg-emerald-500/40' : 'bg-slate-800'}`}
                        />
                      )}
                    </div>
                    <div className="pt-1">
                      <p
                        className={`text-sm font-semibold ${
                          isCurrent ? 'text-blue-400' : isCompleted ? 'text-emerald-400' : 'text-slate-600'
                        }`}
                      >
                        {step.label}
                      </p>
                      {isCurrent && <p className="text-xs text-slate-500 mt-0.5">Current status</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {notFound && !loading && (
          <div className="ecell-card p-8 text-center animate-fade-in-up">
            <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">
              No application found for "<span className="font-mono text-white">{query}</span>". Please verify your Reference ID and try again.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

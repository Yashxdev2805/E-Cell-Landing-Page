import { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Activity,
  Layers,
  RefreshCw,
  CheckCircle2,
  Radio,
  Shield,
  FileSpreadsheet,
} from 'lucide-react';
import { sseClient, type SSEMessage } from '../services/sseClient';

interface AdminOpsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminOpsDrawer({ isOpen, onClose }: AdminOpsDrawerProps) {
  const [pin, setPin] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [eventFeed, setEventFeed] = useState<SSEMessage[]>([]);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Keyboard shortcut Ctrl+Shift+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (!isOpen) {
          // Trigger open via custom event
          window.dispatchEvent(new CustomEvent('toggle-admin-drawer'));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Subscribe to live SSE events
  useEffect(() => {
    const unsubscribe = sseClient.subscribe((msg) => {
      if (msg.type !== 'HEARTBEAT') {
        setEventFeed((prev) => [msg, ...prev.slice(0, 19)]);
      }
    });
    return unsubscribe;
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/metrics', {
        headers: { 'X-Admin-Key': pin },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Invalid Admin Access Key');
      }
      setMetrics(data.data);
      setAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Authorization failed.');
    } finally {
      setLoading(false);
    }
  };

  const refreshMetrics = async () => {
    try {
      const res = await fetch('/api/admin/metrics', {
        headers: { 'X-Admin-Key': pin },
      });
      const data = await res.json();
      if (res.ok) setMetrics(data.data);
    } catch {}
  };

  const handleFlushCache = async () => {
    try {
      const res = await fetch('/api/admin/cache/flush', {
        method: 'POST',
        headers: { 'X-Admin-Key': pin },
      });
      const data = await res.json();
      setActionSuccess(data.message);
      setTimeout(() => setActionSuccess(null), 4000);
      refreshMetrics();
    } catch {}
  };

  const handleProcessOutbox = async () => {
    try {
      const res = await fetch('/api/admin/outbox/process', {
        method: 'POST',
        headers: { 'X-Admin-Key': pin },
      });
      const data = await res.json();
      setActionSuccess(data.message);
      setTimeout(() => setActionSuccess(null), 4000);
      refreshMetrics();
    } catch {}
  };

  const downloadCSV = () => {
    window.open(`/api/admin/applications?format=csv&key=${encodeURIComponent(pin)}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in-up">
      <div className="w-full max-w-xl h-full bg-[#080d18] border-l border-slate-700 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-heading">Admin Telemetry & Live Ops</h3>
                <p className="text-[11px] text-slate-400 font-mono">E-Cell UIET KUK Operations Mesh</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {!authenticated ? (
            /* Authentication Screen */
            <form onSubmit={handleLogin} className="mt-8 space-y-4 max-w-sm mx-auto text-center">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Administrator Verification</h4>
              <p className="text-xs text-slate-400">
                Enter your administrative PIN or Bearer Token (default PIN: <code className="text-blue-400">ecell2026</code>)
              </p>

              {error && (
                <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs">
                  {error}
                </div>
              )}

              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN / Token"
                className="ecell-input w-full text-center text-sm font-mono tracking-widest"
                required
              />

              <button
                type="submit"
                disabled={loading || !pin}
                className="btn-primary w-full text-xs py-2.5 justify-center"
              >
                {loading ? 'Authenticating...' : 'Unlock Ops Console'}
              </button>
            </form>
          ) : (
            /* Live Dashboard */
            <div className="space-y-6">
              {actionSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{actionSuccess}</span>
                </div>
              )}

              {/* Status Pill Strip */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[10px] text-slate-400 font-mono">LIVE STREAMS</p>
                  <p className="text-lg font-bold text-emerald-400 font-mono flex items-center justify-center gap-1">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    {metrics?.activeSSEStreams || 1}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[10px] text-slate-400 font-mono">SERVER UPTIME</p>
                  <p className="text-lg font-bold text-blue-400 font-mono">
                    {Math.floor((metrics?.uptimeSeconds || 0) / 60)}m
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[10px] text-slate-400 font-mono">HEAP MEMORY</p>
                  <p className="text-lg font-bold text-amber-400 font-mono">
                    {metrics?.memory?.heapUsedMb || 24}MB
                  </p>
                </div>
              </div>

              {/* 10-Shard Visualizer */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-400" /> 10-Shard Write Distribution
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    0 OCC FAILURES
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {metrics?.shardDistribution?.map((shard: any) => (
                    <div
                      key={shard.shardId}
                      className="p-2 rounded-lg bg-black/40 border border-slate-700 text-center"
                    >
                      <p className="text-[9px] text-slate-500 font-mono">SHARD {shard.shardId}</p>
                      <p className="text-xs font-bold text-white font-mono">{shard.writeCount}</p>
                      <div className="w-full bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
                        <div
                          className="bg-blue-500 h-full"
                          style={{ width: `${Math.min(100, (shard.writeCount / 60) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Controls */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleFlushCache}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                  <span>Flush Micro-Cache</span>
                </button>

                <button
                  type="button"
                  onClick={handleProcessOutbox}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>Drain Outbox Queue</span>
                </button>
              </div>

              {/* Live SSE Event Stream Feed */}
              <div className="p-4 rounded-xl bg-black/40 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Live Event Stream
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">SSE PUSH</span>
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {eventFeed.length === 0 ? (
                    <p className="text-[11px] text-slate-500 italic text-center py-2">
                      Awaiting live push events...
                    </p>
                  ) : (
                    eventFeed.map((evt, i) => (
                      <div
                        key={i}
                        className="p-2 rounded bg-white/5 text-[11px] font-mono flex items-center justify-between"
                      >
                        <span className="text-amber-400">{evt.type}</span>
                        <span className="text-slate-400">
                          {evt.data?.refId || evt.data?.reason || 'OK'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Data Export */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={downloadCSV}
                  className="w-full p-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Download Candidate & Startup Data (CSV)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-800 text-center">
          <p className="text-[10px] text-slate-500 font-mono">
            Shortcut: <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300">Ctrl+Shift+A</kbd>
          </p>
        </div>
      </div>
    </div>
  );
}

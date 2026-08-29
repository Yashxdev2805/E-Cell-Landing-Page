export type CrossAppEventType =
  | 'PITCH_REGISTRATION_COMMITTED'
  | 'JOIN_APPLICATION_COMMITTED'
  | 'TELEMETRY_REFRESH_REQUESTED';

export interface CrossAppMessage {
  type: CrossAppEventType;
  refId?: string;
  trackOrDomain?: string;
  timestamp: string;
  source: 'PORTAL_HUB' | 'PITCH_ARENA';
}

type SyncCallback = (msg: CrossAppMessage) => void;

class HybridSyncBus {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<SyncCallback> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('ecell_hub_sync');
        this.channel.onmessage = (e) => this.dispatch(e.data);
      } catch (err) {
        console.warn('⚠️ [SyncBus] BroadcastChannel error:', err);
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('message', (e) => {
        // Whitelist allowed origins
        const allowedOrigins = [
          'http://localhost:5173',
          'http://127.0.0.1:5173',
          'http://localhost:5174',
          'http://127.0.0.1:5174',
        ];
        if (allowedOrigins.includes(e.origin) && e.data?.source && e.data?.type) {
          this.dispatch(e.data);
        }
      });
    }
  }

  public subscribe(callback: SyncCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  public broadcast(type: CrossAppEventType, payload: { refId?: string; trackOrDomain?: string } = {}): void {
    const msg: CrossAppMessage = {
      type,
      refId: payload.refId,
      trackOrDomain: payload.trackOrDomain,
      timestamp: new Date().toISOString(),
      source: 'PORTAL_HUB',
    };

    // 1. BroadcastChannel (Same-Origin)
    if (this.channel) {
      try {
        this.channel.postMessage(msg);
      } catch {}
    }

    // 2. window.postMessage (Cross-Port Development Fallback)
    if (typeof window !== 'undefined') {
      const targetOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'];
      targetOrigins.forEach((origin) => {
        try {
          window.postMessage(msg, origin);
        } catch {}
      });
    }

    // 3. Local Dispatch for same tab
    this.dispatch(msg);
  }

  private dispatch(msg: CrossAppMessage): void {
    this.listeners.forEach((cb) => {
      try {
        cb(msg);
      } catch (err) {
        console.error('❌ [SyncBus] Listener error:', err);
      }
    });
  }
}

export const syncBus = new HybridSyncBus();

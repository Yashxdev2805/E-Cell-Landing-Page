export type SSEEventType =
  | 'CONNECTED'
  | 'HEARTBEAT'
  | 'TELEMETRY_UPDATED'
  | 'NEW_REGISTRATION'
  | 'OUTBOX_PROCESSED';

export interface SSEMessage {
  type: SSEEventType;
  data: any;
  timestamp: string;
}

type SSEListener = (msg: SSEMessage) => void;

class VisibilityAwareSSEClient {
  private eventSource: EventSource | null = null;
  private listeners: Set<SSEListener> = new Set();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private isExplicitlyClosed = false;
  private activeConnections = 1;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();

      // Conserve HTTP/1.1 TCP sockets when tab is backgrounded
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.reconnect();
        } else {
          this.disconnect();
        }
      });
    }
  }

  public subscribe(listener: SSEListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getActiveConnections(): number {
    return this.activeConnections;
  }

  private init(): void {
    if (typeof window === 'undefined' || !('EventSource' in window)) return;
    this.isExplicitlyClosed = false;

    try {
      this.eventSource = new EventSource('/api/portal/events/stream');

      this.eventSource.onmessage = (e) => {
        try {
          const parsed = JSON.parse(e.data);
          if (parsed.activeConnections) this.activeConnections = parsed.activeConnections;
          this.notify({ type: 'CONNECTED', data: parsed, timestamp: new Date().toISOString() });
        } catch {}
      };

      const eventTypes: SSEEventType[] = [
        'CONNECTED',
        'HEARTBEAT',
        'TELEMETRY_UPDATED',
        'NEW_REGISTRATION',
        'OUTBOX_PROCESSED',
      ];

      eventTypes.forEach((type) => {
        this.eventSource?.addEventListener(type, (e: any) => {
          try {
            const parsed = JSON.parse(e.data);
            if (type === 'HEARTBEAT' && parsed.data?.activeConnections) {
              this.activeConnections = parsed.data.activeConnections;
            }
            this.notify(parsed);
          } catch {}
        });
      });

      this.eventSource.onerror = () => {
        this.disconnect();
        if (!this.isExplicitlyClosed) {
          this.reconnectTimer = setTimeout(() => this.init(), 5000);
        }
      };
    } catch (err) {
      console.warn('⚠️ [SSEClient] Connection init error:', err);
    }
  }

  private disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private reconnect(): void {
    this.disconnect();
    this.init();
  }

  private notify(msg: SSEMessage): void {
    this.listeners.forEach((l) => {
      try {
        l(msg);
      } catch {}
    });
  }
}

export const sseClient = new VisibilityAwareSSEClient();

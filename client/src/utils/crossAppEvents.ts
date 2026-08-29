/**
 * Cross-App BroadcastChannel & LocalStorage Event Bus
 * Connects Project 1 (Pitch Arena) & Project 2 (E-Cell Portal Hub) across tabs & origins.
 */

export interface RegistrationSuccessEvent {
  type: 'REGISTRATION_SUCCESS';
  refId: string;
  teamName: string;
  track?: string;
  timestamp?: number;
}

export type CrossAppEvent = RegistrationSuccessEvent;

const CHANNEL_NAME = 'ecell_portal_sync';
const STORAGE_KEY = 'ecell_last_sync_event';

class CrossAppSyncBus {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<(event: CrossAppEvent) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (msg) => {
          if (msg.data && msg.data.type) {
            this.notify(msg.data as CrossAppEvent);
          }
        };
      } catch {
        // Fallback to storage listener if BroadcastChannel blocked
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            this.notify(parsed);
          } catch {
            // ignore malformed
          }
        }
      });
    }
  }

  public subscribe(callback: (event: CrossAppEvent) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  public publish(event: CrossAppEvent): void {
    if (this.channel) {
      try {
        this.channel.postMessage(event);
      } catch {
        // fallback
      }
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...event, timestamp: Date.now() }));
      } catch {
        // localStorage full or disabled
      }
    }

    this.notify(event);
  }

  private notify(event: CrossAppEvent): void {
    this.listeners.forEach((cb) => {
      try {
        cb(event);
      } catch (err) {
        console.error('CrossApp event error', err);
      }
    });
  }
}

export const crossAppBus = new CrossAppSyncBus();

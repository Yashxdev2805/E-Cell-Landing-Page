import type { Response } from 'express';
import { EventEmitter } from 'events';

export interface StreamEvent {
  type: 'TELEMETRY_UPDATED' | 'NEW_REGISTRATION' | 'OUTBOX_PROCESSED' | 'HEARTBEAT';
  data: any;
  timestamp: string;
}

class DistributedSSEHub {
  private clients: Set<Response> = new Set();
  private localBus = new EventEmitter();
  private heartbeatTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.localBus.on('broadcast', (event: StreamEvent) => {
      this.broadcastLocally(event);
    });

    // Start 15s keepalive heartbeat ping
    this.heartbeatTimer = setInterval(() => {
      this.broadcastLocally({
        type: 'HEARTBEAT',
        data: { activeConnections: this.clients.size },
        timestamp: new Date().toISOString(),
      });
    }, 15000);
  }

  public registerClient(res: Response): () => void {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable Nginx buffering

    // Send initial handshake
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', activeConnections: this.clients.size + 1 })}\n\n`);

    this.clients.add(res);

    return () => {
      this.clients.delete(res);
    };
  }

  public emitEvent(type: StreamEvent['type'], data: any): void {
    const event: StreamEvent = {
      type,
      data,
      timestamp: new Date().toISOString(),
    };

    // If Redis is configured in production, publish to Redis channel
    if (process.env.REDIS_URL) {
      // Redis publishing logic hooks in production
    }

    this.localBus.emit('broadcast', event);
  }

  private broadcastLocally(event: StreamEvent): void {
    const payload = `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`;
    this.clients.forEach((client) => {
      try {
        client.write(payload);
      } catch {
        this.clients.delete(client);
      }
    });
  }

  public getActiveCount(): number {
    return this.clients.size;
  }
}

export const sseHub = new DistributedSSEHub();

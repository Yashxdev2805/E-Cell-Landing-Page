import { db } from './firebase.js';

export class OutboxWorker {
  private static isRunning = false;
  private static timer: NodeJS.Timeout | null = null;

  static start(pollIntervalMs = 5000): void {
    if (this.timer) return;
    console.log(`🚀 [OutboxWorker] Started atomic polling every ${pollIntervalMs}ms`);
    this.timer = setInterval(() => this.processBatch(), pollIntervalMs);
  }

  static stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      console.log('🛑 [OutboxWorker] Stopped');
    }
  }

  /**
   * Atomically claims and processes pending outbox events using transaction lease.
   */
  static async processBatch(): Promise<number> {
    if (this.isRunning || !db) return 0;
    this.isRunning = true;

    let processedCount = 0;

    try {
      const now = Date.now();
      const pendingSnap = await db
        .collection('outbox')
        .where('status', 'in', ['PENDING', 'PROCESSING'])
        .limit(10)
        .get();

      for (const doc of pendingSnap.docs) {
        const eventId = doc.id;
        const eventRef = db.collection('outbox').doc(eventId);

        // Atomic Lease Acquisition Step
        let shouldProcess = false;
        let eventData: any = null;

        await db.runTransaction(async (tx) => {
          const snap = await tx.get(eventRef);
          if (!snap.exists) return;
          const data = snap.data()!;

          // Check if pending or expired lease
          const isPending = data.status === 'PENDING';
          const isExpiredLease = data.status === 'PROCESSING' && (!data.lockedUntil || data.lockedUntil < now);

          if (isPending || isExpiredLease) {
            shouldProcess = true;
            eventData = data;
            tx.update(eventRef, {
              status: 'PROCESSING',
              lockedUntil: now + 30_000, // 30-second lease
              attempts: (data.attempts || 0) + 1,
            });
          }
        });

        if (shouldProcess && eventData) {
          try {
            await this.dispatch(eventData);

            await eventRef.update({
              status: 'COMPLETED',
              processedAt: new Date().toISOString(),
            });
            processedCount++;
          } catch (dispatchErr: any) {
            console.error(`❌ [OutboxWorker] Dispatch failed for event ${eventId}:`, dispatchErr?.message);
            const attempts = (eventData.attempts || 0) + 1;
            await eventRef.update({
              status: attempts >= 5 ? 'DEAD_LETTER' : 'PENDING',
              lastError: dispatchErr?.message || String(dispatchErr),
              lockedUntil: 0,
            });
          }
        }
      }
    } catch (err: any) {
      console.warn('⚠️ [OutboxWorker] Batch iteration warning:', err?.message || err);
    } finally {
      this.isRunning = false;
    }

    return processedCount;
  }

  private static async dispatch(event: any): Promise<void> {
    const { type, payload } = event;
    console.log(`📨 [OutboxWorker] Processing ${type} event for Ref: ${payload.refId || payload.id}`);

    // 1. Simulated Brevo Transactional Email Engine
    if (type === 'COUNCIL_JOIN_SUBMITTED') {
      console.log(`📧 [BrevoEmail] Dispatched recruitment confirmation to '${payload.email}' with Ref: ${payload.refId}`);
      console.log(`📊 [GoogleSheets] Appended candidate '${payload.fullName}' (${payload.rollNo}) to 'Recruitment 2026' tab`);
    } else if (type === 'CONTACT_INQUIRY_SUBMITTED') {
      console.log(`📧 [BrevoEmail] Dispatched coordinator alert for '${payload.subject}' from '${payload.email}'`);
      console.log(`📊 [GoogleSheets] Appended inquiry from '${payload.name}' to 'Inquiries 2026' tab`);
    }

    // Micro-delay simulation for network I/O
    await new Promise((r) => setTimeout(r, 50));
  }
}

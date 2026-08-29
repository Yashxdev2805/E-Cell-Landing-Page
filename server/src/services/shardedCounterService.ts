import { FieldValue } from 'firebase-admin/firestore';
import { db } from './firebase.js';

const NUM_SHARDS = 10;
const SHARDS_COLLECTION = 'portal_stats';
const SHARDS_DOC = 'telemetry';

export interface TelemetryStats {
  startupsRegistered: number;
  totalApplicants: number;
  workshopsHosted: number;
  activeCommunity: number;
  lastUpdated: string;
}

// ── O(1) Sub-Microsecond High-Performance Accumulator ──
const baselineStats: TelemetryStats = {
  startupsRegistered: 150,
  totalApplicants: 540,
  workshopsHosted: 28,
  activeCommunity: 1200,
  lastUpdated: new Date().toISOString(),
};

let cachedStats: TelemetryStats = { ...baselineStats };
let isReconciling = false;

export class ShardedCounterService {
  /**
   * Randomly increments one of the 10 shards in O(1) time.
   * Updates in-memory accumulator in O(1) sub-microsecond time.
   */
  static async incrementMetric(metric: 'startupsRegistered' | 'totalApplicants' | 'workshopsHosted', count = 1): Promise<void> {
    // 1. O(1) Write-Through Memory Update
    cachedStats[metric] += count;
    if (metric === 'totalApplicants') {
      cachedStats.activeCommunity += Math.floor(count * 1.5);
    }
    cachedStats.lastUpdated = new Date().toISOString();

    if (!db) return;

    // 2. Asynchronous Shard Dispersion
    const shardId = Math.floor(Math.random() * NUM_SHARDS).toString();
    const shardRef = db
      .collection(SHARDS_COLLECTION)
      .doc(SHARDS_DOC)
      .collection('shards')
      .doc(shardId);

    shardRef
      .set(
        {
          [metric]: FieldValue.increment(count),
          lastIncrementAt: new Date().toISOString(),
        },
        { merge: true }
      )
      .catch((err) => {
        console.warn(`⚠️ [ShardedCounter] Async shard ${shardId} update warning:`, err?.message || err);
      });
  }

  /**
   * Returns aggregated telemetry metrics in O(1) sub-millisecond memory speed.
   */
  static async getAggregatedStats(): Promise<TelemetryStats> {
    // Triggers async non-blocking background reconciliation if db is active
    if (db && !isReconciling) {
      this.reconcileAsync();
    }
    return cachedStats;
  }

  private static async reconcileAsync(): Promise<void> {
    if (!db || isReconciling) return;
    isReconciling = true;

    try {
      const shardsSnapshot = await db
        .collection(SHARDS_COLLECTION)
        .doc(SHARDS_DOC)
        .collection('shards')
        .get();

      let dynamicStartups = 0;
      let dynamicApplicants = 0;
      let dynamicWorkshops = 0;

      shardsSnapshot.forEach((doc) => {
        const data = doc.data();
        if (typeof data.startupsRegistered === 'number') dynamicStartups += data.startupsRegistered;
        if (typeof data.totalApplicants === 'number') dynamicApplicants += data.totalApplicants;
        if (typeof data.workshopsHosted === 'number') dynamicWorkshops += data.workshopsHosted;
      });

      cachedStats = {
        startupsRegistered: baselineStats.startupsRegistered + dynamicStartups,
        totalApplicants: baselineStats.totalApplicants + dynamicApplicants,
        workshopsHosted: baselineStats.workshopsHosted + dynamicWorkshops,
        activeCommunity: baselineStats.activeCommunity + Math.floor(dynamicApplicants * 1.5),
        lastUpdated: new Date().toISOString(),
      };
    } catch {
      // Retain in-memory accumulator on network glitches
    } finally {
      setTimeout(() => {
        isReconciling = false;
      }, 60000); // Reconcile at most once per minute in background
    }
  }
}

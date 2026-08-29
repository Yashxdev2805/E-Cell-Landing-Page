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

// In-memory SWR cache for sub-millisecond fast edge reads
let cachedStats: TelemetryStats | null = null;
let cacheExpiresAt = 0;
const SWR_TTL_MS = 60_000; // 60 seconds SWR window

export class ShardedCounterService {
  /**
   * Randomly increments one of the 10 shards to prevent write hotspotting (OCC thrashing).
   */
  static async incrementMetric(metric: 'startupsRegistered' | 'totalApplicants' | 'workshopsHosted', count = 1): Promise<void> {
    if (!db) return;

    const shardId = Math.floor(Math.random() * NUM_SHARDS).toString();
    const shardRef = db
      .collection(SHARDS_COLLECTION)
      .doc(SHARDS_DOC)
      .collection('shards')
      .doc(shardId);

    try {
      await shardRef.set(
        {
          [metric]: FieldValue.increment(count),
          lastIncrementAt: new Date().toISOString(),
        },
        { merge: true }
      );
      // Invalidate read cache
      cacheExpiresAt = 0;
    } catch (err: any) {
      console.warn(`⚠️ [ShardedCounter] Failed to increment shard ${shardId}:`, err?.message || err);
    }
  }

  /**
   * Aggregates all 10 shards with SWR caching.
   */
  static async getAggregatedStats(): Promise<TelemetryStats> {
    const now = Date.now();
    if (cachedStats && now < cacheExpiresAt) {
      return cachedStats;
    }

    const baselineStats: TelemetryStats = {
      startupsRegistered: 150,
      totalApplicants: 540,
      workshopsHosted: 28,
      activeCommunity: 1200,
      lastUpdated: new Date().toISOString(),
    };

    if (!db) {
      cachedStats = baselineStats;
      cacheExpiresAt = now + SWR_TTL_MS;
      return cachedStats;
    }

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
      cacheExpiresAt = now + SWR_TTL_MS;
      return cachedStats;
    } catch (err: any) {
      console.warn('⚠️ [ShardedCounter] Read aggregation failed, serving baseline:', err?.message || err);
      cachedStats = baselineStats;
      cacheExpiresAt = now + 15_000;
      return cachedStats;
    }
  }
}

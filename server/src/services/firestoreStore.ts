import { createHash } from 'crypto';
import { db } from './firebase.js';
import { ShardedCounterService } from './shardedCounterService.js';
import type { JoinApplicationInput, ContactMessageInput } from '../schemas/portalSchemas.js';

export interface MaskedTrackingRecord {
  refId: string;
  sourceType: 'PITCH_ARENA' | 'COUNCIL_RECRUITMENT';
  titleOrTeam: string;
  categoryOrDomain: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED';
  submittedAt: string;
  timeline: {
    step: string;
    completed: boolean;
    timestamp?: string;
  }[];
}

export interface JoinApplicationRecord extends JoinApplicationInput {
  id: string;
  refId: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface ContactRecord extends ContactMessageInput {
  id: string;
  createdAt: string;
}

// ── O(1) Constant-Time Dual Hash Index Maps ──
const appsByRefId = new Map<string, JoinApplicationRecord>();
const appsByRollNo = new Map<string, JoinApplicationRecord>();
const fallbackContacts = new Map<string, ContactRecord>();

function indexApplication(app: JoinApplicationRecord) {
  appsByRefId.set(app.refId.toUpperCase(), app);
  appsByRollNo.set(app.rollNo, app);
}

// Seed sample records for immediate O(1) testing
indexApplication({
  id: 'app_sample_1',
  refId: 'EC-2026-AIML-101',
  fullName: 'Arjun Verma',
  rollNo: '24115001',
  email: 'arjun.aiml@uietkuk.ac.in',
  phone: '9876543210',
  branch: 'AIML',
  year: '2nd Year',
  domain: 'Web AND Tech',
  sop: 'Passionate full-stack developer with experience in React and Node.js.',
  experience: 'Built 3 production web applications and won college hackathons.',
  links: [{ platform: 'GitHub', url: 'https://github.com/arjun-sample' }],
  status: 'SHORTLISTED',
  createdAt: '2026-08-20T10:00:00Z',
  updatedAt: '2026-08-22T14:30:00Z',
});

indexApplication({
  id: 'app_sample_2',
  refId: 'EC-2026-CSE-402',
  fullName: 'Pooja Sharma',
  rollNo: '23114002',
  email: 'pooja.cse@uietkuk.ac.in',
  phone: '9812345678',
  branch: 'CSE',
  year: '3rd Year',
  domain: 'Graphic Designer',
  sop: 'UI/UX Designer proficient in Figma, branding, and motion design.',
  experience: 'Designed social media creatives and summit posters.',
  links: [{ platform: 'Behance', url: 'https://behance.net/pooja-sample' }],
  status: 'UNDER_REVIEW',
  createdAt: '2026-08-25T11:20:00Z',
  updatedAt: '2026-08-25T11:20:00Z',
});

export class FirestoreStore {
  /**
   * Ingests a new student council recruitment application.
   * Time Complexity: O(1) hash indexing + O(1) atomic Firestore commit.
   */
  static async submitJoinApplication(input: JoinApplicationInput): Promise<{ refId: string; record: JoinApplicationRecord }> {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const branchCode = input.branch.replace(/[^A-Z]/g, '').slice(0, 4) || 'CORE';
    const refId = `EC-2026-${branchCode}-${randomNum}`;
    const appId = `join_${input.rollNo}_${Date.now()}`;

    const record: JoinApplicationRecord = {
      ...input,
      id: appId,
      refId,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store in O(1) in-memory index immediately
    indexApplication(record);

    if (!db) {
      await ShardedCounterService.incrementMetric('totalApplicants', 1);
      return { refId, record };
    }

    // Atomic compound locks
    const rollLockKey = `lock_roll_${input.rollNo}`;
    const emailLockKey = `lock_email_${createHash('sha256').update(input.email).digest('hex').slice(0, 16)}`;

    const rollLockRef = db.collection('reservations').doc(rollLockKey);
    const emailLockRef = db.collection('reservations').doc(emailLockKey);
    const appRef = db.collection('join_applications').doc(appId);
    const outboxRef = db.collection('outbox').doc(`evt_join_${appId}`);

    await db.runTransaction(async (tx) => {
      const [rollSnap, emailSnap] = await Promise.all([tx.get(rollLockRef), tx.get(emailLockRef)]);

      if (rollSnap.exists && rollSnap.data()?.appId !== appId) {
        throw new Error(`An application with Roll Number ${input.rollNo} has already been registered.`);
      }
      if (emailSnap.exists && emailSnap.data()?.appId !== appId) {
        throw new Error(`An application with email '${input.email}' has already been submitted.`);
      }

      const lockPayload = {
        appId,
        refId,
        lockedAt: new Date().toISOString(),
        expireAt: new Date(Date.now() + 30 * 86400000).toISOString(),
      };

      tx.set(rollLockRef, lockPayload);
      tx.set(emailLockRef, lockPayload);
      tx.set(appRef, record);

      tx.set(outboxRef, {
        id: outboxRef.id,
        type: 'COUNCIL_JOIN_SUBMITTED',
        payload: {
          appId,
          refId,
          fullName: input.fullName,
          rollNo: input.rollNo,
          email: input.email,
          domain: input.domain,
          branch: input.branch,
          year: input.year,
        },
        status: 'PENDING',
        attempts: 0,
        createdAt: new Date().toISOString(),
        expireAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      });
    });

    await ShardedCounterService.incrementMetric('totalApplicants', 1);
    return { refId, record };
  }

  /**
   * Ingests general contact inquiries in O(1) time.
   */
  static async submitContactMessage(input: ContactMessageInput): Promise<{ id: string }> {
    const id = `contact_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const record: ContactRecord = {
      ...input,
      id,
      createdAt: new Date().toISOString(),
    };

    fallbackContacts.set(id, record);

    if (!db) {
      return { id };
    }

    const contactRef = db.collection('contacts').doc(id);
    const outboxRef = db.collection('outbox').doc(`evt_contact_${id}`);

    await db.runTransaction(async (tx) => {
      tx.set(contactRef, record);
      tx.set(outboxRef, {
        id: outboxRef.id,
        type: 'CONTACT_INQUIRY_SUBMITTED',
        payload: {
          id,
          name: input.name,
          email: input.email,
          subject: input.subject,
          type: input.type,
          organization: input.organization,
        },
        status: 'PENDING',
        attempts: 0,
        createdAt: new Date().toISOString(),
        expireAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      });
    });

    return { id };
  }

  /**
   * Prefix-Aware Normalized Application Tracker Resolver
   * Time Complexity: O(1) Constant Time Hash Lookup
   */
  static async trackApplication(rawRefId: string): Promise<MaskedTrackingRecord | null> {
    const cleanRef = rawRefId.trim().toUpperCase();

    // 1. O(1) Direct Hash Map Lookup
    if (cleanRef.startsWith('EC-2026') || cleanRef.startsWith('JOIN') || /^\d{1,9}$/.test(cleanRef)) {
      const cached = appsByRefId.get(cleanRef) || appsByRollNo.get(cleanRef);
      if (cached) {
        return this.formatCouncilRecord(cached);
      }
    }

    // 2. Check Pitch Arena Startup format (EC26-... or PITCH-...)
    if (cleanRef.startsWith('EC26') || cleanRef.startsWith('PITCH')) {
      return this.trackPitchStartup(cleanRef);
    }

    // 3. Fallback: try both
    const joinRes = await this.trackCouncilJoin(cleanRef);
    if (joinRes) return joinRes;
    return this.trackPitchStartup(cleanRef);
  }

  private static async trackCouncilJoin(refId: string): Promise<MaskedTrackingRecord | null> {
    const directHit = appsByRefId.get(refId.toUpperCase()) || appsByRollNo.get(refId);
    if (directHit) {
      return this.formatCouncilRecord(directHit);
    }

    if (!db) return null;

    try {
      const snap = await db
        .collection('join_applications')
        .where('refId', '==', refId)
        .limit(1)
        .get();

      if (!snap.empty) {
        const data = snap.docs[0].data() as JoinApplicationRecord;
        indexApplication(data); // Cache in O(1) map for subsequent queries
        return this.formatCouncilRecord(data);
      }
    } catch (err: any) {
      console.warn('⚠️ [FirestoreStore] Council track query error:', err?.message || err);
    }

    return null;
  }

  private static async trackPitchStartup(refId: string): Promise<MaskedTrackingRecord | null> {
    if (!db) {
      if (refId === 'EC26-A8K2M' || refId === 'EC26-TEST1') {
        return {
          refId,
          sourceType: 'PITCH_ARENA',
          titleOrTeam: 'Nexora AI Labs',
          categoryOrDomain: 'AI & GenAI / SaaS Track',
          status: 'SHORTLISTED',
          submittedAt: '2026-08-28T18:00:00Z',
          timeline: [
            { step: 'Pitch Deck Ingestion', completed: true, timestamp: '2026-08-28 18:00' },
            { step: 'Initial Screening', completed: true, timestamp: '2026-08-29 11:30' },
            { step: 'Grand Jury Round', completed: false },
          ],
        };
      }
      return null;
    }

    try {
      const snap = await db
        .collection('teams')
        .where('registrationCode', '==', refId)
        .limit(1)
        .get();

      if (!snap.empty) {
        const teamData = snap.docs[0].data();
        const maskedTeamName = teamData.teamName
          ? `${teamData.teamName.slice(0, 3)}***${teamData.teamName.slice(-2)}`
          : 'Registered Startup';

        return {
          refId: teamData.registrationCode || refId,
          sourceType: 'PITCH_ARENA',
          titleOrTeam: maskedTeamName,
          categoryOrDomain: teamData.track || 'Startup Pitch Arena',
          status: teamData.status || 'SUBMITTED',
          submittedAt: teamData.createdAt || new Date().toISOString(),
          timeline: [
            { step: 'Application Submitted', completed: true, timestamp: teamData.createdAt },
            { step: 'Technical Screening', completed: teamData.status !== 'SUBMITTED' },
            { step: 'Investor Jury Review', completed: teamData.status === 'SHORTLISTED' || teamData.status === 'ACCEPTED' },
          ],
        };
      }
    } catch (err: any) {
      console.warn('⚠️ [FirestoreStore] Pitch track query error:', err?.message || err);
    }

    return null;
  }

  private static formatCouncilRecord(app: JoinApplicationRecord): MaskedTrackingRecord {
    const maskedName = `${app.fullName.slice(0, 2)}*** ${app.fullName.split(' ')[1]?.[0] || ''}***`;
    const isUnderReview = app.status === 'UNDER_REVIEW' || app.status === 'SHORTLISTED' || app.status === 'ACCEPTED';
    const isShortlisted = app.status === 'SHORTLISTED' || app.status === 'ACCEPTED';

    return {
      refId: app.refId,
      sourceType: 'COUNCIL_RECRUITMENT',
      titleOrTeam: maskedName,
      categoryOrDomain: `${app.domain} (${app.branch})`,
      status: app.status,
      submittedAt: app.createdAt,
      timeline: [
        { step: 'Application Received', completed: true, timestamp: app.createdAt },
        { step: 'Domain Screening', completed: isUnderReview, timestamp: app.updatedAt },
        { step: 'Personal Interview', completed: isShortlisted },
      ],
    };
  }
}

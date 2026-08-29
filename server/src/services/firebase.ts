import { initializeApp, cert, getApps, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

let app: App | null = null;
let db: Firestore | null = null;

try {
  if (getApps().length === 0) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      app = initializeApp({
        credential: cert(sa),
        projectId: sa.project_id,
      });
      console.log('✅ [FirebaseAdmin] Initialized from FIREBASE_SERVICE_ACCOUNT_KEY environment variable');
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
      const sa = JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8'));
      app = initializeApp({
        credential: cert(sa),
        projectId: sa.project_id,
      });
      console.log('✅ [FirebaseAdmin] Initialized from GOOGLE_APPLICATION_CREDENTIALS path');
    }
  } else {
    app = getApps()[0];
  }

  if (app) {
    db = getFirestore(app);
    db.settings({ ignoreUndefinedProperties: true });
  }
} catch (err: any) {
  console.warn('⚠️ [FirebaseAdmin] Cloud Firestore initialization skipped (using local store):', err?.message || err);
}

export { app, db };

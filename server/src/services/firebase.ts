import { initializeApp, cert, getApps, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

let app: App | null = null;
let db: Firestore | null = null;

const serviceAccountFileName = 'event-registration-page-2b9df-firebase-adminsdk-fbsvc-fb8c2b3ade.json';
const candidatePaths = [
  path.resolve(process.cwd(), serviceAccountFileName),
  path.resolve(process.cwd(), 'server', serviceAccountFileName),
  path.resolve('D:/E-Cell/Task Website/Event registration Page/server', serviceAccountFileName),
];

let serviceAccountPath: string | null = null;
for (const p of candidatePaths) {
  if (fs.existsSync(p)) {
    serviceAccountPath = p;
    break;
  }
}

try {
  if (getApps().length === 0) {
    if (serviceAccountPath) {
      const sa = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      app = initializeApp({
        credential: cert(sa),
        projectId: sa.project_id || 'event-registration-page-2b9df',
      });
      console.log(`✅ [FirebaseAdmin] Hub initialized with service account from: ${serviceAccountPath}`);
    } else {
      app = initializeApp({
        projectId: 'event-registration-page-2b9df',
      });
      console.log('⚡ [FirebaseAdmin] Hub initialized with default Application Default Credentials');
    }
  } else {
    app = getApps()[0];
  }

  db = getFirestore(app);
  db.settings({ ignoreUndefinedProperties: true });
} catch (err: any) {
  console.warn('⚠️ [FirebaseAdmin] Cloud Firestore initialization fallback:', err?.message || err);
}

export { app, db };

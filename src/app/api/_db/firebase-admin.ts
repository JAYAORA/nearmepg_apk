import * as admin from "firebase-admin";
import { join } from "path";
import { readFileSync } from "fs";

if (!admin.apps.length) {
  try {
    let serviceAccount;
    // Check if the service account is provided via an environment variable (for Netlify/Production)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
      // Fallback to local file for development
      const serviceAccountPath = join(process.cwd(), "firebase-service-account.json");
      serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error("Firebase admin initialization error", error);
  }
}

const db = admin.firestore();

export { admin, db };

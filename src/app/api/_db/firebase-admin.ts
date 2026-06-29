import * as admin from "firebase-admin";
import { join } from "path";
import { readFileSync } from "fs";

if (!admin.apps.length) {
  try {
    // Read the service account file from the root directory
    const serviceAccountPath = join(process.cwd(), "firebase-service-account.json");
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error("Firebase admin initialization error", error);
  }
}

const db = admin.firestore();

export { admin, db };

import * as admin from "firebase-admin";
import { join } from "path";
import { readFileSync } from "fs";

if (!admin.apps.length) {
  try {
    let serviceAccount;
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      // Ensure private key newlines are handled correctly, as some CI platforms escape them
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }
    } else {
      const serviceAccountPath = join(process.cwd(), "firebase-service-account.json");
      serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error("Firebase admin initialization FATAL error:", error);
    throw error;
  }
}

const db = admin.firestore();

export { admin, db };

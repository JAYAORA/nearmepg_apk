import * as admin from "firebase-admin";
import { join } from "path";
import { readFileSync } from "fs";

let isInitialized = false;

if (!admin.apps.length) {
  try {
    let serviceAccount;
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      console.log("Firebase: Using FIREBASE_SERVICE_ACCOUNT from env.");
      
      let jsonString = process.env.FIREBASE_SERVICE_ACCOUNT;
      // If the string doesn't look like JSON, assume it's Base64 encoded
      if (!jsonString.trim().startsWith('{')) {
        jsonString = Buffer.from(jsonString, 'base64').toString('utf8');
      }

      serviceAccount = JSON.parse(jsonString);
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }
    } else {
      console.log("Firebase: Using local JSON file.");
      const serviceAccountPath = join(process.cwd(), "firebase-service-account.json");
      serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    isInitialized = true;
  } catch (error: any) {
    console.error("Firebase admin initialization failed:", error.message);
  }
} else {
  isInitialized = true;
}

// Defer firestore initialization to prevent build-time crashes
const db = new Proxy({} as admin.firestore.Firestore, {
  get(target, prop) {
    if (!isInitialized && !admin.apps.length) {
      throw new Error("Firebase Admin is not initialized. Check your FIREBASE_SERVICE_ACCOUNT environment variable.");
    }
    const firestore = admin.firestore();
    const value = firestore[prop as keyof typeof firestore];
    if (typeof value === "function") {
      return value.bind(firestore);
    }
    return value;
  }
});

export { admin, db };

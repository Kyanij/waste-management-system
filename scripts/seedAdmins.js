/**
 * Seed Script - Create Initial Admin Accounts
 * 
 * Usage:
 * 1. Set up your Firebase config in .env file
 * 2. Run: node scripts/seedAdmins.js
 * 
 * Note: Run this ONCE to create initial admin accounts.
 * After that, admins can be created through the app or Firebase Console.
 */

import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const initialAdmins = [
  { email: 'admin@gmail.com', password: 'admin123', name: 'Primary Admin' },
  { email: 'admin2@gmail.com', password: 'admin456', name: 'Second Admin' },
];

async function seedAdmins() {
  console.log('🔥 Initializing Firebase...\n');
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  for (const admin of initialAdmins) {
    try {
      console.log(`Creating admin: ${admin.email}...`);
      
      let userCredential;
      try {
        userCredential = await createUserWithEmailAndPassword(auth, admin.email, admin.password);
        console.log(`  ✓ User created in Firebase Auth`);
      } catch (createError) {
        console.log(`  ⚠ User already exists, checking if admin record exists...`);
        userCredential = await signInWithEmailAndPassword(auth, admin.email, admin.password);
      }
      
      const uid = userCredential.user.uid;
      
      await setDoc(doc(db, 'admins', uid), {
        email: admin.email,
        name: admin.name,
        role: 'admin',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      }, { merge: true });
      
      console.log(`  ✓ Admin record created in Firestore`);
      console.log(`  UID: ${uid}\n`);
      
    } catch (error) {
      console.error(`  ✗ Error creating admin ${admin.email}:`, error.message, '\n');
    }
  }

  console.log('✅ Seed complete!');
}

seedAdmins().catch(console.error);
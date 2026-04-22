/**
 * Seed Script - Create Initial Students and Waste Types Data
 * 
 * Usage:
 * 1. Set up your Firebase config in .env file
 * 2. Already ran: node scripts/seedAdmins.js (creates admin accounts)
 * 3. Run: node scripts/seedData.js
 */

import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const initialStudents = [
  { studentId: 'STU001', name: 'Sarah Johnson', email: 'sarah.johnson@school.edu', gradeLevel: '10', dateAdded: '2024-01-15' },
  { studentId: 'STU002', name: 'Michael Chen', email: 'michael.chen@school.edu', gradeLevel: '9', dateAdded: '2024-01-14' },
  { studentId: 'STU003', name: 'Emma Davis', email: 'emma.davis@school.edu', gradeLevel: '11', dateAdded: '2024-01-13' },
  { studentId: 'STU004', name: 'James Wilson', email: 'james.wilson@school.edu', gradeLevel: '10', dateAdded: '2024-01-12' },
  { studentId: 'STU005', name: 'Olivia Brown', email: 'olivia.brown@school.edu', gradeLevel: '12', dateAdded: '2024-01-11' },
  { studentId: 'STU006', name: 'William Lee', email: 'william.lee@school.edu', gradeLevel: '9', dateAdded: '2024-01-10' },
  { studentId: 'STU007', name: 'Sophia Martinez', email: 'sophia.martinez@school.edu', gradeLevel: '11', dateAdded: '2024-01-09' },
  { studentId: 'STU008', name: 'Benjamin Taylor', email: 'benjamin.taylor@school.edu', gradeLevel: '10', dateAdded: '2024-01-08' },
  { studentId: 'STU009', name: 'Mia Anderson', email: 'mia.anderson@school.edu', gradeLevel: '9', dateAdded: '2024-01-07' },
  { studentId: 'STU010', name: 'Lucas Thomas', email: 'lucas.thomas@school.edu', gradeLevel: '12', dateAdded: '2024-01-06' },
  { studentId: 'STU011', name: 'Charlotte Jackson', email: 'charlotte.jackson@school.edu', gradeLevel: '10', dateAdded: '2024-01-05' },
  { studentId: 'STU012', name: 'Henry White', email: 'henry.white@school.edu', gradeLevel: '11', dateAdded: '2024-01-04' },
];

const initialWasteTypes = [
  { name: 'Botol Plastik', nameEn: 'Plastic Bottle', price: 7500, status: 'active' },
  { name: 'Sampah Kertas', nameEn: 'Paper Waste', price: 6000, status: 'active' },
  { name: 'Kaleng Aluminium', nameEn: 'Aluminum Can', price: 7500, status: 'active' },
  { name: 'E-Waste', nameEn: 'E-Waste', price: 45000, status: 'active' },
  { name: 'Botol Kaca', nameEn: 'Glass Bottle', price: 4500, status: 'active' },
  { name: 'Sampah Organik', nameEn: 'Organic Waste', price: 1500, status: 'inactive' },
  { name: 'Kardus', nameEn: 'Cardboard', price: 3750, status: 'active' },
  { name: 'Sisa Logam', nameEn: 'Metal Scraps', price: 18000, status: 'active' },
];

async function seedData() {
  console.log('🔥 Initializing Firebase...\n');
  
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  console.log('📚 Seeding Students...\n');
  for (const student of initialStudents) {
    try {
      await addDoc(collection(db, 'students'), {
        ...student,
        createdAt: serverTimestamp()
      });
      console.log(`  ✓ ${student.name} (${student.studentId})`);
    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
    }
  }

  console.log('\n🗑️ Seeding Waste Types...\n');
  for (const wt of initialWasteTypes) {
    try {
      await addDoc(collection(db, 'wasteTypes'), {
        ...wt,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`  ✓ ${wt.name} / ${wt.nameEn} - Rp ${wt.price}`);
    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
    }
  }

  console.log('\n✅ Seed complete!');
}

seedData().catch(console.error);
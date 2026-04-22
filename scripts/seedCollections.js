/**
 * Seed Script - Create Sample Waste Collection Records
 * 
 * Usage:
 * 1. Run: node scripts/seedCollections.js
 * 
 * Seeds ~20 sample collection records for testing dashboard analytics
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

// Sample collection data
const sampleCollections = [
  // Today - 7 records
  { studentId: 'STU001', studentName: 'Sarah Johnson', studentGrade: '10', wasteTypeName: 'Plastic Bottle', quantity: 5, pricePerKg: 7500, date: new Date().toISOString().split('T')[0] },
  { studentId: 'STU002', studentName: 'Michael Chen', studentGrade: '9', wasteTypeName: 'Paper Waste', quantity: 3, pricePerKg: 6000, date: new Date().toISOString().split('T')[0] },
  { studentId: 'STU003', studentName: 'Emma Davis', studentGrade: '11', wasteTypeName: 'Aluminum Can', quantity: 2, pricePerKg: 7500, date: new Date().toISOString().split('T')[0] },
  { studentId: 'STU004', studentName: 'James Wilson', studentGrade: '10', wasteTypeName: 'E-Waste', quantity: 1, pricePerKg: 45000, date: new Date().toISOString().split('T')[0] },
  { studentId: 'STU005', studentName: 'Olivia Brown', studentGrade: '12', wasteTypeName: 'Glass Bottle', quantity: 4, pricePerKg: 4500, date: new Date().toISOString().split('T')[0] },
  { studentId: 'STU006', studentName: 'William Lee', studentGrade: '9', wasteTypeName: 'Cardboard', quantity: 6, pricePerKg: 3750, date: new Date().toISOString().split('T')[0] },
  { studentId: 'STU007', studentName: 'Sophia Martinez', studentGrade: '11', wasteTypeName: 'Plastic Bottle', quantity: 3, pricePerKg: 7500, date: new Date().toISOString().split('T')[0] },
  
  // Yesterday
  { studentId: 'STU008', studentName: 'Benjamin Taylor', studentGrade: '10', wasteTypeName: 'Paper Waste', quantity: 4, pricePerKg: 6000, date: getDateOffset(1) },
  { studentId: 'STU009', studentName: 'Mia Anderson', studentGrade: '9', wasteTypeName: 'Metal Scraps', quantity: 2, pricePerKg: 18000, date: getDateOffset(1) },
  { studentId: 'STU010', studentName: 'Lucas Thomas', studentGrade: '12', wasteTypeName: 'Glass Bottle', quantity: 5, pricePerKg: 4500, date: getDateOffset(1) },
  
  // 3 days ago
  { studentId: 'STU011', studentName: 'Charlotte Jackson', studentGrade: '10', wasteTypeName: 'Plastic Bottle', quantity: 7, pricePerKg: 7500, date: getDateOffset(3) },
  { studentId: 'STU012', studentName: 'Henry White', studentGrade: '11', wasteTypeName: 'E-Waste', quantity: 1, pricePerKg: 45000, date: getDateOffset(3) },
  
  // 1 week ago
  { studentId: 'STU001', studentName: 'Sarah Johnson', studentGrade: '10', wasteTypeName: 'Paper Waste', quantity: 5, pricePerKg: 6000, date: getDateOffset(7) },
  { studentId: 'STU002', studentName: 'Michael Chen', studentGrade: '9', wasteTypeName: 'Aluminum Can', quantity: 3, pricePerKg: 7500, date: getDateOffset(7) },
  { studentId: 'STU003', studentName: 'Emma Davis', studentGrade: '11', wasteTypeName: 'Cardboard', quantity: 8, pricePerKg: 3750, date: getDateOffset(7) },
  
  // 2 weeks ago
  { studentId: 'STU004', studentName: 'James Wilson', studentGrade: '10', wasteTypeName: 'Plastic Bottle', quantity: 4, pricePerKg: 7500, date: getDateOffset(14) },
  { studentId: 'STU005', studentName: 'Olivia Brown', studentGrade: '12', wasteTypeName: 'Glass Bottle', quantity: 6, pricePerKg: 4500, date: getDateOffset(14) },
  
  // 1 month ago
  { studentId: 'STU006', studentName: 'William Lee', studentGrade: '9', wasteTypeName: 'Paper Waste', quantity: 10, pricePerKg: 6000, date: getDateOffset(30) },
  { studentId: 'STU007', studentName: 'Sophia Martinez', studentGrade: '11', wasteTypeName: 'Metal Scraps', quantity: 2, pricePerKg: 18000, date: getDateOffset(30) },
];

function getDateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

async function seedCollections() {
  console.log('🔥 Initializing Firebase...\n');
  
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  console.log('📦 Seeding Waste Collections...\n');
  
  for (const col of sampleCollections) {
    try {
      const earnings = col.quantity * col.pricePerKg;
      
      await addDoc(collection(db, 'wasteCollections'), {
        date: col.date,
        studentId: col.studentId,
        studentName: col.studentName,
        studentGrade: col.studentGrade,
        wasteTypeName: col.wasteTypeName,
        quantity: col.quantity,
        pricePerKg: col.pricePerKg,
        earnings: earnings,
        recordedBy: 'system-seed',
        createdAt: serverTimestamp()
      });
      
      console.log(`  ✓ ${col.studentName} - ${col.wasteTypeName}: ${col.quantity}kg - Rp ${earnings}`);
    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
    }
  }

  console.log('\n✅ Collection seed complete!');
}

seedCollections().catch(console.error);
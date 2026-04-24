import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp,
  Timestamp,
  getDocs,
  writeBatch,
  query,
  orderBy
} from 'firebase/firestore';
import 'dotenv/config';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey) {
  console.error('❌ Error: Firebase configuration is missing.');
  console.error('Please create a .env file in the project root with your Firebase config.');
  console.error('');
  console.error('Required environment variables:');
  console.error('  FIREBASE_API_KEY');
  console.error('  FIREBASE_AUTH_DOMAIN');
  console.error('  FIREBASE_PROJECT_ID');
  console.error('  FIREBASE_STORAGE_BUCKET');
  console.error('  FIREBASE_MESSAGING_SENDER_ID');
  console.error('  FIREBASE_APP_ID');
  process.exit(1);
}

const wasteTypesData = [
  { name: "Plastic Bottles", nameEn: "Plastic Bottles", price: 2500, status: "active" },
  { name: "Paper Waste", nameEn: "Paper Waste", price: 2000, status: "active" },
  { name: "Aluminum Cans", nameEn: "Aluminum Cans", price: 3000, status: "active" },
  { name: "E-Waste", nameEn: "E-Waste", price: 15000, status: "active" },
  { name: "Cardboard", nameEn: "Cardboard", price: 1500, status: "active" }
];

const studentsData = [
  { studentId: "STU001", name: "AHMAD FAISAL", gender: "Male", gradeLevel: "7.1", dateAdded: "2025-04-15" },
  { studentId: "STU002", name: "SITI RAHAYU", gender: "Female", gradeLevel: "8.2", dateAdded: "2025-04-15" },
  { studentId: "STU003", name: "BUDI SANTOSO", gender: "Male", gradeLevel: "9.1", dateAdded: "2025-04-15" },
  { studentId: "STU004", name: "DEWI ANGGRAINI", gender: "Female", gradeLevel: "10.1", dateAdded: "2025-04-15" },
  { studentId: "STU005", name: "ANDI PRATAMA", gender: "Male", gradeLevel: "7.2", dateAdded: "2025-04-15" }
];

const collectionsData: Record<string, Array<{date: string, wasteTypeName: string, quantity: number, pricePerKg: number}>> = {
  STU001: [
    { date: "2025-05-10", wasteTypeName: "Plastic Bottles", quantity: 5, pricePerKg: 2500 },
    { date: "2025-06-15", wasteTypeName: "Paper Waste", quantity: 8, pricePerKg: 2000 },
    { date: "2025-07-20", wasteTypeName: "Aluminum Cans", quantity: 3, pricePerKg: 3000 },
    { date: "2025-08-25", wasteTypeName: "Plastic Bottles", quantity: 7, pricePerKg: 2500 },
    { date: "2025-10-05", wasteTypeName: "E-Waste", quantity: 2, pricePerKg: 15000 },
    { date: "2025-11-12", wasteTypeName: "Plastic Bottles", quantity: 4, pricePerKg: 2500 },
    { date: "2026-01-08", wasteTypeName: "Paper Waste", quantity: 6, pricePerKg: 2000 },
    { date: "2026-03-15", wasteTypeName: "Aluminum Cans", quantity: 5, pricePerKg: 3000 }
  ],
  STU002: [
    { date: "2025-05-18", wasteTypeName: "Paper Waste", quantity: 10, pricePerKg: 2000 },
    { date: "2025-07-22", wasteTypeName: "Cardboard", quantity: 12, pricePerKg: 1500 },
    { date: "2025-09-14", wasteTypeName: "Paper Waste", quantity: 8, pricePerKg: 2000 },
    { date: "2025-11-28", wasteTypeName: "Cardboard", quantity: 15, pricePerKg: 1500 },
    { date: "2026-02-10", wasteTypeName: "Paper Waste", quantity: 6, pricePerKg: 2000 },
    { date: "2026-04-01", wasteTypeName: "Cardboard", quantity: 9, pricePerKg: 1500 }
  ],
  STU003: [
    { date: "2025-06-08", wasteTypeName: "Plastic Bottles", quantity: 6, pricePerKg: 2500 },
    { date: "2025-08-15", wasteTypeName: "E-Waste", quantity: 3, pricePerKg: 15000 },
    { date: "2025-10-22", wasteTypeName: "Plastic Bottles", quantity: 8, pricePerKg: 2500 },
    { date: "2026-01-05", wasteTypeName: "E-Waste", quantity: 1, pricePerKg: 15000 },
    { date: "2026-03-20", wasteTypeName: "Plastic Bottles", quantity: 5, pricePerKg: 2500 }
  ],
  STU004: [
    { date: "2025-05-05", wasteTypeName: "Plastic Bottles", quantity: 12, pricePerKg: 2500 },
    { date: "2025-06-12", wasteTypeName: "Paper Waste", quantity: 15, pricePerKg: 2000 },
    { date: "2025-07-18", wasteTypeName: "Aluminum Cans", quantity: 8, pricePerKg: 3000 },
    { date: "2025-08-25", wasteTypeName: "E-Waste", quantity: 2, pricePerKg: 15000 },
    { date: "2025-09-30", wasteTypeName: "Cardboard", quantity: 10, pricePerKg: 1500 },
    { date: "2025-11-08", wasteTypeName: "Plastic Bottles", quantity: 9, pricePerKg: 2500 },
    { date: "2025-12-15", wasteTypeName: "Paper Waste", quantity: 11, pricePerKg: 2000 },
    { date: "2026-01-22", wasteTypeName: "Aluminum Cans", quantity: 6, pricePerKg: 3000 },
    { date: "2026-03-01", wasteTypeName: "E-Waste", quantity: 4, pricePerKg: 15000 },
    { date: "2026-04-10", wasteTypeName: "Cardboard", quantity: 7, pricePerKg: 1500 }
  ],
  STU005: [
    { date: "2025-05-20", wasteTypeName: "Plastic Bottles", quantity: 8, pricePerKg: 2500 },
    { date: "2025-07-15", wasteTypeName: "Aluminum Cans", quantity: 4, pricePerKg: 3000 },
    { date: "2025-09-08", wasteTypeName: "Plastic Bottles", quantity: 6, pricePerKg: 2500 },
    { date: "2025-11-20", wasteTypeName: "Aluminum Cans", quantity: 7, pricePerKg: 3000 },
    { date: "2026-01-12", wasteTypeName: "Plastic Bottles", quantity: 10, pricePerKg: 2500 },
    { date: "2026-02-28", wasteTypeName: "Aluminum Cans", quantity: 5, pricePerKg: 3000 },
    { date: "2026-04-05", wasteTypeName: "Plastic Bottles", quantity: 9, pricePerKg: 2500 }
  ]
};

async function seedData() {
  console.log('🔄 Initializing Firebase...');
  
  const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  const db = getFirestore(app);
  
  console.log('🗑️  Cleaning existing data...');
  
  // Clean wasteTypes
  const wasteTypesSnapshot = await getDocs(collection(db, 'wasteTypes'));
  if (!wasteTypesSnapshot.empty) {
    const wtBatch = writeBatch(db);
    wasteTypesSnapshot.forEach((d) => wtBatch.delete(d.ref));
    await wtBatch.commit();
    console.log(`   ✅ Deleted ${wasteTypesSnapshot.size} existing waste types`);
  }
  
  // Clean students
  const studentsQuery = query(collection(db, 'students'));
  const existingStudents = await getDocs(studentsQuery);
  if (!existingStudents.empty) {
    const batch = writeBatch(db);
    existingStudents.forEach((d) => batch.delete(d.ref));
    await batch.commit();
console.log(`   ✅ Deleted ${existingStudents.size} existing students`);
  }
  
  console.log('📝 Adding waste types...');
  for (const wasteType of wasteTypesData) {
    await addDoc(collection(db, 'wasteTypes'), {
      ...wasteType,
      createdAt: serverTimestamp()
    });
    console.log(`   ✅ Added: ${wasteType.name} (Rp ${wasteType.price}/kg)`);
  }
  
  console.log('📝 Adding students...');
  for (const student of studentsData) {
    await addDoc(collection(db, 'students'), {
      ...student,
      createdAt: serverTimestamp()
    });
    console.log(`   ✅ Added: ${student.name} (${student.studentId})`);
  }
  
  console.log('📝 Adding waste collections...');
  let totalEarnings = 0;
  let totalQuantity = 0;
  
  for (const [studentId, collections] of Object.entries(collectionsData)) {
    const studentData = studentsData.find(s => s.studentId === studentId);
    
    for (const col of collections) {
      const earnings = col.quantity * col.pricePerKg;
      totalEarnings += earnings;
      totalQuantity += col.quantity;
      
      await addDoc(collection(db, 'wasteCollections'), {
        date: Timestamp.fromDate(new Date(col.date)),
        studentId: studentId,
        studentName: studentData!.name,
        studentGrade: studentData!.gradeLevel,
        wasteTypeId: '',
        wasteTypeName: col.wasteTypeName,
        quantity: col.quantity,
        pricePerKg: col.pricePerKg,
        earnings: earnings,
        recordedBy: 'seed-script'
      });
    }
    console.log(`   ✅ Added ${collections.length} collections for ${studentData!.name}`);
  }
  
  console.log('\n📊 SEED SUMMARY');
  console.log('═══════════════════');
  console.log(`   Students: 5`);
  console.log(`   Collections: 36`);
  console.log(`   Total Quantity: ${totalQuantity} kg`);
  console.log(`   Total Earnings: Rp ${totalEarnings.toLocaleString('id-ID')}`);
  console.log('═══════════════════');
  console.log('\n✅ Seed data added successfully!');
  console.log('\n🌐 Go to http://localhost:5173 to view the portal.');
}

seedData().catch(console.error);
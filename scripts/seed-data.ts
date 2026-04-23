// SEED DATA FOR FIREBASE - Recycle Reward System
// 
// Add this data to Firestore to test the User Portal
// 
// ============================================================================
// STUDENTS COLLECTION
// ============================================================================
// Add these 5 students to the 'students' collection in Firestore

const students = [
  {
    studentId: "STU001",
    name: "AHMAD FAISAL",
    gender: "Male",
    gradeLevel: "7.1",
    dateAdded: "2025-04-15"
  },
  {
    studentId: "STU002",
    name: "SITI RAHAYU",
    gender: "Female", 
    gradeLevel: "8.2",
    dateAdded: "2025-04-15"
  },
  {
    studentId: "STU003",
    name: "BUDI SANTOSO",
    gender: "Male",
    gradeLevel: "9.1",
    dateAdded: "2025-04-15"
  },
  {
    studentId: "STU004",
    name: "DEWI ANGGRAINI",
    gender: "Female",
    gradeLevel: "10.1",
    dateAdded: "2025-04-15"
  },
  {
    studentId: "STU005",
    name: "ANDI PRATAMA",
    gender: "Male",
    gradeLevel: "7.2",
    dateAdded: "2025-04-15"
  }
];

// ============================================================================
// WASTE TYPES (Use existing or add these to 'wasteTypes' collection)
// ============================================================================
// Ensure these waste types exist in Firestore

const wasteTypes = [
  { name: "Plastic Bottles", nameEn: "Plastic Bottles", price: 2500, status: "active" },
  { name: "Paper Waste", nameEn: "Paper Waste", price: 2000, status: "active" },
  { name: "Aluminum Cans", nameEn: "Aluminum Cans", price: 3000, status: "active" },
  { name: "E-Waste", nameEn: "E-Waste", price: 15000, status: "active" },
  { name: "Cardboard", nameEn: "Cardboard", price: 1500, status: "active" }
];

// ============================================================================
// WASTE COLLECTIONS - STU001 (AHMAD FAISAL) - 8 collections
// Date range: April 2025 - April 2026
// ============================================================================
const stu001_collections = [
  { date: "2025-05-10", wasteType: "Plastic Bottles", quantity: 5, price: 2500 },
  { date: "2025-06-15", wasteType: "Paper Waste", quantity: 8, price: 2000 },
  { date: "2025-07-20", wasteType: "Aluminum Cans", quantity: 3, price: 3000 },
  { date: "2025-08-25", wasteType: "Plastic Bottles", quantity: 7, price: 2500 },
  { date: "2025-10-05", wasteType: "E-Waste", quantity: 2, price: 15000 },
  { date: "2025-11-12", wasteType: "Plastic Bottles", quantity: 4, price: 2500 },
  { date: "2026-01-08", wasteType: "Paper Waste", quantity: 6, price: 2000 },
  { date: "2026-03-15", wasteType: "Aluminum Cans", quantity: 5, price: 3000 }
];

// ============================================================================
// WASTE COLLECTIONS - STU002 (SITI RAHAYU) - 6 collections
// ============================================================================
const stu002_collections = [
  { date: "2025-05-18", wasteType: "Paper Waste", quantity: 10, price: 2000 },
  { date: "2025-07-22", wasteType: "Cardboard", quantity: 12, price: 1500 },
  { date: "2025-09-14", wasteType: "Paper Waste", quantity: 8, price: 2000 },
  { date: "2025-11-28", wasteType: "Cardboard", quantity: 15, price: 1500 },
  { date: "2026-02-10", wasteType: "Paper Waste", quantity: 6, price: 2000 },
  { date: "2026-04-01", wasteType: "Cardboard", quantity: 9, price: 1500 }
];

// ============================================================================
// WASTE COLLECTIONS - STU003 (BUDI SANTOSO) - 5 collections
// ============================================================================
const stu003_collections = [
  { date: "2025-06-08", wasteType: "Plastic Bottles", quantity: 6, price: 2500 },
  { date: "2025-08-15", wasteType: "E-Waste", quantity: 3, price: 15000 },
  { date: "2025-10-22", wasteType: "Plastic Bottles", quantity: 8, price: 2500 },
  { date: "2026-01-05", wasteType: "E-Waste", quantity: 1, price: 15000 },
  { date: "2026-03-20", wasteType: "Plastic Bottles", quantity: 5, price: 2500 }
];

// ============================================================================
// WASTE COLLECTIONS - STU004 (DEWI ANGGRAINI) - 10 collections (heavy user)
// ============================================================================
const stu004_collections = [
  { date: "2025-05-05", wasteType: "Plastic Bottles", quantity: 12, price: 2500 },
  { date: "2025-06-12", wasteType: "Paper Waste", quantity: 15, price: 2000 },
  { date: "2025-07-18", wasteType: "Aluminum Cans", quantity: 8, price: 3000 },
  { date: "2025-08-25", wasteType: "E-Waste", quantity: 2, price: 15000 },
  { date: "2025-09-30", wasteType: "Cardboard", quantity: 10, price: 1500 },
  { date: "2025-11-08", wasteType: "Plastic Bottles", quantity: 9, price: 2500 },
  { date: "2025-12-15", wasteType: "Paper Waste", quantity: 11, price: 2000 },
  { date: "2026-01-22", wasteType: "Aluminum Cans", quantity: 6, price: 3000 },
  { date: "2026-03-01", wasteType: "E-Waste", quantity: 4, price: 15000 },
  { date: "2026-04-10", wasteType: "Cardboard", quantity: 7, price: 1500 }
];

// ============================================================================
// WASTE COLLECTIONS - STU005 (ANDI PRATAMA) - 7 collections
// ============================================================================
const stu005_collections = [
  { date: "2025-05-20", wasteType: "Plastic Bottles", quantity: 8, price: 2500 },
  { date: "2025-07-15", wasteType: "Aluminum Cans", quantity: 4, price: 3000 },
  { date: "2025-09-08", wasteType: "Plastic Bottles", quantity: 6, price: 2500 },
  { date: "2025-11-20", wasteType: "Aluminum Cans", quantity: 7, price: 3000 },
  { date: "2026-01-12", wasteType: "Plastic Bottles", quantity: 10, price: 2500 },
  { date: "2026-02-28", wasteType: "Aluminum Cans", quantity: 5, price: 3000 },
  { date: "2026-04-05", wasteType: "Plastic Bottles", quantity: 9, price: 2500 }
];

// ============================================================================
// SUMMARY: Total 36 collections across 5 students
// ============================================================================
// STU001: 8 collections - Total: Rp 79,500 (40 kg)
// STU002: 6 collections - Total: Rp 86,000 (60 kg)  
// STU003: 5 collections - Total: Rp 92,500 (23 kg)
// STU004: 10 collections - Total: Rp 174,500 (84 kg)
// STU005: 7 collections - Total: Rp 90,500 (49 kg)
// ============================================================================
// GRAND TOTAL: 36 collections, Rp 523,000, 256 kg
// ============================================================================

// To add to Firebase, use the Firestore Console or run a script that calls:
// - studentService.addStudent() for each student
// - wasteCollectionService.addCollection() for each collection

// Sample code to add collections (would need to run in app context):
/*
import { studentService } from './services/students';
import { wasteCollectionService } from './services/wasteCollections';

// Add students first, then collections
for (const student of students) {
  await studentService.addStudent(student);
}

// Add collections (need student IDs from Firestore after adding students)
const studentMap = {
  "AHMAD FAISAL": "STU001_DOC_ID",
  "SITI RAHAYU": "STU002_DOC_ID",
  // etc...
};

for (const col of stu001_collections) {
  await wasteCollectionService.addCollection({
    date: col.date,
    studentId: "STU001",
    studentName: "AHMAD FAISAL",
    studentGrade: "7.1",
    wasteTypeId: getWasteTypeId(col.wasteType),
    wasteTypeName: col.wasteType,
    quantity: col.quantity,
    pricePerKg: col.price,
    earnings: col.quantity * col.price,
    recordedBy: "admin"
  }, "admin_uid");
}
*/
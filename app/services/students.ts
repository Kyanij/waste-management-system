import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  type DocumentData
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Student {
  id: string;
  studentId: string;
  name: string;
  gender: string;
  gradeLevel: string;
  dateAdded: string;
  createdAt?: Timestamp | null;
}

const COLLECTION = 'students';

export const studentService = {
  async getStudents(pageSize: number = 10, lastDoc?: any): Promise<{ students: Student[]; lastDocument: any }> {
    let q = query(
      collection(db, COLLECTION),
      orderBy('name'),
      firestoreLimit(pageSize)
    );
    
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    
    const snapshot = await getDocs(q);
    const students = snapshot.docs.map(doc => mapDocToStudent(doc)) as Student[];
    
    return {
      students,
      lastDocument: snapshot.docs[snapshot.docs.length - 1]
    };
  },

  async getStudentById(id: string): Promise<Student | null> {
    const docRef = doc(db, COLLECTION, id);
    const snapshot = await getDoc(docRef);
    
    if (!snapshot.exists()) return null;
    return mapDocToStudent(snapshot) as Student;
  },

  async getStudentByStudentId(studentId: string): Promise<Student | null> {
    const q = query(
      collection(db, COLLECTION),
      where('studentId', '==', studentId)
    );
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return mapDocToStudent(snapshot.docs[0]) as Student;
  },

  async addStudent(student: Omit<Student, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...student,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  async updateStudent(id: string, data: Partial<Student>): Promise<void> {
    const { createdAt, ...updateData } = data;
    await updateDoc(doc(db, COLLECTION, id), {
      ...updateData,
      updatedAt: serverTimestamp()
    });
  },

  async deleteStudent(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  },

  async searchStudents(searchTerm: string): Promise<Student[]> {
    const allStudents = await studentService.getStudents(100);
    
    const term = searchTerm.toLowerCase();
    return allStudents.students.filter(s => 
      s.name.toLowerCase().includes(term) ||
      s.studentId.toLowerCase().includes(term) ||
      s.email.toLowerCase().includes(term)
    );
  },

  subscribeToStudents(callback: (students: Student[]) => void): () => void {
    const q = query(collection(db, COLLECTION), orderBy('name'));
    
    return onSnapshot(q, (snapshot) => {
      const students = snapshot.docs.map(doc => mapDocToStudent(doc)) as Student[];
      callback(students);
    });
  },

  subscribeToStudentById(id: string, callback: (student: Student | null) => void): () => void {
    const docRef = doc(db, COLLECTION, id);
    
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(mapDocToStudent(snapshot) as Student);
      } else {
        callback(null);
      }
    });
  }
};

function mapDocToStudent(doc: any): Student {
  const data = doc.data();
  return {
    id: doc.id,
    studentId: data.studentId || '',
    name: data.name || '',
    gender: data.gender || '',
    gradeLevel: data.gradeLevel || '',
    dateAdded: data.dateAdded || '',
    createdAt: data.createdAt || null
  };
}

export default studentService;
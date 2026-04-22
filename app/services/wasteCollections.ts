import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface WasteCollection {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  studentGrade: string;
  wasteTypeId: string;
  wasteTypeName: string;
  quantity: number;
  pricePerKg: number;
  earnings: number;
  recordedBy: string;
  createdAt: string;
}

const COLLECTION = 'wasteCollections';

export const wasteCollectionService = {
  async getCollections(
    pageSize: number = 10, 
    lastDoc?: any
  ): Promise<{ collections: WasteCollection[]; lastDocument: any }> {
    const q = query(
      collection(db, COLLECTION),
      orderBy('date', 'desc'),
      firestoreLimit(pageSize)
    );
    
    const snapshot = await getDocs(q);
    const collections = snapshot.docs.map(doc => mapDocToCollection(doc)) as WasteCollection[];
    
    return {
      collections,
      lastDocument: snapshot.docs[snapshot.docs.length - 1]
    };
  },

  async getCollectionById(id: string): Promise<WasteCollection | null> {
    const snapshot = await getDocs(query(collection(db, COLLECTION), where('__name__', '==', id)));
    
    if (snapshot.empty) return null;
    return mapDocToCollection(snapshot.docs[0]) as WasteCollection;
  },

  async addCollection(
    data: Omit<WasteCollection, 'id' | 'createdAt'>,
    adminUid: string
  ): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      date: Timestamp.fromDate(new Date(data.date)),
      recordedBy: adminUid,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  async updateCollection(id: string, data: Partial<WasteCollection>): Promise<void> {
    const { createdAt, id: _, ...updateData } = data;
    await updateDoc(doc(db, COLLECTION, id), {
      ...updateData,
      updatedAt: serverTimestamp()
    });
  },

  async deleteCollection(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  },

  async searchCollections(searchTerm: string): Promise<WasteCollection[]> {
    const all = await wasteCollectionService.getCollections(100);
    
    const term = searchTerm.toLowerCase();
    return all.collections.filter(c => 
      c.studentName.toLowerCase().includes(term) ||
      c.studentId.toLowerCase().includes(term) ||
      c.wasteTypeName.toLowerCase().includes(term)
    );
  },

  subscribeToCollections(callback: (collections: WasteCollection[]) => void): () => void {
    const q = query(collection(db, COLLECTION), orderBy('date', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const collections = snapshot.docs.map(doc => mapDocToCollection(doc)) as WasteCollection[];
      callback(collections);
    });
  },

  subscribeToCollectionsByStudent(
    studentId: string,
    callback: (collections: WasteCollection[]) => void
  ): () => void {
    const q = query(
      collection(db, COLLECTION),
      where('studentId', '==', studentId),
      orderBy('date', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const collections = snapshot.docs.map(doc => mapDocToCollection(doc)) as WasteCollection[];
      callback(collections);
    });
  },

  async getCollectionsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<WasteCollection[]> {
    const q = query(
      collection(db, COLLECTION),
      where('date', '>=', Timestamp.fromDate(startDate)),
      where('date', '<=', Timestamp.fromDate(endDate)),
      orderBy('date', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => mapDocToCollection(doc)) as WasteCollection[];
  }
};

function mapDocToCollection(doc: any): WasteCollection {
  const data = doc.data();
  return {
    id: doc.id,
    date: data.date?.toDate?.()?.toISOString()?.split('T')[0] || '',
    studentId: data.studentId || '',
    studentName: data.studentName || '',
    studentGrade: data.studentGrade || '',
    wasteTypeId: data.wasteTypeId || '',
    wasteTypeName: data.wasteTypeName || '',
    quantity: data.quantity || 0,
    pricePerKg: data.pricePerKg || 0,
    earnings: data.earnings || 0,
    recordedBy: data.recordedBy || '',
    createdAt: data.createdAt?.toDate?.()?.toISOString() || ''
  };
}

export default wasteCollectionService;
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
  onSnapshot,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface WasteType {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

const COLLECTION = 'wasteTypes';

export const wasteTypeService = {
  async getWasteTypes(): Promise<WasteType[]> {
    const q = query(collection(db, COLLECTION), orderBy('name'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => mapDocToWasteType(doc)) as WasteType[];
  },

  async getWasteTypeById(id: string): Promise<WasteType | null> {
    const docRef = doc(db, COLLECTION, id);
    const snapshot = await getDoc(docRef);
    
    if (!snapshot.exists()) return null;
    return mapDocToWasteType(snapshot) as WasteType;
  },

  async getActiveWasteTypes(): Promise<WasteType[]> {
    const q = query(
      collection(db, COLLECTION), 
      where('status', '==', 'active'),
      orderBy('name')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => mapDocToWasteType(doc)) as WasteType[];
  },

  async addWasteType(wasteType: Omit<WasteType, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...wasteType,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  async updateWasteType(id: string, data: Partial<WasteType>): Promise<void> {
    const { createdAt, updatedAt, ...updateData } = data;
    await updateDoc(doc(db, COLLECTION, id), {
      ...updateData,
      updatedAt: serverTimestamp()
    });
  },

  async deleteWasteType(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  },

  async toggleStatus(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    const snapshot = await getDoc(docRef);
    const currentStatus = snapshot.data()?.status;
    
    await updateDoc(docRef, {
      status: currentStatus === 'active' ? 'inactive' : 'active',
      updatedAt: serverTimestamp()
    });
  },

  subscribeToWasteTypes(callback: (types: WasteType[]) => void): () => void {
    const q = query(collection(db, COLLECTION), orderBy('name'));
    
    return onSnapshot(q, (snapshot) => {
      const types = snapshot.docs.map(doc => mapDocToWasteType(doc)) as WasteType[];
      callback(types);
    });
  },

  subscribeToActiveWasteTypes(callback: (types: WasteType[]) => void): () => void {
    const q = query(
      collection(db, COLLECTION), 
      where('status', '==', 'active'),
      orderBy('name')
    );
    
    return onSnapshot(q, (snapshot) => {
      const types = snapshot.docs.map(doc => mapDocToWasteType(doc)) as WasteType[];
      callback(types);
    });
  }
};

function mapDocToWasteType(doc: any): WasteType {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name || '',
    nameEn: data.nameEn || '',
    price: data.price || 0,
    status: data.status || 'active',
    createdAt: data.createdAt?.toDate?.()?.toISOString() || '',
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || ''
  };
}

export default wasteTypeService;
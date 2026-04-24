import { 
  collection, 
  query, 
  where, 
  getDocs,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface DashboardStats {
  totalWasteCollected: number;
  totalEarnings: number;
  activeStudents: number;
  totalRecords: number;
  weeklyData: { day: string; collected: number; target: number }[];
  wasteByCategory: { name: string; value: number; color: string }[];
  topClasses: { name: string; studentCount: number; totalCollected: number }[];
  topStudents: { name: string; studentClass: string; totalCollected: number; collectionsCount: number }[];
}

const CATEGORY_COLORS: Record<string, string> = {
  'Plastic Bottle': '#4facfe',
  'Plastic Bottles': '#4facfe',
  'Paper Waste': '#f093fb',
  'Paper': '#f093fb',
  'Aluminum Can': '#f5af19',
  'Cans': '#f5af19',
  'Metal': '#f5af19',
  'Glass Bottle': '#43e97b',
  'Glass': '#43e97b',
  'Organic Waste': '#fa709a',
  'Organic': '#fa709a',
  'E-Waste': '#667eea',
  'Cardboard': '#f093fb',
  'Metal Scraps': '#f5af19',
};

function parseFirestoreDate(dateValue: any): string {
  if (!dateValue) return '';
  if (typeof dateValue === 'string') {
    return dateValue.split('T')[0];
  }
  if (dateValue.toDate && typeof dateValue.toDate === 'function') {
    return dateValue.toDate().toISOString().split('T')[0];
  }
  if (dateValue.seconds) {
    const date = new Date(dateValue.seconds * 1000);
    return date.toISOString().split('T')[0];
  }
  return String(dateValue);
}

function getStartDate(period: string, now: Date): Date {
  switch (period) {
    case 'today':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case 'week':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case 'month':
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case 'year':
      return new Date(now.getFullYear(), 0, 1);
    default:
      return new Date(now.getFullYear(), now.getMonth(), 1);
  }
}

export const analyticsService = {
  async getDashboardStats(period: 'today' | 'week' | 'month' | 'year', weeklyView: string = 'week'): Promise<DashboardStats> {
    const now = new Date();
    const startDate = getStartDate(period, now);
    
    const collectionsRef = collection(db, 'wasteCollections');
    const allSnapshot = await getDocs(query(collectionsRef, orderBy('date', 'desc')));
    
    const startDateStr = startDate.toISOString().split('T')[0];
    const nowDateStr = now.toISOString().split('T')[0];
    
    console.log('Analytics date range:', startDateStr, 'to', nowDateStr, 'period:', period);
    
    let totalWeight = 0;
    let totalEarnings = 0;
    let totalRecords = 0;
    const studentMap = new Map<string, { name: string; grade: string; total: number; count: number }>();
    const categoryMap = new Map<string, number>();
    const dailyMap = new Map<string, number>();
    
    allSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const collectionDate = parseFirestoreDate(data.date);
      
      if (collectionDate >= startDateStr && collectionDate <= nowDateStr) {
        const qty = Number(data.quantity) || 0;
        const earn = Number(data.earnings) || 0;
        
        totalWeight += qty;
        totalEarnings += earn;
        totalRecords++;
        
        dailyMap.set(collectionDate, (dailyMap.get(collectionDate) || 0) + qty);
        
        if (!studentMap.has(data.studentId)) {
          studentMap.set(data.studentId, {
            name: data.studentName || '',
            grade: data.studentGrade || '',
            total: 0,
            count: 0
          });
        }
        const student = studentMap.get(data.studentId)!;
        student.total += qty;
        student.count += 1;
        
        const cat = data.wasteTypeName || 'Other';
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + qty);
      }
    });
    
    const activeStudents = studentMap.size;
    
    const weeklyData = this.generateWeeklyDataFromMap(dailyMap, weeklyView);
    
    // Prepare category breakdown
    const wasteByCategory = Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value: Math.round(value * 10) / 10,
      color: CATEGORY_COLORS[name] || '#cccccc'
    }));
    
    // Top students (all time)
    const topStudents = Array.from(studentMap.entries())
      .map(([id, data]) => ({
        name: data.name,
        studentClass: data.grade,
        totalCollected: Math.round(data.total * 10) / 10,
        collectionsCount: data.count
      }))
      .sort((a, b) => b.totalCollected - a.totalCollected)
      .slice(0, 5);
    
    // Class data - aggregate from students collection
    const studentsRef = collection(db, 'students');
    const studentsSnapshot = await getDocs(studentsRef);
    const classMap = new Map<string, { count: number; total: number }>();
    
    studentsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const grade = data.gradeLevel || 'Unknown';
      if (!classMap.has(grade)) {
        classMap.set(grade, { count: 0, total: 0 });
      }
      const cls = classMap.get(grade)!;
      cls.count += 1;
    });
    
    // Aggregate class totals from collections
    studentMap.forEach((data) => {
      const grade = data.grade || 'Unknown';
      if (classMap.has(grade)) {
        classMap.get(grade)!.total += data.total;
      }
    });
    
    const topClasses = Array.from(classMap.entries())
      .map(([name, data]) => ({
        name: `Class ${name}`,
        studentCount: data.count,
        totalCollected: Math.round(data.total * 10) / 10
      }))
      .sort((a, b) => b.totalCollected - a.totalCollected)
      .slice(0, 5);
    
    return {
      totalWasteCollected: Math.round(totalWeight * 10) / 10,
      totalEarnings: Math.round(totalEarnings * 100) / 100,
      activeStudents,
      totalRecords,
      weeklyData,
      wasteByCategory,
      topClasses,
      topStudents
    };
  },

  generateWeeklyDataFromMap(dailyMap: Map<string, number>, view: string = 'week'): { day: string; collected: number; target: number }[] {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result: { day: string; collected: number; target: number }[] = [];
    
    let numPoints: number;
    let isMonthly = view === 'month';
    let isYearly = view === 'year';
    
    if (isYearly) {
      numPoints = 12;
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        let collected = 0;
        dailyMap.forEach((value, dateKey) => {
          if (dateKey.startsWith(monthKey)) {
            collected += value;
          }
        });
        result.push({
          day: months[date.getMonth()],
          collected: Math.round(collected * 10) / 10,
          target: 200
        });
      }
    } else if (isMonthly) {
      numPoints = 4;
      for (let i = 3; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - (i * 7));
        const dateStr = date.toISOString().split('T')[0];
        const dayName = days[date.getDay()];
        const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
        let collected = 0;
        dailyMap.forEach((value, dateKey) => {
          const keyDate = new Date(dateKey);
          const keyDayOfYear = Math.floor((keyDate.getTime() - new Date(keyDate.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
          if (Math.abs(keyDayOfYear - dayOfYear) < 7) {
            collected += value;
          }
        });
        result.push({
          day: dayName,
          collected: Math.round(collected * 10) / 10,
          target: 120
        });
      }
    } else {
      numPoints = 7;
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = days[date.getDay()];
        const collected = dailyMap.get(dateStr) || 0;
        
        result.push({
          day: dayName,
          collected: Math.round(collected * 10) / 10,
          target: 80
        });
      }
    }
    
    return result;
  },

  subscribeToDashboardStats(
    period: 'today' | 'week' | 'month' | 'year',
    callback: (stats: DashboardStats) => void
  ): () => void {
    const collectionsRef = collection(db, 'wasteCollections');
    const q = query(collectionsRef, orderBy('date', 'desc'));
    
    const unsubscribe = onSnapshot(q, () => {
      this.getDashboardStats(period).then(callback);
    });
    
    return unsubscribe;
  }
};

export default analyticsService;
import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { format, startOfWeek, startOfMonth, isWithinInterval, subMonths, parseISO, isThisWeek, isThisMonth } from 'date-fns';
import { AppSidebar } from '../AppSidebar/AppSidebar';
import './AdminDashboard.css';

interface Collection {
  id: string;
  studentName: string;
  studentClass: string;
  wasteType: string;
  weight: number;
  date: string;
  points: number;
}

interface Student {
  id: string;
  name: string;
  studentClass: string;
  totalCollected: number;
  collectionsCount: number;
}

interface ClassData {
  id: string;
  name: string;
  studentCount: number;
  totalCollected: number;
}

interface WeeklyData {
  day: string;
  collected: number;
  target: number;
}

const mockCollections: Collection[] = [
  { id: '1', studentName: 'Sarah Johnson', studentClass: '10A', wasteType: 'Plastic', weight: 5.2, date: '2024-01-15T10:30:00', points: 52 },
  { id: '2', studentName: 'Michael Chen', studentClass: '9C', wasteType: 'Paper', weight: 3.8, date: '2024-01-15T11:00:00', points: 38 },
  { id: '3', studentName: 'Emma Davis', studentClass: '11B', wasteType: 'Metal', weight: 2.1, date: '2024-01-15T11:30:00', points: 42 },
  { id: '4', studentName: 'James Wilson', studentClass: '10A', wasteType: 'Glass', weight: 4.5, date: '2024-01-15T12:00:00', points: 45 },
  { id: '5', studentName: 'Olivia Brown', studentClass: '8A', wasteType: 'Organic', weight: 12.0, date: '2024-01-14T14:00:00', points: 120 },
  { id: '6', studentName: 'William Lee', studentClass: '10A', wasteType: 'Plastic', weight: 6.2, date: '2024-01-14T10:00:00', points: 62 },
  { id: '7', studentName: 'Sophia Martinez', studentClass: '9C', wasteType: 'E-Waste', weight: 1.5, date: '2024-01-13T15:00:00', points: 75 },
  { id: '8', studentName: 'Benjamin Taylor', studentClass: '11B', wasteType: 'Paper', weight: 8.5, date: '2024-01-13T11:00:00', points: 85 },
  { id: '9', studentName: 'Mia Anderson', studentClass: '8A', wasteType: 'Plastic', weight: 4.0, date: '2024-01-12T09:30:00', points: 40 },
  { id: '10', studentName: 'Lucas Thomas', studentClass: '10A', wasteType: 'Metal', weight: 3.2, date: '2024-01-12T14:00:00', points: 64 },
  { id: '11', studentName: 'Charlotte Jackson', studentClass: '9C', wasteType: 'Glass', weight: 5.8, date: '2024-01-11T10:30:00', points: 58 },
  { id: '12', studentName: 'Henry White', studentClass: '11B', wasteType: 'Organic', weight: 15.0, date: '2024-01-11T13:00:00', points: 150 },
];

const mockStudents: Student[] = [
  { id: '1', name: 'Sarah Johnson', studentClass: '10A', totalCollected: 156, collectionsCount: 42 },
  { id: '2', name: 'Michael Chen', studentClass: '9C', totalCollected: 142, collectionsCount: 38 },
  { id: '3', name: 'Emma Davis', studentClass: '11B', totalCollected: 138, collectionsCount: 35 },
  { id: '4', name: 'James Wilson', studentClass: '10A', totalCollected: 125, collectionsCount: 30 },
  { id: '5', name: 'Olivia Brown', studentClass: '8A', totalCollected: 118, collectionsCount: 28 },
];

const mockClasses: ClassData[] = [
  { id: '1', name: 'Class 10A', studentCount: 42, totalCollected: 1250 },
  { id: '2', name: 'Class 9C', studentCount: 38, totalCollected: 1180 },
  { id: '3', name: 'Class 11B', studentCount: 35, totalCollected: 1050 },
  { id: '4', name: 'Class 8A', studentCount: 40, totalCollected: 980 },
  { id: '5', name: 'Class 12C', studentCount: 30, totalCollected: 890 },
];

const weeklyData = [
  { day: 'Mon', collected: 65, target: 80 },
  { day: 'Tue', collected: 78, target: 80 },
  { day: 'Wed', collected: 90, target: 80 },
  { day: 'Thu', collected: 81, target: 80 },
  { day: 'Fri', collected: 156, target: 80 },
  { day: 'Sat', collected: 140, target: 80 },
  { day: 'Sun', collected: 165, target: 80 },
];

const wasteCategoryData = [
  { name: 'Plastic', value: 2340, color: '#4facfe' },
  { name: 'Paper', value: 1890, color: '#f093fb' },
  { name: 'Metal', value: 1456, color: '#f5af19' },
  { name: 'Glass', value: 980, color: '#43e97b' },
  { name: 'Organic', value: 876, color: '#fa709a' },
  { name: 'E-Waste', value: 342, color: '#667eea' },
];

const wasteTypeCards = [
  { type: 'Plastic', value: '2,340 kg', progress: 78, color: '#4facfe' },
  { type: 'Paper & Cardboard', value: '1,890 kg', progress: 63, color: '#f093fb' },
  { type: 'Metal & Aluminum', value: '1,456 kg', progress: 48, color: '#f5af19' },
  { type: 'Glass', value: '980 kg', progress: 33, color: '#43e97b' },
  { type: 'Organic Waste', value: '876 kg', progress: 29, color: '#fa709a' },
  { type: 'E-Waste', value: '342 kg', progress: 11, color: '#667eea' },
];

const navItems = [
  { id: 'dashboard', icon: 'fa-home', label: 'Dashboard', route: '/dashboard' },
  { id: 'students', icon: 'fa-users', label: 'Manage Students', route: '/manage-student' },
  { id: 'collection', icon: 'fa-trash-alt', label: 'Record Collection' },
  { id: 'reports', icon: 'fa-chart-bar', label: 'Reports & Analytics' },
  { id: 'rewards', icon: 'fa-gift', label: 'Rewards & Incentives' },
  { id: 'settings', icon: 'fa-cog', label: 'Settings' },
];

type DateRange = 'today' | 'week' | 'month' | 'semester' | 'custom';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [dateRange, setDateRange] = useState<DateRange>('month');
  const [customFrom, setCustomFrom] = useState('2024-01-01');
  const [customTo, setCustomTo] = useState('2024-01-15');
  const [language, setLanguage] = useState<'en' | 'id'>('en');

  const isLangEn = language === 'en';

  const filteredCollections = useMemo(() => {
    const now = new Date();
    return mockCollections.filter((collection) => {
      const date = parseISO(collection.date);
      switch (dateRange) {
        case 'today':
          return format(date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
        case 'week':
          return isThisWeek(date);
        case 'month':
          return isThisMonth(date);
        case 'semester':
          return isWithinInterval(date, { start: subMonths(now, 6), end: now });
        case 'custom':
          return isWithinInterval(date, { start: parseISO(customFrom), end: parseISO(customTo) });
        default:
          return true;
      }
    });
  }, [dateRange, customFrom, customTo]);

  const stats = useMemo(() => {
    const totalWaste = filteredCollections.reduce((sum, c) => sum + c.weight, 0);
    const totalEarnings = totalWaste * 0.5;
    const activeStudents = new Set(filteredCollections.map((c) => c.studentName)).size;
    const recyclingRate = 89.4;
    return { totalWaste, totalEarnings, activeStudents, recyclingRate };
  }, [filteredCollections]);

  const filteredWeeklyData = useMemo(() => {
    return weeklyData;
  }, [filteredCollections]);

  const handleNavClick = useCallback((item: typeof navItems[0]) => {
    if (item.route) {
      navigate(item.route);
    } else {
      setActiveNav(item.id);
    }
  }, [navigate]);

  const labels = {
    dashboard: isLangEn ? 'Dashboard Overview' : 'Ikhtisar Dashboard',
    welcome: isLangEn ? "Welcome back! Here's what's happening on campus." : 'Selamat datang! Berikut yang terjadi di kampus.',
    search: isLangEn ? 'Search students, classes...' : 'Cari siswa, kelas...',
    newRecord: isLangEn ? 'New Record' : 'Rekor Baru',
    totalWaste: isLangEn ? 'Total Waste Collected' : 'Total Sampah Dikumpulkan',
    totalEarnings: isLangEn ? 'Total Earnings' : 'Total Penghasilan',
    activeStudents: isLangEn ? 'Active Students' : 'Siswa Aktif',
    recyclingRate: isLangEn ? 'Recycling Rate' : 'Tingkat Daur Ulang',
    weeklyTrend: isLangEn ? 'Weekly Collection Trend' : 'Tren Pengumpulan Mingguan',
    wasteCategory: isLangEn ? 'Waste by Category' : 'Sampah per Kategori',
    topClasses: isLangEn ? 'Top Collecting Classes' : 'Kelas Pengumpulan Tertinggi',
    topStudents: isLangEn ? 'Top Student Collectors' : 'Pengumpul Siswa Terbaik',
    recentActivity: isLangEn ? 'Recent Collection Activity' : 'Aktivitas Pengumpulan Terbaru',
    students: isLangEn ? 'students' : 'siswa',
    collected: isLangEn ? 'collected' : 'dikumpulkan',
    points: isLangEn ? 'pts' : 'poin',
    today: isLangEn ? 'Today' : 'Hari Ini',
    thisWeek: isLangEn ? 'This Week' : 'Minggu Ini',
    thisMonth: isLangEn ? 'This Month' : 'Bulan Ini',
    thisSemester: isLangEn ? 'This Semester' : 'Semester Ini',
    custom: isLangEn ? 'Custom Range' : 'Rentang Khusus',
  };

  const formatCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
  };

  return (
    <div className="admin-dashboard">
      {/* Background */}
      <div className="admin-bg-animation">
        <div className="admin-particle particle-1"></div>
        <div className="admin-particle particle-2"></div>
        <div className="admin-particle particle-3"></div>
      </div>
      <div className="admin-grid-overlay"></div>

      {/* Shared Sidebar */}
      <AppSidebar activeNav="dashboard" />

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-top-bar">
          <div className="admin-page-title">
            <h2>{labels.dashboard}</h2>
            <p>{labels.welcome}</p>
          </div>
          <div className="admin-header-right">
            <div className="admin-date-display">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {formatCurrentDate()}
            </div>
            <div className="admin-lang-switch">
              <div 
                className="admin-lang-slider" 
                style={{ width: isLangEn ? 'calc(50% - 4px)' : 'calc(50% - 4px)', left: isLangEn ? '4px' : '50%' }}
              />
              <span className={`admin-lang-option ${isLangEn ? 'active' : ''}`} onClick={() => setLanguage('en')}>EN</span>
              <span className={`admin-lang-option ${!isLangEn ? 'active' : ''}`} onClick={() => setLanguage('id')}>ID</span>
            </div>
          </div>
        </div>
        
        <div className="admin-date-filter-row">
          <div className="admin-date-filter">
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value as DateRange)}
              className="admin-date-select"
            >
              <option value="today">{labels.today}</option>
              <option value="week">{labels.thisWeek}</option>
              <option value="month">{labels.thisMonth}</option>
              <option value="semester">{labels.thisSemester}</option>
              <option value="custom">{labels.custom}</option>
            </select>
            {dateRange === 'custom' && (
              <div className="admin-custom-dates">
                <input 
                  type="date" 
                  value={customFrom} 
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="admin-date-input"
                />
                <span>to</span>
                <input 
                  type="date" 
                  value={customTo} 
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="admin-date-input"
                />
              </div>
            )}
</div>
        </div>
        
        {/* Stats Grid */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card animate-in delay-1">
            <div className="admin-stat-header">
              <div className="admin-stat-icon icon-waste">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
                </svg>
              </div>
              <div className="admin-stat-trend trend-up">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                </svg>
                <span>+12%</span>
              </div>
            </div>
            <div className="admin-stat-value">{stats.totalWaste.toFixed(0)} kg</div>
            <div className="admin-stat-label">{labels.totalWaste}</div>
          </div>

          <div className="admin-stat-card animate-in delay-2">
            <div className="admin-stat-header">
              <div className="admin-stat-icon icon-earnings">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                </svg>
              </div>
              <div className="admin-stat-trend trend-up">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                </svg>
                <span>+8%</span>
              </div>
            </div>
            <div className="admin-stat-value">${stats.totalEarnings.toFixed(0)}</div>
            <div className="admin-stat-label">{labels.totalEarnings}</div>
          </div>

          <div className="admin-stat-card animate-in delay-3">
            <div className="admin-stat-header">
              <div className="admin-stat-icon icon-students">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                </svg>
              </div>
              <div className="admin-stat-trend trend-up">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                </svg>
                <span>+3</span>
              </div>
            </div>
            <div className="admin-stat-value">{stats.activeStudents}</div>
            <div className="admin-stat-label">{labels.activeStudents}</div>
          </div>

          <div className="admin-stat-card animate-in delay-4">
            <div className="admin-stat-header">
              <div className="admin-stat-icon icon-recycling">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L4 7v10l8 5 8-5V7L12 2z"/>
                </svg>
              </div>
              <div className="admin-stat-trend trend-up">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                </svg>
                <span>+15%</span>
              </div>
            </div>
            <div className="admin-stat-value">{stats.recyclingRate}%</div>
            <div className="admin-stat-label">{labels.recyclingRate}</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="admin-charts-grid">
          <div className="admin-chart-card">
            <div className="admin-chart-header">
              <h3 className="admin-chart-title">{labels.weeklyTrend}</h3>
              <div className="admin-chart-actions">
                <button className="admin-chart-filter active">Week</button>
                <button className="admin-chart-filter">Month</button>
                <button className="admin-chart-filter">Year</button>
              </div>
            </div>
            <div className="admin-chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredWeeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ background: '#ffffff', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '8px' }}
                    labelStyle={{ color: '#1e293b' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="collected" 
                    stroke="#00b894" 
                    strokeWidth={3}
                    dot={{ fill: '#00b894', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="rgba(255,255,255,0.2)" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="admin-chart-card">
            <div className="admin-chart-header">
              <h3 className="admin-chart-title">{labels.wasteCategory}</h3>
            </div>
            <div className="admin-chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={wasteCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {wasteCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: '#ffffff', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '8px' }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Waste Type Cards */}
        <div className="admin-waste-grid">
          {wasteTypeCards.map((card, index) => (
            <div key={index} className="admin-waste-card" style={{ '--type-color': card.color } as React.CSSProperties}>
              <div className="admin-waste-icon" style={{ background: `${card.color}20`, color: card.color }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
                </svg>
              </div>
              <div className="admin-waste-value" style={{ color: card.color }}>{card.value}</div>
              <div className="admin-waste-label">{card.type}</div>
              <div className="admin-waste-bar">
                <div className="admin-waste-progress" style={{ width: `${card.progress}%`, background: card.color }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Leaderboards */}
        <div className="admin-leaderboard-section">
          <div className="admin-leaderboard-card">
            <div className="admin-leaderboard-header">
              <h3 className="admin-leaderboard-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/>
                  <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 1012 0V2z"/>
                </svg>
                {labels.topClasses}
              </h3>
            </div>
            <ul className="admin-leaderboard-list">
              {mockClasses.map((cls, index) => (
                <li key={cls.id} className="admin-leaderboard-item">
                  <div className={`admin-rank rank-${index < 3 ? index + 1 : 'other'}`}>{index + 1}</div>
                  <div className="admin-leaderboard-info">
                    <div className="admin-leaderboard-name">{cls.name}</div>
                    <div className="admin-leaderboard-meta">{cls.studentCount} {labels.students} active</div>
                  </div>
                  <div className="admin-leaderboard-score">
                    <div className="admin-leaderboard-score-value">{cls.totalCollected} kg</div>
                    <div className="admin-leaderboard-score-label">{labels.collected}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="admin-leaderboard-card">
            <div className="admin-leaderboard-header">
              <h3 className="admin-leaderboard-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                {labels.topStudents}
              </h3>
            </div>
            <ul className="admin-leaderboard-list">
              {mockStudents.map((student, index) => (
                <li key={student.id} className="admin-leaderboard-item">
                  <div className={`admin-rank rank-${index < 3 ? index + 1 : 'other'}`}>{index + 1}</div>
                  <div className="admin-leaderboard-info">
                    <div className="admin-leaderboard-name">{student.name}</div>
                    <div className="admin-leaderboard-meta">{student.studentClass} • {student.collectionsCount} collections</div>
                  </div>
                  <div className="admin-leaderboard-score">
                    <div className="admin-leaderboard-score-value">{student.totalCollected} kg</div>
                    <div className="admin-leaderboard-score-label">{labels.collected}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="admin-activity-card">
          <div className="admin-activity-header">
            <h3 className="admin-chart-title">{labels.recentActivity}</h3>
          </div>
          <ul className="admin-activity-list">
            {filteredCollections.slice(0, 5).map((activity) => (
              <li key={activity.id} className="admin-activity-item">
                <div className="admin-activity-icon" style={{ background: `${wasteCategoryData.find(w => w.name === activity.wasteType)?.color}20`, color: wasteCategoryData.find(w => w.name === activity.wasteType)?.color }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
                  </svg>
                </div>
                <div className="admin-activity-details">
                  <div className="admin-activity-title">{activity.studentName} collected {activity.weight}kg of {activity.wasteType}</div>
                  <div className="admin-activity-time">{activity.studentClass}</div>
                </div>
                <div className="admin-activity-points">+{activity.points} {labels.points}</div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
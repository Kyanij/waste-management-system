import { useNavigate } from 'react-router';
import { useI18n } from '../../lib/i18n';
import './AppSidebar.css';

interface NavItem {
  id: string;
  icon: string;
  label: string;
  labelId: string;
  route?: string;
}

interface AppSidebarProps {
  activeNav?: string;
  onNavigate?: (item: NavItem) => void;
}

const navItems: NavItem[] = [
  { id: 'dashboard', icon: 'fa-home', label: 'Dashboard', labelId: 'navDashboard', route: '/dashboard' },
  { id: 'students', icon: 'fa-user-graduate', label: 'Manage Students', labelId: 'navStudents', route: '/manage-student' },
  { id: 'wasteTypes', icon: 'fa-tags', label: 'Waste Types', labelId: 'navWasteTypes', route: '/waste-types' },
  { id: 'collection', icon: 'fa-recycle', label: 'Waste Collection', labelId: 'navCollection', route: '/waste-collection' },
  { id: 'reports', icon: 'fa-chart-bar', label: 'Reports & Analytics', labelId: 'navReports' },
  { id: 'settings', icon: 'fa-cog', label: 'Settings', labelId: 'navSettings' },
];

const translations = {
  en: {
    navDashboard: 'Dashboard',
    navStudents: 'Manage Students',
    navWasteTypes: 'Waste Types',
    navCollection: 'Waste Collection',
    navReports: 'Reports & Analytics',
    navSettings: 'Settings',
    appLogo: 'EcoCampus',
    appSubtitle: 'Admin Dashboard',
    userName: 'Admin User',
    userEmail: 'admin@ecocampus.com',
  },
  id: {
    navDashboard: 'Dasbor',
    navStudents: 'Kelola Siswa',
    navWasteTypes: 'Jenis Limbah',
    navCollection: 'Pengumpulan Limbah',
    navReports: 'Laporan & Analitik',
    navSettings: 'Pengaturan',
    appLogo: 'EcoCampus',
    appSubtitle: 'Admin Dasbor',
    userName: 'Admin',
    userEmail: 'admin@ecocampus.com',
  }
};

export function AppSidebar({ activeNav = 'dashboard', onNavigate }: AppSidebarProps) {
  const navigate = useNavigate();
  const { language } = useI18n();
  const t = translations[language === 'id' ? 'id' : 'en'];

  const handleNavClick = (item: NavItem) => {
    if (onNavigate) {
      onNavigate(item);
    } else if (item.route) {
      navigate(item.route);
    }
  };

  return (
    <aside className="app-sidebar">
      {/* Logo Section */}
      <div className="app-sidebar-logo-section">
        <div className="app-sidebar-logo">
          <div className="app-sidebar-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L4 7v10l8 5 8-5V7L12 2z"/>
            </svg>
          </div>
          <div className="app-sidebar-logo-text">
            <h1>{t.appLogo}</h1>
            <p>{t.appSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="app-sidebar-nav">
        {navItems.map((item) => (
          <div key={item.id} className="app-sidebar-nav-item">
            <button 
              className={`app-sidebar-nav-link ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item)}
            >
              <i className={`fas ${item.icon}`}></i>
              <span>{t[item.labelId as keyof typeof t]}</span>
              {activeNav === item.id && <span className="app-sidebar-active-dot"></span>}
            </button>
          </div>
        ))}
      </nav>

      {/* Footer - User Profile */}
      <div className="app-sidebar-footer">
        <div className="app-sidebar-user-profile">
          <div className="app-sidebar-user-avatar">
            {t.userName.charAt(0)}
          </div>
          <div className="app-sidebar-user-info">
            <h4>{t.userName}</h4>
            <p>{t.userEmail}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AppSidebar;
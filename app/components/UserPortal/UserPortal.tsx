import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faGraduationCap, faIdCard, faRecycle,
  faCalendarAlt, faDownload, faChevronRight, faLeaf,
  faWineBottle, faNewspaper, faPrescriptionBottle, faLaptop,
  faWineGlass, faAppleAlt, faBox, faCogs, faGlobe, faClock,
  faScaleBalanced, faMoneyBillWave, faList, faFileAlt,
  faExclamationCircle, faCheck
} from '@fortawesome/free-solid-svg-icons';
import { useI18n } from '../../lib/i18n';
import { studentService, type Student } from '../../services/students';
import { wasteCollectionService, type WasteCollection } from '../../services/wasteCollections';
import { wasteTypeService, type WasteType } from '../../services/wasteTypes';
import './UserPortal.css';

const wasteTypeIcons: Record<string, string> = {
  'Botol Plastik': 'fa-wine-bottle',
  'Plastic Bottle': 'fa-wine-bottle',
  'Sampah Plastik': 'fa-wine-bottle',
  'Sampah Kertas': 'fa-newspaper',
  'Paper Waste': 'fa-newspaper',
  'Kertas Bekas': 'fa-newspaper',
  'Kaleng Aluminium': 'fa-prescription-bottle',
  'Aluminum Can': 'fa-prescription-bottle',
  'Kaleng': 'fa-prescription-bottle',
  'E-Waste': 'fa-laptop',
  'Sampah Elektronik': 'fa-laptop',
  'Botol Kaca': 'fa-wineGlass',
  'Glass Bottle': 'fa-wineGlass',
  'Sampah Organik': 'fa-apple-alt',
  'Organic Waste': 'fa-apple-alt',
  'Kardus': 'fa-box',
  'Cardboard': 'fa-box',
  'Sisa Logam': 'fa-cogs',
  'Metal Scraps': 'fa-cogs',
  'default': 'fa-leaf',
};

const wasteTypeColors: Record<string, string> = {
  'Botol Plastik': 'bg-blue-50 text-blue-700 border-blue-200',
  'Plastic Bottle': 'bg-blue-50 text-blue-700 border-blue-200',
  'Sampah Plastik': 'bg-blue-50 text-blue-700 border-blue-200',
  'Sampah Kertas': 'bg-amber-50 text-amber-700 border-amber-200',
  'Paper Waste': 'bg-amber-50 text-amber-700 border-amber-200',
  'Kertas Bekas': 'bg-amber-50 text-amber-700 border-amber-200',
  'Kaleng Aluminium': 'bg-red-50 text-red-700 border-red-200',
  'Aluminum Can': 'bg-red-50 text-red-700 border-red-200',
  'Kaleng': 'bg-red-50 text-red-700 border-red-200',
  'E-Waste': 'bg-green-50 text-green-700 border-green-200',
  'Sampah Elektronik': 'bg-green-50 text-green-700 border-green-200',
  'Botol Kaca': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Glass Bottle': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Sampah Organik': 'bg-lime-50 text-lime-700 border-lime-200',
  'Organic Waste': 'bg-lime-50 text-lime-700 border-lime-200',
  'Kardus': 'bg-orange-50 text-orange-700 border-orange-200',
  'Cardboard': 'bg-orange-50 text-orange-700 border-orange-200',
  'Sisa Logam': 'bg-gray-50 text-gray-700 border-gray-200',
  'Metal Scraps': 'bg-gray-50 text-gray-700 border-gray-200',
};

const translations = {
  en: {
    pageTitle: 'Student Waste Portal',
    pageSubtitle: 'Waste Recycling System',
    searchPlaceholder: 'Search students...',
    students: 'Students',
    collections: 'collections',
    dateRange: 'Date Range',
    from: 'From',
    to: 'To',
    apply: 'Apply',
    invalidDate: 'Invalid date range',
    summaryTitle: 'Collection Summary',
    totalCollected: 'Total Collected',
    totalEarnings: 'Total Earnings',
    totalEntries: 'Total Entries',
    reportTitle: 'Detailed Report',
    downloadReport: 'Download Report',
    date: 'Date',
    wasteType: 'Waste Type',
    quantity: 'Quantity',
    price: 'Price',
    earnings: 'Earnings',
    noData: 'No data available',
    noDataDesc: 'No collections for this date range',
    kg: 'kg',
    perKg: 'per kg',
    total: 'Total',
    filterApplied: 'Filter applied',
    collectionsFound: 'collections found',
    selectStudent: 'Select a student to view their collections',
    grade: 'Grade',
    showing: 'Showing',
    of: 'of',
    entries: 'entries',
    perPage: 'per page',
    prev: 'Previous',
    next: 'Next',
  },
  id: {
    pageTitle: 'Portal Siswa',
    pageSubtitle: 'Sistem Daur Ulang Sampah',
    searchPlaceholder: 'Cari siswa...',
    students: 'Siswa',
    collections: 'koleksi',
    dateRange: 'Rentang Tanggal',
    from: 'Dari',
    to: 'Sampai',
    apply: 'Terapkan',
    invalidDate: 'Rentang tanggal tidak valid',
    summaryTitle: 'Ringkasan Koleksi',
    totalCollected: 'Total Dikumpulkan',
    totalEarnings: 'Total Pendapatan',
    totalEntries: 'Total Entri',
    reportTitle: 'Laporan Detail',
    downloadReport: 'Unduh Laporan',
    date: 'Tanggal',
    wasteType: 'Jenis Sampah',
    quantity: 'Jumlah',
    price: 'Harga',
    earnings: 'Pendapatan',
    noData: 'Tidak ada data',
    noDataDesc: 'Tidak ada koleksi untuk rentang tanggal ini',
    kg: 'kg',
    perKg: 'per kg',
    total: 'Total',
    filterApplied: 'Filter diterapkan',
    collectionsFound: 'koleksi ditemukan',
    selectStudent: 'Pilih siswa untuk melihat koleksi mereka',
    grade: 'Kelas',
    showing: 'Menampilkan',
    of: 'dari',
    entries: 'entri',
    perPage: 'per halaman',
    prev: 'Sebelumnya',
    next: 'Selanjutnya',
  }
};

const formatRupiah = (amount: number): string => {
  return 'Rp ' + amount.toLocaleString('id-ID');
};

const formatDateIndo = (dateStr: string): string => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export function UserPortal() {
  const { language, setLanguage } = useI18n();
  const isLangEn = language === 'en';
  const t = translations[language];
  
  const [students, setStudents] = useState<Student[]>([]);
  const [wasteCollections, setWasteCollections] = useState<WasteCollection[]>([]);
  const [wasteTypes, setWasteTypes] = useState<WasteType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [dateError, setDateError] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [showToast, setShowToast] = useState<{ message: string; type: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [appliedDateFrom, setAppliedDateFrom] = useState('');
  const [appliedDateTo, setAppliedDateTo] = useState('');

  useEffect(() => {
    const unsubStudents = studentService.subscribeToStudents((data) => {
      setStudents(data);
      if (data.length > 0 && !selectedStudentId) {
        setSelectedStudentId(data[0].id);
      }
    });
    
    const unsubCollections = wasteCollectionService.subscribeToCollections((data) => {
      setWasteCollections(data);
    });
    
    const unsubWasteTypes = wasteTypeService.subscribeToWasteTypes((data) => {
      setWasteTypes(data);
    });
    
    return () => {
      unsubStudents();
      unsubCollections();
      unsubWasteTypes();
    };
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }));
      
      const dateStr = now.toLocaleDateString(language === 'en' ? 'en-US' : 'id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      setCurrentDate(dateStr);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  useEffect(() => {
    const today = new Date();
    const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    setDateFrom(lastYear.toISOString().split('T')[0]);
    setDateTo(today.toISOString().split('T')[0]);
    setAppliedDateFrom(lastYear.toISOString().split('T')[0]);
    setAppliedDateTo(today.toISOString().split('T')[0]);
  }, []);

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const query = searchQuery.toLowerCase();
    return students.filter(s => 
      s.name.toLowerCase().includes(query) ||
      s.studentId.toLowerCase().includes(query)
    );
  }, [students, searchQuery]);

  const studentCollections = useMemo(() => {
    if (!selectedStudentId) return [];
    const selectedStudent = students.find(s => s.id === selectedStudentId);
    if (!selectedStudent) return [];
    return wasteCollections.filter(c => c.studentId === selectedStudent.studentId);
  }, [wasteCollections, selectedStudentId, students]);

  const filteredCollections = useMemo(() => {
    if (!appliedDateFrom || !appliedDateTo) return studentCollections;
    const from = new Date(appliedDateFrom);
    const to = new Date(appliedDateTo);
    to.setHours(23, 59, 59, 999);
    
    return studentCollections.filter(c => {
      const cDate = new Date(c.date);
      return cDate >= from && cDate <= to;
    });
  }, [studentCollections, appliedDateFrom, appliedDateTo]);

  const paginatedCollections = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCollections.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCollections, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [dateFrom, dateTo, selectedStudentId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedDateFrom, appliedDateTo]);

  useEffect(() => {
    const today = new Date();
    const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    const defaultFrom = lastYear.toISOString().split('T')[0];
    const defaultTo = today.toISOString().split('T')[0];
    
    setDateFrom(defaultFrom);
    setDateTo(defaultTo);
    setAppliedDateFrom(defaultFrom);
    setAppliedDateTo(defaultTo);
  }, [selectedStudentId]);

  const selectedStudent = useMemo(() => {
    return students.find(s => s.id === selectedStudentId);
  }, [students, selectedStudentId]);

  const summaryData = useMemo(() => {
    const summary: Record<string, { quantity: number; earnings: number; color: string; icon: string; percentage: number }> = {};
    const totalQuantity = filteredCollections.reduce((sum, c) => sum + c.quantity, 0) || 1;
    
    filteredCollections.forEach(c => {
      const type = c.wasteTypeName || 'Unknown';
      if (!summary[type]) {
        summary[type] = { 
          quantity: 0, 
          earnings: 0,
          color: wasteTypeColors[type] || 'bg-green-50 text-green-700 border-green-200',
          icon: wasteTypeIcons[type] || 'fa-leaf',
          percentage: 0
        };
      }
      summary[type].quantity += c.quantity;
      summary[type].earnings += c.earnings;
    });
    
    Object.keys(summary).forEach(type => {
      summary[type].percentage = (summary[type].quantity / totalQuantity) * 100;
    });
    
    return summary;
  }, [filteredCollections]);

  const totals = useMemo(() => {
    return {
      quantity: filteredCollections.reduce((sum, c) => sum + c.quantity, 0),
      earnings: filteredCollections.reduce((sum, c) => sum + c.earnings, 0),
      entries: filteredCollections.length,
    };
  }, [filteredCollections]);

  const handleApplyFilter = useCallback(() => {
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    if (!dateFrom || !dateTo) {
      setDateError(isLangEn ? 'Select date range' : 'Pilih rentang tanggal');
      return;
    }
    
    if (from > to) {
      setDateError(isLangEn ? 'Start date must be before end date' : 'Tanggal awal harus sebelum tanggal akhir');
      return;
    }
    
    if (to > today) {
      setDateError(isLangEn ? 'End date cannot be in the future' : 'Tanggal tidak boleh di masa depan');
      return;
    }
    
    setDateError('');
    setAppliedDateFrom(dateFrom);
    setAppliedDateTo(dateTo);
    displayToast(`${t.filterApplied}: ${filteredCollections.length} ${t.collectionsFound}`, 'success');
  }, [dateFrom, dateTo, filteredCollections.length, t, isLangEn]);

  const handleDownload = useCallback(() => {
    if (!selectedStudent) return;
    
    let csv = `${t.reportTitle} - ${selectedStudent.name} (${selectedStudent.studentId})\n`;
    csv += `${t.dateRange}: ${formatDateIndo(appliedDateFrom)} - ${formatDateIndo(appliedDateTo)}\n\n`;
    csv += `${t.date},${t.wasteType},${t.quantity} (${t.kg}),${t.price},${t.earnings}\n`;
    
    filteredCollections.forEach(c => {
      csv += `${c.date},${c.wasteTypeName},${c.quantity},${c.pricePerKg},${c.earnings}\n`;
    });
    
    csv += `\n${t.total},,${totals.quantity} ${t.kg},,${formatRupiah(totals.earnings)}\n`;
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Laporan_${selectedStudent.studentId}_${appliedDateFrom}_${appliedDateTo}.csv`;
    link.click();
    
    displayToast(isLangEn ? 'Report downloaded!' : 'Laporan berhasil diunduh!', 'success');
  }, [selectedStudent, appliedDateFrom, appliedDateTo, filteredCollections, totals, t, isLangEn]);

  const displayToast = (message: string, type: string) => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const getAvatarColor = (name: string): string => {
    const colors = [
      'bg-blue-100 text-blue-700',
      'bg-green-100 text-green-700',
      'bg-yellow-100 text-yellow-700',
      'bg-pink-100 text-pink-700',
      'bg-purple-100 text-purple-700',
      'bg-teal-100 text-teal-700',
      'bg-orange-100 text-orange-700',
      'bg-indigo-100 text-indigo-700',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getWasteIcon = (type: string): string => {
    return wasteTypeIcons[type] || 'fa-leaf';
  };

  return (
    <div className="portal-page">
      <div className="portal-ambient-bg">
        <div className="portal-blur-orb-1"></div>
        <div className="portal-blur-orb-2"></div>
      </div>

      <header className="portal-header">
        <div className="portal-header-left">
          <div className="portal-logo">
            <i className="fas fa-university"></i>
          </div>
          <div className="portal-title">
            <h1>Tabungan Sampah Digital</h1>
            <p>{t.pageSubtitle}</p>
          </div>
        </div>
        
        <div className="portal-header-right">
          <div className="portal-time-display">
            {currentTime}
            <span className="time-sep">·</span>
            {currentDate}
          </div>
          <div className="portal-lang-toggle">
            <button 
              className={`portal-lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
            <button 
              className={`portal-lang-btn ${language === 'id' ? 'active' : ''}`}
              onClick={() => setLanguage('id')}
            >
              ID
            </button>
          </div>
        </div>
      </header>

      <div className="portal-layout">
        <aside className="portal-sidebar">
          <div className="portal-sidebar-header">
            <h2>{t.students}</h2>
            <div className="portal-search-wrapper">
              <i className="fas fa-search"></i>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="portal-search-input"
              />
            </div>
          </div>

          <div className="portal-student-list">
            {filteredStudents.map((student) => (
              <div 
                key={student.id}
                className={`portal-student-card ${selectedStudentId === student.id ? 'active' : ''}`}
                onClick={() => setSelectedStudentId(student.id)}
              >
                <div className={`portal-student-avatar ${getAvatarColor(student.name)}`}>
                  {student.name.charAt(0)}
                </div>
                <div className="portal-student-info">
                  <h4>{student.name}</h4>
                  <p>{t.grade} {student.gradeLevel} · {student.studentId}</p>
                </div>
                <i className={`fas fa-chevron-right ${selectedStudentId === student.id ? 'active' : ''}`}></i>
              </div>
            ))}
          </div>
        </aside>

        <main className="portal-main">
          {selectedStudent && (
            <div className="portal-profile-header animate-slide-up">
              <div className={`portal-profile-avatar ${getAvatarColor(selectedStudent.name)}`}>
                {selectedStudent.name.charAt(0)}
              </div>
              <div className="portal-profile-info">
                <h2>{selectedStudent.name}</h2>
                <div className="portal-profile-meta">
                  <span><i className="fas fa-graduation-cap"></i> {t.grade} {selectedStudent.gradeLevel}</span>
                  <span className="portal-dot"></span>
                  <span><i className="fas fa-id-card"></i> {selectedStudent.studentId}</span>
                  <span className="portal-dot"></span>
                  <span><i className="fas fa-recycle"></i> {studentCollections.length} {t.collections}</span>
                </div>
              </div>
            </div>
          )}

          <div className="portal-card portal-filter-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h3>{t.dateRange}</h3>
            <div className="portal-filter-grid">
              <div className="portal-input-group">
                <label>{t.from}</label>
                <input 
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="portal-date-input"
                />
              </div>
              <div className="portal-input-group">
                <label>{t.to}</label>
                <input 
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="portal-date-input"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <button 
                className="portal-submit-btn magnetic-btn"
                onClick={handleApplyFilter}
              >
                <i className="fas fa-check"></i>
                {t.apply}
              </button>
            </div>
            {dateError && (
              <div className="portal-error-msg">
                <i className="fas fa-exclamation-circle"></i>
                {dateError}
              </div>
            )}
          </div>

          <div className="portal-summary-section animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3>{t.summaryTitle}</h3>
            <div className="portal-summary-grid">
              {Object.keys(summaryData).length > 0 ? (
                Object.entries(summaryData).map(([type, data]) => (
                  <div key={type} className="portal-summary-card">
                    <div className="portal-summary-header">
                      <div className={`portal-summary-icon ${data.color}`}>
                        <i className={`fas ${data.icon}`}></i>
                      </div>
                      <span className="portal-summary-type">{type}</span>
                    </div>
                    <div className="portal-summary-value">
                      {data.quantity} <span className="portal-summary-unit">{t.kg}</span>
                    </div>
                    <div className="portal-summary-earnings">
                      {formatRupiah(data.earnings)}
                    </div>
                    <div className="portal-summary-progress">
                      <div 
                        className="portal-summary-progress-bar" 
                        style={{ width: `${data.percentage}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="portal-empty-summary">
                  <i className="fas fa-leaf"></i>
                  <p>{t.noDataDesc}</p>
                </div>
              )}
            </div>
          </div>

          <div className="portal-card portal-report-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="portal-report-header">
              <div className="portal-report-title">
                <i className="fas fa-file-alt"></i>
                <h3>{t.reportTitle}</h3>
              </div>
              <button className="portal-download-btn" onClick={handleDownload}>
                <i className="fas fa-download"></i>
                {t.downloadReport}
              </button>
            </div>

            {filteredCollections.length > 0 && (
              <>
                <div className="portal-table-wrapper">
                  <table className="portal-table">
                    <thead>
                      <tr>
                        <th>{t.date}</th>
                        <th>{t.wasteType}</th>
                        <th className="text-right">{t.quantity}</th>
                        <th className="text-right">{t.price}</th>
                        <th className="text-right">{t.earnings}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedCollections.map((collection, index) => (
                        <tr key={collection.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.03}s` }}>
                          <td>{formatDateIndo(collection.date)}</td>
                          <td>
                            <span className={`portal-waste-badge ${wasteTypeColors[collection.wasteTypeName] || 'bg-green-50 text-green-700 border-green-200'}`}>
                              <i className={`fas ${getWasteIcon(collection.wasteTypeName)}`}></i>
                              {collection.wasteTypeName}
                            </span>
                          </td>
                          <td className="text-right font-semibold">{collection.quantity} <span className="text-gray-400 text-xs">{t.kg}</span></td>
                          <td className="text-right">{formatRupiah(collection.pricePerKg)}/{t.kg}</td>
                          <td className="text-right font-bold text-green-600">{formatRupiah(collection.earnings)}</td>
                        </tr>
                      ))}
                      <tr className="portal-total-row">
                        <td colSpan={2}>{t.total}</td>
                        <td className="text-right">{totals.quantity} {t.kg}</td>
                        <td></td>
                        <td className="text-right">{formatRupiah(totals.earnings)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="portal-pagination">
                    <div className="portal-pagination-info">
                      {`${t.showing} ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, filteredCollections.length)} ${t.of} ${filteredCollections.length} ${t.entries}`}
                    </div>
                    <div className="portal-pagination-controls">
                      <div className="portal-items-per-page">
                        <select 
                          value={itemsPerPage} 
                          onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                          className="portal-items-select"
                        >
                          <option value={10}>10 {t.perPage}</option>
                          <option value={25}>25 {t.perPage}</option>
                          <option value={50}>50 {t.perPage}</option>
                        </select>
                      </div>
                      <button 
                        className="portal-pagination-btn"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <i className="fas fa-chevron-left"></i>
                        {t.prev}
                      </button>
                      <div className="portal-page-numbers">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            className={`portal-page-num ${currentPage === page ? 'active' : ''}`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      <button 
                        className="portal-pagination-btn"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        {t.next}
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
            
            {filteredCollections.length === 0 && (
              <div className="portal-empty-state">
                <i className="fas fa-leaf"></i>
                <h4>{t.noData}</h4>
                <p>{t.noDataDesc}</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {showToast && (
        <div className="portal-toast-container">
          <div className={`portal-toast ${showToast.type}`}>
            <div className="portal-toast-icon">
              {showToast.type === 'success' ? (
                <svg className="checkmark" viewBox="0 0 52 52">
                  <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                  <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
              ) : (
                <i className="fas fa-exclamation-circle"></i>
              )}
            </div>
            <div className="portal-toast-content">
              <h4>{showToast.type === 'success' ? (isLangEn ? 'Success!' : 'Berhasil!') : 'Error!'}</h4>
              <p>{showToast.message}</p>
            </div>
            <div className="portal-toast-progress"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserPortal;
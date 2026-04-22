import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useToast } from '../../context/ToastContext';
import { AppSidebar } from '../AppSidebar/AppSidebar';
import { studentService, type Student } from '../../services/students';
import { wasteTypeService, type WasteType } from '../../services/wasteTypes';
import { wasteCollectionService, type WasteCollection } from '../../services/wasteCollections';
import { useAuth } from '../../context/AuthContext';
import './WasteCollection.css';

const navItems = [
  { id: 'dashboard', icon: 'fa-home', label: 'Dashboard', route: '/dashboard' },
  { id: 'students', icon: 'fa-users', label: 'Manage Students', route: '/manage-student' },
  { id: 'collection', icon: 'fa-trash-alt', label: 'Waste Collection', route: '/waste-collection' },
  { id: 'reports', icon: 'fa-chart-bar', label: 'Reports & Analytics' },
  { id: 'settings', icon: 'fa-cog', label: 'Settings' },
];

interface WasteRecord {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  studentGrade?: string;
  wasteType: string;
  wasteTypeId?: string;
  quantity: number;
  price: number;
  pricePerKg?: number;
  earnings: number;
  recordedBy?: string;
  createdAt?: string;
  wasteTypeName?: string;
}

const translations = {
  en: {
    navDashboard: 'Dashboard',
    navStudents: 'Manage Students',
    navRecordWaste: 'Record Waste',
    navReports: 'Reports',
    navSettings: 'Settings',
    pageTitle: 'Record Waste',
    pageSubtitle: 'Collection',
    welcome: 'Track and manage eco-friendly waste collection entries',
    addNew: 'Add New Collection Entry',
    selectStudent: 'Select Student',
    dateOfCollection: 'Date of Collection',
    wasteType: 'Waste Type',
    price: 'Price',
    quantity: 'Quantity',
    addEntry: 'Add Entry',
    recentRecords: 'Recent Collection Records',
    showing: 'Showing',
    records: 'records',
    entriesPerPage: 'entries per page',
    previous: 'Previous',
    next: 'Next',
    noResults: 'No records found',
    noResultsDesc: 'Try adjusting your search criteria',
    deleteConfirm: 'Delete record for',
    yes: 'Yes, Delete',
    cancel: 'Cancel',
    save: 'Save',
    editEntry: 'Edit Entry',
    required: 'This field is required',
    dateFuture: 'Date cannot be in the future',
    quantityPositive: 'Quantity must be greater than 0',
    pricePositive: 'Price must be greater than 0',
    studentRequired: 'Please select a student',
    wasteTypeRequired: 'Please select waste type',
    addedSuccess: 'Waste collection recorded successfully!',
    updatedSuccess: 'Entry updated successfully!',
    deletedSuccess: 'Record deleted successfully',
    searchPlaceholder: 'Search records...',
    date: 'Date',
    student: 'Student',
    earnings: 'Earnings',
    actions: 'Delete',
    kg: 'kg',
  },
  id: {
    navDashboard: 'Dasbor',
    navStudents: 'Kelola Siswa',
    navRecordWaste: 'Catat Limbah',
    navReports: 'Laporan',
    navSettings: 'Pengaturan',
    pageTitle: 'Catat Limbah',
    pageSubtitle: 'Pengumpulan',
    welcome: 'Lacak dan kelola entri pengumpulan limbah yang ramah lingkungan',
    addNew: 'Tambah Entri Pengumpulan Baru',
    selectStudent: 'Pilih Siswa',
    dateOfCollection: 'Tanggal Pengumpulan',
    wasteType: 'Jenis Limbah',
    price: 'Harga',
    quantity: 'Jumlah',
    addEntry: 'Tambah Entri',
    recentRecords: 'Riwayat Pengumpulan Terbaru',
    showing: 'Menampilkan',
    records: 'record',
    entriesPerPage: 'entri per halaman',
    previous: 'Sebelumnya',
    next: 'Selanjutnya',
    noResults: 'Tidak ada record ditemukan',
    noResultsDesc: 'Coba sesuaikan kriteria pencarian Anda',
    deleteConfirm: 'Hapus record untuk',
    yes: 'Ya, Hapus',
    cancel: 'Batal',
    save: 'Simpan',
    editEntry: 'Edit Entri',
    required: 'Bidang ini wajib diisi',
    dateFuture: 'Tanggal tidak boleh di masa depan',
    quantityPositive: 'Jumlah harus lebih dari 0',
    pricePositive: 'Harga harus lebih dari 0',
    studentRequired: 'Silakan pilih siswa',
    wasteTypeRequired: 'Silakan pilih jenis limbah',
    addedSuccess: 'Pengumpulan limbah berhasil dicatat!',
    updatedSuccess: 'Entri berhasil diperbarui!',
    deletedSuccess: 'Record berhasil dihapus',
    searchPlaceholder: 'Cari record...',
    date: 'Tanggal',
    student: 'Siswa',
    earnings: 'Pendapatan',
    actions: 'Hapus',
    kg: 'kg',
  }
};

export function RecordWasteCollection() {
  const navigate = useNavigate();
  const { showToast, toasts } = useToast();
  const { user } = useAuth();
  
  const [language, setLanguage] = useState<'en' | 'id'>('en');
  const isLangEn = language === 'en';
  const t = translations[language];
  
  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<WasteRecord[]>([]);
  const [wasteTypesList, setWasteTypesList] = useState<WasteType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [editingRecord, setEditingRecord] = useState<WasteRecord | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [jumpToPage, setJumpToPage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const today = new Date().toISOString().split('T')[0];
  
  useEffect(() => {
    setIsLoading(true);
    
    const unsubStudents = studentService.subscribeToStudents((data) => {
      setStudents(data);
    });
    
    const unsubWasteTypes = wasteTypeService.subscribeToActiveWasteTypes((data) => {
      setWasteTypesList(data);
    });
    
    const unsubRecords = wasteCollectionService.subscribeToCollections((data) => {
      const mapped: WasteRecord[] = data.map(d => ({
        id: d.id,
        date: d.date,
        studentId: d.studentId,
        studentName: d.studentName,
        studentGrade: d.studentGrade,
        wasteType: d.wasteTypeName,
        wasteTypeId: d.wasteTypeId,
        quantity: d.quantity,
        price: d.pricePerKg,
        earnings: d.earnings,
        recordedBy: d.recordedBy,
        createdAt: d.createdAt,
        wasteTypeName: d.wasteTypeName
      }));
      setRecords(mapped);
      setIsLoading(false);
    });
    
    return () => {
      unsubStudents();
      unsubWasteTypes();
      unsubRecords();
    };
  }, []);

  const getWasteTypeInfo = (wasteTypeName: string): { pricePerKg: number } => {
    const found = wasteTypesList.find(wt => wt.nameEn === wasteTypeName || wt.name === wasteTypeName);
    return { pricePerKg: found ? found.price : 0 };
  };

  const [formData, setFormData] = useState({
    studentId: '',
    date: today,
    wasteType: '',
    price: 0,
    quantity: 1,
  });
  
  const [formErrors, setFormErrors] = useState({
    studentId: '',
    date: '',
    wasteType: '',
    price: '',
    quantity: '',
  });

  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return records;
    const query = searchQuery.toLowerCase();
    return records.filter(r => 
      r.studentName.toLowerCase().includes(query) ||
      r.studentId.toLowerCase().includes(query) ||
      (r.wasteTypeName || r.wasteType || '').toLowerCase().includes(query) ||
      r.date.includes(query)
    );
  }, [records, searchQuery]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage, itemsPerPage]);

  const validateField = useCallback((name: string, value: string | number) => {
    let error = '';
    let isValid = true;

    switch (name) {
      case 'studentId':
        if (!value) {
          error = t.studentRequired;
          isValid = false;
        }
        break;
      case 'date':
        if (!value) {
          error = t.required;
          isValid = false;
        } else if (String(value) > today) {
          error = t.dateFuture;
          isValid = false;
        }
        break;
      case 'wasteType':
        if (!value) {
          error = t.wasteTypeRequired;
          isValid = false;
        }
        break;
      case 'price':
        if (!value || Number(value) <= 0) {
          error = t.pricePositive;
          isValid = false;
        }
        break;
      case 'quantity':
        if (!value || Number(value) <= 0) {
          error = t.quantityPositive;
          isValid = false;
        }
        break;
    }

    setFormErrors(prev => ({ ...prev, [name]: error }));
    return isValid;
  }, [t, today]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'wasteType') {
      const wt = getWasteTypeInfo(value);
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        price: wt.pricePerKg,
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: name === 'price' || name === 'quantity' ? parseFloat(value) || 0 : value 
      }));
    }
    
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(0.1, formData.quantity + delta);
    setFormData(prev => ({ ...prev, quantity: newQuantity }));
    if (formErrors.quantity) {
      setFormErrors(prev => ({ ...prev, quantity: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const studentValid = validateField('studentId', formData.studentId);
    const dateValid = validateField('date', formData.date);
    const wasteValid = validateField('wasteType', formData.wasteType);
    const priceValid = validateField('price', formData.price);
    const qtyValid = validateField('quantity', formData.quantity);
    
    if (!studentValid || !dateValid || !wasteValid || !priceValid || !qtyValid) {
      return;
    }

    const selectedStudent = students.find(s => s.id === formData.studentId);
    const earnings = formData.quantity * formData.price;

    if (editingRecord) {
      setRecords(prev => prev.map(r => 
        r.id === editingRecord.id 
          ? { 
              ...r, 
              date: formData.date,
              studentId: selectedStudent?.studentId || r.studentId,
              studentName: selectedStudent?.name || r.studentName,
              wasteType: formData.wasteType,
              quantity: formData.quantity,
              price: formData.price,
              earnings: earnings
            }
          : r
      ));
      showToast('success', t.updatedSuccess);
    } else {
      const newRecord: WasteRecord = {
        id: `rec-${Date.now()}`,
        date: formData.date,
        studentId: selectedStudent?.studentId || '',
        studentName: selectedStudent?.name || '',
        wasteType: formData.wasteType,
        quantity: formData.quantity,
        price: formData.price,
        earnings: earnings,
      };
      setRecords(prev => [newRecord, ...prev]);
      showToast('success', t.addedSuccess);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ studentId: '', date: today, wasteType: 'Plastic Bottles', price: 0.50, quantity: 1 });
    setFormErrors({ studentId: '', date: '', wasteType: '', price: '', quantity: '' });
    setEditingRecord(null);
    setIsFormOpen(false);
  };

  const handleEdit = (record: WasteRecord) => {
    const student = students.find(s => s.studentId === record.studentId);
    setEditingRecord(record);
    setFormData({
      studentId: student?.id || '',
      date: record.date,
      wasteType: record.wasteType,
      price: record.price,
      quantity: record.quantity,
    });
    setIsFormOpen(true);
    setFormErrors({ studentId: '', date: '', wasteType: '', price: '', quantity: '' });
  };

  const handleDelete = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
    showToast('success', t.deletedSuccess);
    setShowDeleteConfirm(null);
    if (paginatedRecords.length === 1 && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.route && item.route !== '#') {
      navigate(item.route);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage, 10);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setJumpToPage('');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  const highlightMatch = (text: string) => {
    if (!searchQuery.trim()) return text;
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <span key={i} className="rwc-highlight">{part}</span> : part
    );
  };

  const currentPrice = getWasteTypeInfo(formData.wasteType).pricePerKg;
  const calculatedEarnings = formData.quantity * currentPrice;

  const formatCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
  };

  return (
    <div className="waste-collection-page">
      {/* Ambient Background */}
      <div className="rwc-ambient-bg">
        <div className="rwc-ambient-gradient"></div>
        <div className="rwc-blur-orb-1"></div>
        <div className="rwc-blur-orb-2"></div>
      </div>

      {/* Shared Sidebar */}
      <AppSidebar activeNav="collection" />

      {/* Main Content */}
      <main className="rwc-main">
        {/* Header */}
        <div className="rwc-header">
          <div className="rwc-page-title">
            <h2>
              {t.pageTitle} <span className="gradient-text">{t.pageSubtitle}</span>
            </h2>
            <p>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L4 7v10l8 5 8-5V7L12 2z"/>
              </svg>
              {t.welcome}
            </p>
          </div>
          <div className="rwc-header-right">
            <div className="rwc-date-display">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {formatCurrentDate()}
            </div>
            <div className="rwc-lang-toggle">
              <button 
                className={`rwc-lang-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                EN
              </button>
              <button 
                className={`rwc-lang-btn ${language === 'id' ? 'active' : ''}`}
                onClick={() => setLanguage('id')}
              >
                ID
              </button>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="rwc-card rwc-form-card">
          <div className="rwc-form-header">
            <div className="rwc-form-header-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <h3>{t.addNew}</h3>
          </div>

          <form onSubmit={handleSubmit} className="rwc-form-grid">
            {/* Student Select */}
            <div className="rwc-input-wrapper">
              <select 
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                onBlur={(e) => validateField('studentId', e.target.value)}
                className={`rwc-input rwc-select ${formErrors.studentId ? 'error' : formData.studentId ? 'valid' : ''}`}
              >
                <option value="" disabled></option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} (ID: {student.studentId})
                  </option>
                ))}
              </select>
              <label className="rwc-floating-label">{t.selectStudent}</label>
              <svg className="rwc-select-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
              {formErrors.studentId && (
                <div className="rwc-error-msg show">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {formErrors.studentId}
                </div>
              )}
            </div>

            {/* Date */}
            <div className="rwc-input-wrapper">
              <input 
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                onBlur={(e) => validateField('date', e.target.value)}
                max={today}
                className={`rwc-input ${formErrors.date ? 'error' : formData.date ? 'valid' : ''}`}
              />
              <label className="rwc-floating-label" style={{ top: '0', transform: 'translateY(-50%) scale(0.85)', background: 'white', padding: '0 0.5rem', color: '#16a34a', fontWeight: '600' }}>
                {t.dateOfCollection}
              </label>
              {formErrors.date && (
                <div className="rwc-error-msg show">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {formErrors.date}
                </div>
              )}
            </div>

            {/* Waste Type */}
            <div className="rwc-input-wrapper">
              <select 
                name="wasteType"
                value={formData.wasteType}
                onChange={handleInputChange}
                onBlur={(e) => validateField('wasteType', e.target.value)}
                className={`rwc-input rwc-select ${formErrors.wasteType ? 'error' : formData.wasteType ? 'valid' : ''}`}
              >
                {wasteTypesList.map(wt => (
                  <option key={wt.id} value={wt.nameEn || wt.name}>
                    {isLangEn ? wt.nameEn : wt.name}
                  </option>
                ))}
              </select>
              <label className="rwc-floating-label" style={{ top: '0', transform: 'translateY(-50%) scale(0.85)', background: 'white', padding: '0 0.5rem', color: '#16a34a', fontWeight: '600' }}>
                {t.wasteType}
              </label>
              <svg className="rwc-select-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
              {formErrors.wasteType && (
                <div className="rwc-error-msg show">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {formErrors.wasteType}
                </div>
              )}
            </div>

            {/* Price */}
            <div className="rwc-input-wrapper">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                <input 
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  onBlur={(e) => validateField('price', e.target.value)}
                  step="0.01"
                  min="0.01"
                  className={`rwc-input pl-8 ${formErrors.price ? 'error' : formData.price ? 'valid' : ''}`}
                />
              </div>
              <label className="rwc-floating-label" style={{ left: '2.5rem' }}>{t.price} ($)</label>
              {formErrors.price && (
                <div className="rwc-error-msg show">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {formErrors.price}
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="rwc-input-wrapper">
              <div className="rwc-qty-control">
                <input 
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  onBlur={(e) => validateField('quantity', e.target.value)}
                  step="0.1"
                  min="0.1"
                  className={`rwc-input pr-12 ${formErrors.quantity ? 'error' : formData.quantity ? 'valid' : ''}`}
                />
                <span className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">{t.kg}</span>
                <button type="button" className="rwc-qty-btn up" onClick={() => handleQuantityChange(0.1)}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
                </button>
                <button type="button" className="rwc-qty-btn down" onClick={() => handleQuantityChange(-0.1)}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
              </div>
              <label className="rwc-floating-label">{t.quantity}</label>
              {formErrors.quantity && (
                <div className="rwc-error-msg show">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {formErrors.quantity}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-end">
              <button type="submit" className="rwc-submit-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                <span>{editingRecord ? t.save : t.addEntry}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Table Card */}
        <div className="rwc-card rwc-table-card">
          <div className="rwc-table-header">
            <div className="rwc-table-header-left">
              <div className="rwc-form-header-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <h3>{t.recentRecords}</h3>
                <p>{t.showing} {filteredRecords.length} {t.records}</p>
              </div>
            </div>
            
            <div className="rwc-search-wrapper">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input 
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder={t.searchPlaceholder}
                className="rwc-search-input"
              />
            </div>
          </div>

          {filteredRecords.length > 0 ? (
            <>
              <div className="rwc-table-wrapper">
                <table className="rwc-table">
                  <thead>
                    <tr>
                      <th>{t.date}</th>
                      <th>{t.student}</th>
                      <th>{t.wasteType}</th>
                      <th>{t.price}</th>
                      <th>{t.quantity}</th>
                      <th>{t.earnings}</th>
                      <th className="text-center">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRecords.map((record, index) => (
                      <tr 
                        key={record.id} 
                        className="rwc-table-row"
                        style={{ '--row-index': index } as React.CSSProperties}
                      >
                        <td className="text-sm text-gray-600 font-medium">
                          {highlightMatch(formatDate(record.date))}
                        </td>
                        <td>
                          <div className="rwc-student-cell">
                            <div className="rwc-student-avatar">
                              {record.studentName.charAt(0)}
                            </div>
                            <div className="rwc-student-info">
                              <div className="name">{highlightMatch(record.studentName)}</div>
                              <div className="id">ID: {record.studentId}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="rwc-waste-badge">
                            {highlightMatch(record.wasteType || record.wasteTypeName || '')}
                          </span>
                        </td>
                        <td className="rwc-price-cell">${record.price.toFixed(2)}</td>
                        <td>
                          <span className="font-semibold text-emerald-600">{record.quantity}</span> {t.kg}
                        </td>
                        <td className="rwc-earnings-cell">${record.earnings.toFixed(2)}</td>
                        <td className="text-center">
                          <button 
                            className="rwc-delete-btn"
                            onClick={() => setShowDeleteConfirm(String(record.id))}
                            title={t.actions}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rwc-pagination">
                <div className="rwc-pagination-info">
                  <span>Show</span>
                  <select 
                    value={itemsPerPage} 
                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                    className="rwc-items-select"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                  </select>
                  <span>{t.entriesPerPage}</span>
                </div>
                <div className="rwc-pagination-controls">
                  <button 
                    className="rwc-page-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6"/>
                    </svg>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button 
                      key={page}
                      className={`rwc-page-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button 
                    className="rwc-page-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                  <form onSubmit={handleJumpToPage} className="rwc-jump-form">
                    <input 
                      type="number"
                      value={jumpToPage}
                      onChange={(e) => setJumpToPage(e.target.value)}
                      placeholder="#"
                      className="rwc-jump-input"
                      min={1}
                      max={totalPages}
                    />
                  </form>
                </div>
              </div>
            </>
          ) : (
            <div className="rwc-empty-state show">
              <div className="rwc-empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <h4>{t.noResults}</h4>
              <p>{t.noResultsDesc}</p>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4" style={{ animation: 'rwcScaleIn 0.3s ease' }}>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.deleteConfirm} {records.find(r => r.id === showDeleteConfirm)?.studentName}?</h3>
              <div className="flex gap-3 justify-center mt-4">
                <button 
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  {t.cancel}
                </button>
                <button 
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                  onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}
                >
                  {t.yes}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <div className="rwc-toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`rwc-toast ${toast.type}`}>
            <div className="rwc-toast-icon">
              {toast.type === 'success' && (
                <svg viewBox="0 0 52 52">
                  <circle className="rwc-check-circle" cx="26" cy="26" r="25" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <path className="rwc-check-check" fill="none" stroke="currentColor" strokeWidth="3" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
              )}
              {toast.type === 'error' && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              )}
            </div>
            <div className="rwc-toast-content">
              <h4>{toast.type === 'success' ? 'Success!' : 'Error!'}</h4>
              <p>{toast.message}</p>
            </div>
            <button className="rwc-toast-close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <div className="rwc-toast-progress"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecordWasteCollection;
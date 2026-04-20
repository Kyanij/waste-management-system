import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useToast } from '../../context/ToastContext';
import { useI18n } from '../../lib/i18n';
import { AppSidebar } from '../AppSidebar/AppSidebar';
import './ManageStudents.css';

interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  gradeLevel: string;
  dateAdded: string;
}

const initialStudents: Student[] = [
  { id: '1', studentId: 'STU001', name: 'Sarah Johnson', email: 'sarah.johnson@school.edu', gradeLevel: '10', dateAdded: '2024-01-15' },
  { id: '2', studentId: 'STU002', name: 'Michael Chen', email: 'michael.chen@school.edu', gradeLevel: '9', dateAdded: '2024-01-14' },
  { id: '3', studentId: 'STU003', name: 'Emma Davis', email: 'emma.davis@school.edu', gradeLevel: '11', dateAdded: '2024-01-13' },
  { id: '4', studentId: 'STU004', name: 'James Wilson', email: 'james.wilson@school.edu', gradeLevel: '10', dateAdded: '2024-01-12' },
  { id: '5', studentId: 'STU005', name: 'Olivia Brown', email: 'olivia.brown@school.edu', gradeLevel: '12', dateAdded: '2024-01-11' },
  { id: '6', studentId: 'STU006', name: 'William Lee', email: 'william.lee@school.edu', gradeLevel: '9', dateAdded: '2024-01-10' },
  { id: '7', studentId: 'STU007', name: 'Sophia Martinez', email: 'sophia.martinez@school.edu', gradeLevel: '11', dateAdded: '2024-01-09' },
  { id: '8', studentId: 'STU008', name: 'Benjamin Taylor', email: 'benjamin.taylor@school.edu', gradeLevel: '10', dateAdded: '2024-01-08' },
  { id: '9', studentId: 'STU009', name: 'Mia Anderson', email: 'mia.anderson@school.edu', gradeLevel: '9', dateAdded: '2024-01-07' },
  { id: '10', studentId: 'STU010', name: 'Lucas Thomas', email: 'lucas.thomas@school.edu', gradeLevel: '12', dateAdded: '2024-01-06' },
  { id: '11', studentId: 'STU011', name: 'Charlotte Jackson', email: 'charlotte.jackson@school.edu', gradeLevel: '10', dateAdded: '2024-01-05' },
  { id: '12', studentId: 'STU012', name: 'Henry White', email: 'henry.white@school.edu', gradeLevel: '11', dateAdded: '2024-01-04' },
];

const navItems = [
  { id: 'dashboard', icon: 'fa-home', label: 'Dashboard', route: '/dashboard' },
  { id: 'students', icon: 'fa-users', label: 'Manage Students', route: '/manage-student' },
  { id: 'collection', icon: 'fa-trash-alt', label: 'Waste Collection', route: '/waste-collection' },
  { id: 'reports', icon: 'fa-chart-bar', label: 'Reports & Analytics' },
  { id: 'rewards', icon: 'fa-gift', label: 'Rewards & Incentives' },
  { id: 'settings', icon: 'fa-cog', label: 'Settings' },
];

export function ManageStudents() {
  const navigate = useNavigate();
  const { showToast, toasts } = useToast();
  const { t, language, setLanguage } = useI18n();
  const isLangEn = language === 'en';
  
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [activeNav, setActiveNav] = useState('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    gradeLevel: '9',
  });
  
  const [formErrors, setFormErrors] = useState({
    name: '',
    studentId: '',
    email: '',
  });

  const labels = {
    pageTitle: isLangEn ? 'Manage Students' : 'Kelola Siswa',
    welcome: isLangEn ? 'Manage your student records here' : 'Kelola catatan siswa di sini',
    search: isLangEn ? 'Search students, IDs, emails...' : 'Cari siswa, ID, email...',
    addNew: isLangEn ? 'Add Student' : 'Tambah Siswa',
    editStudent: isLangEn ? 'Edit Student' : 'Edit Siswa',
    cancelEdit: isLangEn ? 'Cancel Edit' : 'Batal Edit',
    save: isLangEn ? 'Save' : 'Simpan',
    cancel: isLangEn ? 'Cancel' : 'Batal',
    delete: isLangEn ? 'Delete' : 'Hapus',
    columnDate: isLangEn ? 'Date Added' : 'Tanggal Ditambahkan',
    columnName: isLangEn ? 'Student Name' : 'Nama Siswa',
    columnId: isLangEn ? 'Student ID' : 'ID Siswa',
    columnEmail: isLangEn ? 'Email' : 'Email',
    columnGrade: isLangEn ? 'Grade Level' : 'Tingkat Kelas',
    columnActions: isLangEn ? 'Actions' : 'Tindakan',
    gradeLabel: isLangEn ? 'Grade' : 'Kelas',
    namePlaceholder: isLangEn ? 'Enter student name' : 'Masukkan nama siswa',
    idPlaceholder: isLangEn ? 'Enter student ID' : 'Masukkan ID siswa',
    emailPlaceholder: isLangEn ? 'Enter email address' : 'Masukkan alamat email',
    selectGrade: isLangEn ? 'Select grade' : 'Pilih kelas',
    previous: isLangEn ? 'Previous' : 'Sebelumnya',
    next: isLangEn ? 'Next' : 'Selanjutnya',
    showing: isLangEn ? 'Showing' : 'Menampilkan',
    of: isLangEn ? 'of' : 'dari',
    entries: isLangEn ? 'entries' : 'entri',
    noResults: isLangEn ? 'No students found' : 'Siswa tidak ditemukan',
    confirmDelete: isLangEn ? 'Are you sure you want to delete' : 'Apakah Anda yakin ingin menghapus',
    yes: isLangEn ? 'Yes, Delete' : 'Ya, Hapus',
    studentAdded: isLangEn ? 'Student added successfully' : 'Siswa berhasil ditambahkan',
    studentUpdated: isLangEn ? 'Student updated successfully' : 'Siswa berhasil diperbarui',
    studentDeleted: isLangEn ? 'Student deleted successfully' : 'Siswa berhasil dihapus',
    duplicateId: isLangEn ? 'Student ID already exists' : 'ID siswa sudah ada',
    invalidEmail: isLangEn ? 'Please enter a valid email' : 'Masukkan email yang valid',
    required: isLangEn ? 'This field is required' : 'Bidang ini wajib diisi',
  };

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const query = searchQuery.toLowerCase();
    return students.filter(s => 
      s.name.toLowerCase().includes(query) ||
      s.studentId.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query)
    );
  }, [students, searchQuery]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage, itemsPerPage]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = useCallback(() => {
    const errors = { name: '', studentId: '', email: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = labels.required;
      isValid = false;
    }
    if (!formData.studentId.trim()) {
      errors.studentId = labels.required;
      isValid = false;
    }
    if (!formData.email.trim()) {
      errors.email = labels.required;
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      errors.email = labels.invalidEmail;
      isValid = false;
    }

    if (!editingStudent) {
      const duplicate = students.find(s => s.studentId === formData.studentId);
      if (duplicate) {
        errors.studentId = labels.duplicateId;
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  }, [formData, students, editingStudent, labels]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingStudent) {
      setStudents(prev => prev.map(s => 
        s.id === editingStudent.id 
          ? { ...s, ...formData, dateAdded: s.dateAdded }
          : s
      ));
      showToast('success', labels.studentUpdated);
    } else {
      const newStudent: Student = {
        id: `stu-${Date.now()}`,
        ...formData,
        dateAdded: new Date().toISOString().split('T')[0],
      };
      setStudents(prev => [newStudent, ...prev]);
      showToast('success', labels.studentAdded);
    }

    resetForm();
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      studentId: student.studentId,
      email: student.email,
      gradeLevel: student.gradeLevel,
    });
    setIsFormOpen(true);
    setFormErrors({ name: '', studentId: '', email: '' });
  };

  const handleDelete = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    showToast('success', labels.studentDeleted);
    setShowDeleteConfirm(null);
    if (paginatedStudents.length === 1 && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', studentId: '', email: '', gradeLevel: '9' });
    setFormErrors({ name: '', studentId: '', email: '' });
    setEditingStudent(null);
    setIsFormOpen(false);
  };

  const handleNavClick = useCallback((item: typeof navItems[0]) => {
    if (item.route) {
      navigate(item.route);
    } else {
      setActiveNav(item.id);
    }
  }, [navigate]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const highlightMatch = (text: string) => {
    if (!searchQuery.trim()) return text;
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="highlight">{part}</mark> : part
    );
  };

  const formatCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
  };

  return (
    <div className="manage-students-page">
      <div className="ms-bg-animation">
        <div className="ms-particle particle-1"></div>
        <div className="ms-particle particle-2"></div>
        <div className="ms-particle particle-3"></div>
      </div>
      <div className="ms-grid-overlay"></div>

      <AppSidebar activeNav="students" />

      <main className="ms-main">
        <div className="ms-header">
          <div className="ms-page-title">
            <h2>{labels.pageTitle}</h2>
            <p>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L4 7v10l8 5 8-5V7L12 2z"/>
              </svg>
              {labels.welcome}
            </p>
          </div>
          <div className="ms-header-right">
            <div className="ms-date-display">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {formatCurrentDate()}
            </div>
            <div className="ms-lang-toggle">
              <button 
                className={`ms-lang-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                EN
              </button>
              <button 
                className={`ms-lang-btn ${language === 'id' ? 'active' : ''}`}
                onClick={() => setLanguage('id')}
              >
                ID
              </button>
            </div>
          </div>
        </div>

        <button 
          className="ms-btn ms-btn-primary ms-add-btn"
          onClick={() => { resetForm(); setIsFormOpen(true); }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          {labels.addNew}
        </button>

        {isFormOpen && (
          <div className="ms-form-card">
            <div className="ms-form-header">
              <div className="ms-form-header-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <line x1="20" y1="8" x2="20" y2="14"/>
                  <line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
              </div>
              <h3>{editingStudent ? labels.editStudent : labels.addNew}</h3>
              {editingStudent && (
                <button className="ms-btn ms-btn-secondary" onClick={resetForm}>
                  {labels.cancelEdit}
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="ms-form">
              <div className="ms-input-wrapper">
                <input 
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder=" "
                  className={`ms-input ${formErrors.name ? 'error' : formData.name ? 'valid' : ''}`}
                />
                <label htmlFor="name" className="ms-floating-label">{labels.columnName}</label>
              </div>
              <div className="ms-input-wrapper">
                <input 
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  placeholder=" "
                  disabled={!!editingStudent}
                  className={`ms-input ${formErrors.studentId ? 'error' : formData.studentId ? 'valid' : ''}`}
                />
                <label htmlFor="studentId" className="ms-floating-label">{labels.columnId}</label>
              </div>
              <div className="ms-input-wrapper">
                <input 
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder=" "
                  className={`ms-input ${formErrors.email ? 'error' : formData.email ? 'valid' : ''}`}
                />
                <label htmlFor="email" className="ms-floating-label">{labels.columnEmail}</label>
              </div>
              <div className="ms-input-wrapper">
                <select 
                  id="gradeLevel"
                  name="gradeLevel"
                  value={formData.gradeLevel}
                  onChange={handleInputChange}
                  className="ms-input ms-select"
                >
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10</option>
                  <option value="11">Grade 11</option>
                  <option value="12">Grade 12</option>
                </select>
                <label htmlFor="gradeLevel" className="ms-floating-label" style={{ top: '0', transform: 'translateY(-50%) scale(0.85)', background: 'white', padding: '0 0.5rem', color: '#16a34a', fontWeight: '600' }}>{labels.columnGrade}</label>
              </div>
              <div className="ms-form-actions">
                <button type="button" className="ms-btn ms-btn-secondary" onClick={resetForm}>
                  {labels.cancel}
                </button>
                <button type="submit" className="ms-submit-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                  </svg>
                  {labels.save}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="ms-table-card">
          {filteredStudents.length > 0 ? (
            <>
              <div className="ms-table-header">
                <div className="ms-table-header-left">
                  <div className="ms-form-header-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                      <path d="M16 3.13a4 4 0 010 7.75"/>
                    </svg>
                  </div>
                  <div>
                    <h3>{labels.pageTitle}</h3>
                    <p>{labels.showing} {filteredStudents.length} {labels.entries}</p>
                  </div>
                </div>
                <div className="ms-search-wrapper">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder={labels.search}
                    className="ms-search-input"
                  />
                </div>
              </div>

              <div className="ms-table-wrapper">
                <table className="ms-table">
                  <thead>
                    <tr>
                      <th>{labels.columnName}</th>
                      <th>{labels.columnId}</th>
                      <th>{labels.columnEmail}</th>
                      <th>{labels.columnGrade}</th>
                      <th>{labels.columnActions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedStudents.map((student, index) => (
                      <tr key={student.id} className="ms-table-row" style={{ '--row-index': index } as React.CSSProperties}>
                        <td>
                          <div className="ms-student-cell">
                            <div className="ms-student-avatar">
                              {student.name.charAt(0)}
                            </div>
                            <div className="ms-student-info">
                              <div className="name">{highlightMatch(student.name)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="ms-id-cell">{highlightMatch(student.studentId)}</td>
                        <td>{highlightMatch(student.email)}</td>
                        <td>
                          <span className="ms-grade-badge">Grade {student.gradeLevel}</span>
                        </td>
                        <td>
                          <div className="ms-action-buttons">
                            <button 
                              className="ms-action-btn ms-edit-btn"
                              onClick={() => handleEdit(student)}
                              title="Edit"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                            </button>
                            <button 
                              className="ms-action-btn ms-delete-btn"
                              onClick={() => setShowDeleteConfirm(student.id)}
                              title="Delete"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="ms-pagination">
                <div className="ms-pagination-info">
                  <span>{labels.showing}</span>
                  <select 
                    value={itemsPerPage} 
                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                    className="ms-items-select"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                  </select>
                  <span>{labels.entries}</span>
                </div>
                <div className="ms-pagination-controls">
                  <button 
                    className="ms-page-btn"
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
                      className={`ms-page-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button 
                    className="ms-page-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="ms-empty-state show">
              <div className="ms-empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <h4>{labels.noResults}</h4>
              <p>Coba sesuaikan kriteria pencarian Anda</p>
            </div>
          )}
        </div>
      </main>

      {showDeleteConfirm && (
        <div className="ms-modal-overlay">
          <div className="ms-modal">
            <div className="ms-modal-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h3>{labels.confirmDelete}</h3>
            <p>{students.find(s => s.id === showDeleteConfirm)?.name}?</p>
            <div className="ms-modal-actions">
              <button className="ms-btn ms-btn-secondary" onClick={() => setShowDeleteConfirm(null)}>
                {labels.cancel}
              </button>
              <button className="ms-btn ms-btn-danger" onClick={() => handleDelete(showDeleteConfirm)}>
                {labels.yes}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="ms-toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`ms-toast ${toast.type}`}>
            {toast.type === 'success' && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-10-10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M22 4L12 14.01l-3-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {toast.type === 'error' && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageStudents;
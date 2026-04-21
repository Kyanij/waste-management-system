import { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTags, faPlus, faSearch, faPencil, faTrash, 
  faCheck, faTimes, faTrashCan, faTimesCircle, faCheckCircle,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import { useI18n } from '../../lib/i18n';
import { AppSidebar } from '../AppSidebar/AppSidebar';
import './WasteTypes.css';

interface WasteType {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

const initialWasteTypes: WasteType[] = [
  { id: 'WST-001', name: 'Botol Plastik', nameEn: 'Plastic Bottle', price: 7500, status: 'active', createdAt: '2024-01-01' },
  { id: 'WST-002', name: 'Sampah Kertas', nameEn: 'Paper Waste', price: 6000, status: 'active', createdAt: '2024-01-01' },
  { id: 'WST-003', name: 'Kaleng Aluminium', nameEn: 'Aluminum Can', price: 7500, status: 'active', createdAt: '2024-01-02' },
  { id: 'WST-004', name: 'E-Waste', nameEn: 'E-Waste', price: 45000, status: 'active', createdAt: '2024-01-02' },
  { id: 'WST-005', name: 'Botol Kaca', nameEn: 'Glass Bottle', price: 4500, status: 'active', createdAt: '2024-01-03' },
  { id: 'WST-006', name: 'Sampah Organik', nameEn: 'Organic Waste', price: 1500, status: 'inactive', createdAt: '2024-01-03' },
  { id: 'WST-007', name: 'Kardus', nameEn: 'Cardboard', price: 3750, status: 'active', createdAt: '2024-01-04' },
  { id: 'WST-008', name: 'Sisa Logam', nameEn: 'Metal Scraps', price: 18000, status: 'active', createdAt: '2024-01-04' },
];

const nameIcons: Record<string, string> = {
  'Botol Plastik': 'fa-wine-bottle',
  'Plastic Bottle': 'fa-wine-bottle',
  'Sampah Kertas': 'fa-newspaper',
  'Paper Waste': 'fa-newspaper',
  'Kaleng Aluminium': 'fa-prescription-bottle',
  'Aluminum Can': 'fa-prescription-bottle',
  'E-Waste': 'fa-laptop',
  'Botol Kaca': 'fa-wine-glass',
  'Glass Bottle': 'fa-wine-glass',
  'Sampah Organik': 'fa-apple-alt',
  'Organic Waste': 'fa-apple-alt',
  'Kardus': 'fa-box',
  'Cardboard': 'fa-box',
  'Sisa Logam': 'fa-cogs',
  'Metal Scraps': 'fa-cogs',
};

const translations = {
  id: {
    pageTitle: 'Jenis Sampah',
    pageSubtitle: 'Kelola kategori dan harga sampah',
    totalTypes: 'Total Jenis',
    active: 'Aktif',
    averagePrice: 'Rata-rata Harga',
    perKg: 'Per kilogram',
    highestValue: 'Harga Tertinggi',
    highestValueSub: 'Nilai tertinggi',
    addNewTitle: 'Tambah Jenis Sampah',
    editTitle: 'Edit Jenis Sampah',
    formSubtitle: 'Kelola data jenis sampah baru',
    nameLabel: 'Nama Jenis Sampah',
    priceLabel: 'Harga (Rp)',
    cancel: 'Batal',
    addBtn: 'Tambah Jenis Sampah',
    updateBtn: 'Update Jenis Sampah',
    tableTitle: 'Daftar Jenis Sampah',
    tableSubtitle: 'total jenis sampah',
    searchPlaceholder: 'Cari jenis sampah...',
    noData: 'Tidak ada data',
    noDataDesc: 'Coba sesuaikan pencarian Anda',
    statusActive: 'Aktif',
    statusInactive: 'Tidak Aktif',
    showing: 'Menampilkan',
    dataPerPage: 'data per halaman',
    successAdd: 'ditambahkan dengan ID',
    successUpdate: 'berhasil diperbarui!',
    successDelete: 'dihapus berhasil',
    confirmDelete: 'Apakah Anda yakin ingin menghapus',
    errorNameRequired: 'Nama jenis sampah wajib diisi',
    errorNameMin: 'Nama minimal 3 karakter',
    errorNameExists: 'Jenis sampah sudah ada',
    errorPriceRequired: 'Harga wajib diisi',
    errorPriceHigh: 'Harga terlalu tinggi',
  },
  en: {
    pageTitle: 'Waste Types',
    pageSubtitle: 'Manage waste categories and pricing',
    totalTypes: 'Total Types',
    active: 'Active',
    averagePrice: 'Average Price',
    perKg: 'Per kilogram',
    highestValue: 'Highest Value',
    highestValueSub: 'Highest price',
    addNewTitle: 'Add Waste Type',
    editTitle: 'Edit Waste Type',
    formSubtitle: 'Manage new waste type data',
    nameLabel: 'Waste Type Name',
    priceLabel: 'Price (Rp)',
    cancel: 'Cancel',
    addBtn: 'Add Waste Type',
    updateBtn: 'Update Waste Type',
    tableTitle: 'Waste Type List',
    tableSubtitle: 'total waste types',
    searchPlaceholder: 'Search waste type...',
    noData: 'No data',
    noDataDesc: 'Try adjusting your search',
    statusActive: 'Active',
    statusInactive: 'Inactive',
    showing: 'Showing',
    dataPerPage: 'data per page',
    successAdd: 'added with ID',
    successUpdate: 'updated successfully!',
    successDelete: 'deleted successfully',
    confirmDelete: 'Are you sure you want to delete',
    errorNameRequired: 'Waste type name is required',
    errorNameMin: 'Name must be at least 3 characters',
    errorNameExists: 'Waste type already exists',
    errorPriceRequired: 'Price is required',
    errorPriceHigh: 'Price is too high',
  }
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

export const WasteTypes = () => {
  const { language, setLanguage } = useI18n();
  const isLangEn = language === 'en';
  const t = translations[language];
  
  const [wasteTypes, setWasteTypes] = useState<WasteType[]>(initialWasteTypes);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    price: '',
  });

  const filteredWasteTypes = useMemo(() => {
    return wasteTypes.filter(wt => {
      const name = isLangEn ? wt.nameEn : wt.name;
      return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wt.id.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [wasteTypes, searchTerm, isLangEn]);

  const totalTypes = filteredWasteTypes.length;
  const totalPrice = filteredWasteTypes.reduce((sum, wt) => sum + wt.price, 0);
  const averagePrice = totalTypes > 0 ? Math.round(totalPrice / totalTypes) : 0;
  const highestValue = Math.max(...filteredWasteTypes.map(wt => wt.price), 0);

  const totalPages = Math.ceil(filteredWasteTypes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWasteTypes = filteredWasteTypes.slice(startIndex, startIndex + itemsPerPage);

  const generateNewId = (): string => {
    const num = wasteTypes.length + 1;
    return `WST-${String(num).padStart(3, '0')}`;
  };

  const validateField = (field: 'name' | 'price', value: string): boolean => {
    let isValid = true;
    let message = '';

    if (field === 'name') {
      if (!value.trim()) {
        isValid = false;
        message = t.errorNameRequired;
      } else if (value.trim().length < 3) {
        isValid = false;
        message = t.errorNameMin;
      } else if (!editingId) {
        const exists = wasteTypes.some(wt => {
          const name = isLangEn ? wt.nameEn : wt.name;
          return name.toLowerCase() === value.trim().toLowerCase();
        });
        if (exists) {
          isValid = false;
          message = t.errorNameExists;
        }
      }
    } else if (field === 'price') {
      if (!value || parseFloat(value) <= 0) {
        isValid = false;
        message = t.errorPriceRequired;
      } else if (parseFloat(value) > 1000000) {
        isValid = false;
        message = t.errorPriceHigh;
      }
    }

    setErrors(prev => ({ ...prev, [field]: message }));
    return isValid;
  };

  const handleInputChange = (field: 'name' | 'price', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field: 'name' | 'price') => {
    validateField(field, formData[field]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isNameValid = validateField('name', formData.name);
    const isPriceValid = validateField('price', formData.price);

    if (!isNameValid || !isPriceValid) return;

    if (editingId) {
      setWasteTypes(prev => prev.map(wt => {
        if (wt.id === editingId) {
          return {
            ...wt,
            name: isLangEn ? formData.name.trim() : wt.name,
            nameEn: isLangEn ? wt.nameEn : formData.name.trim(),
            price: parseFloat(formData.price),
            updatedAt: new Date().toISOString().split('T')[0]
          };
        }
        return wt;
      }));
      displayToast(`${formData.name} ${t.successUpdate}`, 'success');
    } else {
      const newId = generateNewId();
      const newWasteType: WasteType = {
        id: newId,
        name: isLangEn ? formData.name.trim() : formData.name.trim(),
        nameEn: isLangEn ? formData.name.trim() : formData.name.trim(),
        price: parseFloat(formData.price),
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setWasteTypes(prev => [newWasteType, ...prev]);
      displayToast(`${formData.name} ${t.successAdd} ${newId}`, 'success');
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', price: '' });
    setErrors({ name: '', price: '' });
    setEditingId(null);
  };

  const handleEdit = (id: string) => {
    const waste = wasteTypes.find(wt => wt.id === id);
    if (!waste) return;

    setEditingId(id);
    const displayName = isLangEn ? waste.nameEn : waste.name;
    setFormData({ name: displayName, price: waste.price.toString() });
  };

  const handleDelete = (id: string) => {
    const waste = wasteTypes.find(wt => wt.id === id);
    if (!waste) return;

    const displayName = isLangEn ? waste.nameEn : waste.name;
    if (confirm(`${t.confirmDelete} "${displayName}" (${id})?`)) {
      setWasteTypes(prev => prev.filter(wt => wt.id !== id));
      displayToast(`${displayName} ${t.successDelete}`, 'success');
      
      if (editingId === id) {
        resetForm();
      }
    }
  };

  const handleToggleStatus = (id: string) => {
    setWasteTypes(prev => prev.map(wt => 
      wt.id === id ? { ...wt, status: wt.status === 'active' ? 'inactive' : 'active' } : wt
    ));
    const waste = wasteTypes.find(wt => wt.id === id);
    if (waste) {
      const displayName = isLangEn ? waste.nameEn : waste.name;
      displayToast(`${displayName} is now ${waste.status === 'active' ? 'inactive' : 'active'}`, 'success');
    }
  };

  const displayToast = (message: string, type: 'success' | 'error') => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  const getIcon = (name: string): string => {
    return nameIcons[name] || 'fa-trash';
  };

  const getDisplayName = (wt: WasteType): string => {
    return isLangEn ? wt.nameEn : wt.name;
  };

  const today = new Date().toLocaleDateString(isLangEn ? 'en-US' : 'id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="waste-types-page">
      <AppSidebar activeNav="wastetypes" />
      
      <div className="wt-ambient-bg">
        <div className="wt-ambient-gradient"></div>
        <div className="wt-blur-orb-1"></div>
        <div className="wt-blur-orb-2"></div>
      </div>

      <div className="wt-main">
        <div className="wt-header">
          <div className="wt-page-title">
            <h2>
              <span className="gradient-text">{t.pageTitle}</span>
            </h2>
            <p>
              <FontAwesomeIcon icon={faTags} />
              {t.pageSubtitle}
            </p>
          </div>
          <div className="wt-header-right">
            <div className="wt-date-display">
              <FontAwesomeIcon icon={faCalendarAlt} />
              {today}
            </div>
            <div className="wt-lang-toggle">
              <button 
                className={`wt-lang-btn ${!isLangEn ? 'active' : ''}`}
                onClick={() => setLanguage('id')}
              >
                ID
              </button>
              <button 
                className={`wt-lang-btn ${isLangEn ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        <div className="wt-stats-grid">
          <div className="wt-stat-card" style={{ animationDelay: '0s' }}>
            <div className="wt-stat-header">
              <div className="wt-stat-info">
                <h3>{totalTypes}</h3>
                <p>{t.totalTypes}</p>
              </div>
              <div className="wt-stat-icon green">
                <FontAwesomeIcon icon={faTags} />
              </div>
            </div>
            <div className="wt-stat-footer">
              <span className="highlight">{t.active}: {wasteTypes.filter(w => w.status === 'active').length}</span>
            </div>
          </div>

          <div className="wt-stat-card" style={{ animationDelay: '0.1s' }}>
            <div className="wt-stat-header">
              <div className="wt-stat-info">
                <h3>{formatCurrency(averagePrice)}</h3>
                <p>{t.averagePrice}</p>
              </div>
              <div className="wt-stat-icon yellow">
                <FontAwesomeIcon icon={faPlus} />
              </div>
            </div>
            <div className="wt-stat-footer">
              {t.perKg}
            </div>
          </div>

          <div className="wt-stat-card" style={{ animationDelay: '0.2s' }}>
            <div className="wt-stat-header">
              <div className="wt-stat-info">
                <h3>{formatCurrency(highestValue)}</h3>
                <p>{t.highestValue}</p>
              </div>
              <div className="wt-stat-icon blue">
                <FontAwesomeIcon icon={faTags} />
              </div>
            </div>
            <div className="wt-stat-footer">
              {t.highestValueSub}
            </div>
          </div>
        </div>

        <div className="wt-card wt-form-card">
          <div className="wt-form-header">
            <div className="wt-form-header-icon">
              <FontAwesomeIcon icon={faPlus} />
            </div>
            <div>
              <h3>{editingId ? t.editTitle : t.addNewTitle}</h3>
              <p>{t.formSubtitle}</p>
            </div>
            {editingId && (
              <button className="wt-cancel-edit" onClick={resetForm}>
                <FontAwesomeIcon icon={faTimes} /> {t.cancel}
              </button>
            )}
          </div>

          <form className="wt-form" onSubmit={handleSubmit}>
            <div className="wt-input-wrapper">
              <input
                type="text"
                className={`wt-input ${errors.name ? 'error' : ''}`}
                placeholder=" "
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
              />
              <label className="wt-floating-label">{t.nameLabel}</label>
              {errors.name && (
                <div className="wt-error-msg show">
                  <FontAwesomeIcon icon={faTimesCircle} />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            <div className="wt-input-wrapper">
              <div className="wt-price-wrapper">
                <span className="wt-currency">Rp</span>
                <input
                  type="number"
                  className={`wt-input wt-price-input ${errors.price ? 'error' : ''}`}
                  placeholder=" "
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  onBlur={() => handleBlur('price')}
                />
                <label className="wt-floating-label currency">{t.priceLabel}</label>
              </div>
              {errors.price && (
                <div className="wt-error-msg show">
                  <FontAwesomeIcon icon={faTimesCircle} />
                  <span>{errors.price}</span>
                </div>
              )}
            </div>

            <button type="submit" className="wt-submit-btn">
              {editingId ? (
                <>
                  <FontAwesomeIcon icon={faCheck} /> {t.updateBtn}
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPlus} /> {t.addBtn}
                </>
              )}
            </button>
          </form>
        </div>

        <div className="wt-card wt-table-card">
          <div className="wt-table-header">
            <div className="wt-table-header-left">
              <h3>{t.tableTitle}</h3>
              <p>{totalTypes} {t.tableSubtitle}</p>
            </div>
            <div className="wt-search-wrapper">
              <FontAwesomeIcon icon={faSearch} />
              <input
                type="text"
                className="wt-search-input"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <div className="wt-table-wrapper">
            <table className="wt-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama / Name</th>
                  <th>Harga / Price</th>
                  <th>Status</th>
                  <th>Aksi / Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedWasteTypes.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="wt-empty-state show">
                        <div className="wt-empty-icon">
                          <FontAwesomeIcon icon={faTrashCan} />
                        </div>
                        <h4>{t.noData}</h4>
                        <p>{t.noDataDesc}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedWasteTypes.map((wt, index) => (
                    <tr 
                      key={wt.id} 
                      className="wt-table-row"
                      style={{ '--row-index': index } as React.CSSProperties}
                    >
                      <td>
                        <span className="wt-id-badge">{wt.id}</span>
                      </td>
                      <td>
                        <div className="wt-name-cell">
                          <div className="wt-name-icon">
                            <FontAwesomeIcon icon={getIcon(getDisplayName(wt)) as any} />
                          </div>
                          <div className="wt-name-info">
                            <div className="name">{getDisplayName(wt)}</div>
                            <div className="date">
                              {wt.createdAt ? `Added: ${wt.createdAt}` : ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="wt-price-tag">
                          <span className="currency">Rp</span>
                          {wt.price.toLocaleString('id-ID')}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`wt-status-btn ${wt.status}`}
                          onClick={() => handleToggleStatus(wt.id)}
                        >
                          <span className="wt-status-dot"></span>
                          {wt.status === 'active' ? t.statusActive : t.statusInactive}
                        </button>
                      </td>
                      <td>
                        <div className="wt-action-buttons">
                          <button
                            className="wt-action-btn wt-edit-btn"
                            onClick={() => handleEdit(wt.id)}
                            title="Edit"
                          >
                            <FontAwesomeIcon icon={faPencil} />
                          </button>
                          <button
                            className="wt-action-btn wt-delete-btn"
                            onClick={() => handleDelete(wt.id)}
                            title="Delete"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredWasteTypes.length > 0 && (
            <div className="wt-pagination">
              <div className="wt-pagination-info">
                <span>{t.showing}</span>
                <select
                  className="wt-items-select"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
                <span>{t.dataPerPage}</span>
              </div>

              <div className="wt-pagination-controls">
                <button
                  className="wt-page-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`wt-page-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="wt-page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  &gt;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showToast && (
        <div className="wt-toast-container">
          <div className={`wt-toast ${showToast.type}`}>
            <div className="wt-toast-icon">
              <FontAwesomeIcon icon={showToast.type === 'success' ? faCheckCircle : faTimesCircle} />
            </div>
            <div className="wt-toast-content">
              <h4>{showToast.type === 'success' ? 'Success!' : 'Error!'}</h4>
              <p>{showToast.message}</p>
            </div>
            <div className="wt-toast-progress"></div>
          </div>
        </div>
      )}
    </div>
  );
};
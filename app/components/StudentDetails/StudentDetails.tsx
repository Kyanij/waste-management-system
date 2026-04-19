import { useState, useMemo, useCallback } from 'react';
import { useI18n } from '../../lib/i18n';
import { wasteTypeConfig } from '../../lib/theme';
import { getInitials, getAvatarColor, filterRecordsByDate, calculateTotals, downloadCSV, formatDate } from '../../lib/utils';
import type { Student } from '../../types';
import { DownloadIcon, UserGroupIcon, PlasticBottleIcon, PaperIcon, CanIcon, EWasteIcon } from '../Icons';

interface StudentDetailsProps {
  student: Student;
}

const wasteIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Plastic Bottles': PlasticBottleIcon,
  'Paper Waste': PaperIcon,
  'Cans': CanIcon,
  'E-Waste': EWasteIcon,
};

export function StudentDetails({ student }: StudentDetailsProps) {
  const { t, language } = useI18n();
  const [dateRange, setDateRange] = useState({
    from: '2022-01-01',
    to: '2022-12-31',
  });

  const filteredRecords = useMemo(() => {
    return filterRecordsByDate(student.records, dateRange.from, dateRange.to);
  }, [student.records, dateRange]);

  const summaryData = useMemo(() => {
    const summary: Record<string, { qty: number; earn: number }> = {};
    
    Object.keys(wasteTypeConfig).forEach((key) => {
      summary[key] = { qty: 0, earn: 0 };
    });

    filteredRecords.forEach((record) => {
      summary[record.type].qty += record.qty;
      summary[record.type].earn += record.earn;
    });

    return summary;
  }, [filteredRecords]);

  const totals = useMemo(() => {
    return calculateTotals(filteredRecords);
  }, [filteredRecords]);

  const avatarColor = useMemo(() => {
    return getAvatarColor(0);
  }, []);

  const handleFromDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange((prev) => ({ ...prev, from: e.target.value }));
  }, []);

  const handleToDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange((prev) => ({ ...prev, to: e.target.value }));
  }, []);

  const handleDownload = useCallback(() => {
    downloadCSV(
      filteredRecords,
      {
        date: t.colDate,
        waste: t.colWaste,
        qty: t.colQty,
        price: t.colPrice,
        earn: t.colEarn,
      },
      `${student.name.replace(' ', '_')}_laporan.csv`
    );
  }, [filteredRecords, student.name, t]);

  const renderWasteBadge = (type: string) => {
    const config = wasteTypeConfig[type as keyof typeof wasteTypeConfig];
    return (
      <span className={`wb ${config.className}`}>
        {language === 'en' ? config.en : config.id}
      </span>
    );
  };

  const renderSummaryCard = (wasteType: string) => {
    const config = wasteTypeConfig[wasteType as keyof typeof wasteTypeConfig];
    const IconComponent = wasteIcons[wasteType];
    const data = summaryData[wasteType];

    return (
      <div className={`sum-card ${config.sumClassName}`}>
        <div className="clbl">
          {IconComponent && <IconComponent className="waste-icon" />}
          {language === 'en' ? config.en : config.id}
        </div>
        <div className="qty">
          {data.qty}
          <span>kg</span>
        </div>
        <div className="ernd">
          {t.earned} <strong>${data.earn.toFixed(2)}</strong>
        </div>
      </div>
    );
  };

  return (
    <div className="student-details">
      <div className="stu-hdr">
        <div
          className="stu-init-lg"
          style={{ background: avatarColor.bg, color: avatarColor.tx }}
        >
          {getInitials(student.name)}
        </div>
        <div className="stu-ttl">
          <h2>{student.name}</h2>
          <div className="sub">
            <span>
              {t.grade} {student.grade}
            </span>
            <span>ID: {student.id}</span>
            <span>
              {student.records.length} {t.collEntries}
            </span>
          </div>
        </div>
      </div>

      <div className="sec-lbl">{t.dateRange}</div>
      <div className="date-row">
        <label>{t.from}</label>
        <input
          type="date"
          id="fromDate"
          value={dateRange.from}
          onChange={handleFromDateChange}
          max={dateRange.to}
        />
        <label>{t.to}</label>
        <input
          type="date"
          id="toDate"
          value={dateRange.to}
          onChange={handleToDateChange}
          min={dateRange.from}
        />
      </div>

      <div className="sec-lbl">{t.collSummary}</div>
      <div className="sum-grid">
        {Object.keys(wasteTypeConfig).map((wasteType) => (
          <div key={wasteType}>{renderSummaryCard(wasteType)}</div>
        ))}
      </div>

      <div className="rpt-section">
        <div className="rpt-hdr">
          <h3>{t.detReport}</h3>
          <button className="btn-dl" onClick={handleDownload}>
            <DownloadIcon className="btn-dl-icon" />
            {t.dlReport}
          </button>
        </div>
        <table className="rpt-table">
          <thead>
            <tr>
              <th>{t.colDate}</th>
              <th>{t.colWaste}</th>
              <th>{t.colQty}</th>
              <th>{t.colPrice}</th>
              <th>{t.colEarn}</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record, index) => (
                <tr key={index}>
                  <td>{formatDate(record.date)}</td>
                  <td>{renderWasteBadge(record.type)}</td>
                  <td>{record.qty} kg</td>
                  <td>${record.price.toFixed(2)}</td>
                  <td className="earn">${record.earn.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>
                  <div className="empty-rpt">{t.noRecords}</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {filteredRecords.length > 0 && (
          <div className="tbl-foot">
            <div className="ti">
              {t.totCollected} <strong>{totals.qty} kg</strong>
            </div>
            <div className="ti">
              {t.totEarnings} <strong>${totals.earn.toFixed(2)}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function EmptyState() {
  const { t } = useI18n();

  return (
    <div className="ph-main">
      <UserGroupIcon className="ph-icon" />
      <p>{t.phText}</p>
    </div>
  );
}
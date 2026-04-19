import { useState, useMemo, useCallback } from 'react';
import { useI18n } from '../../lib/i18n';
import { students as allStudents } from '../../lib/data';
import { getInitials, getAvatarColor, calculateTotals } from '../../lib/utils';
import type { Student } from '../../types';
import { SearchIcon } from '../Icons';

interface SidebarProps {
  selectedStudent: Student | null;
  onSelectStudent: (student: Student) => void;
}

export function Sidebar({ selectedStudent, onSelectStudent }: SidebarProps) {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = useMemo(() => {
    if (!searchQuery) return allStudents;
    const query = searchQuery.toLowerCase();
    return allStudents.filter((student) =>
      student.name.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const totalStats = useMemo(() => {
    const allRecords = allStudents.flatMap((s) => s.records);
    return calculateTotals(allRecords);
  }, []);

  const handleStudentClick = useCallback(
    (student: Student) => {
      onSelectStudent(student);
    },
    [onSelectStudent]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const renderStudentItem = (student: Student, index: number) => {
    const avatarColor = getAvatarColor(index);
    const isActive = selectedStudent?.id === student.id;

    return (
      <div
        key={student.id}
        className={`student-item ${isActive ? 'active' : ''}`}
        onClick={() => handleStudentClick(student)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleStudentClick(student);
          }
        }}
      >
        <div
          className="stu-av"
          style={{ background: avatarColor.bg, color: avatarColor.tx }}
        >
          {getInitials(student.name)}
        </div>
        <div className="stu-info">
          <div className="stu-name">{student.name}</div>
          <div className="stu-meta">
            {t.grade} {student.grade} &middot; {student.id}
          </div>
        </div>
        <span className="stu-arr">&rsaquo;</span>
      </div>
    );
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">{t.sidebarTitle}</h2>
        <div className="search-wrap">
          <SearchIcon className="s-icon" />
          <input
            type="text"
            id="search"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>

      <div className="student-list">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student, index) => {
            const originalIndex = allStudents.findIndex(
              (s) => s.id === student.id
            );
            return renderStudentItem(student, originalIndex);
          })
        ) : (
          <div className="no-results">{t.noResults}</div>
        )}
      </div>

      <div className="sb-stats">
        <div className="stat">
          <div className="sv">{allStudents.length}</div>
          <div className="sl">{t.slStudents}</div>
        </div>
        <div className="stat">
          <div className="sv">{totalStats.qty} kg</div>
          <div className="sl">{t.slKg}</div>
        </div>
        <div className="stat">
          <div className="sv">${totalStats.earn.toFixed(2)}</div>
          <div className="sl">{t.slEarned}</div>
        </div>
      </div>
    </aside>
  );
}
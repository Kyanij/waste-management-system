import { avatarColors } from './theme';
import type { Student } from '../types';
import type { AvatarColor } from '../types';

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

export function getAvatarColor(index: number): AvatarColor {
  return avatarColors[index % avatarColors.length];
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export function calculateTotals(records: Student['records']) {
  return records.reduce(
    (acc, record) => ({
      qty: acc.qty + record.qty,
      earn: acc.earn + record.earn,
    }),
    { qty: 0, earn: 0 }
  );
}

export function filterRecordsByDate(
  records: Student['records'],
  from: string,
  to: string
) {
  return records
    .filter((record) => record.date >= from && record.date <= to)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function downloadCSV(
  records: Student['records'],
  headers: { date: string; waste: string; qty: string; price: string; earn: string },
  fileName: string
) {
  const rows = records.map((r) =>
    [formatDate(r.date), r.type, r.qty, r.price.toFixed(2), r.earn.toFixed(2)].join(',')
  );
  const headerRow = [headers.date, headers.waste, headers.qty, headers.price, headers.earn].join(',');
  const blob = new Blob([[headerRow, ...rows].join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
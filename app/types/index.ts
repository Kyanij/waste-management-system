export type Language = 'en' | 'id';

export interface CollectionRecord {
  date: string;
  type: WasteType;
  qty: number;
  earn: number;
  price: number;
}

export interface Student {
  id: string;
  name: string;
  grade: number;
  records: CollectionRecord[];
}

export type WasteType = 'Plastic Bottles' | 'Paper Waste' | 'Cans' | 'E-Waste';

export interface WasteTypeConfig {
  en: string;
  id: string;
  className: string;
  sumClassName: string;
  icon: string;
}

export interface AvatarColor {
  bg: string;
  tx: string;
}

export interface TranslationKeys {
  appTitle: string;
  portalBadge: string;
  sidebarTitle: string;
  searchPlaceholder: string;
  slStudents: string;
  slKg: string;
  slEarned: string;
  phText: string;
  noResults: string;
  grade: string;
  collEntries: string;
  dateRange: string;
  from: string;
  to: string;
  apply: string;
  collSummary: string;
  earned: string;
  detReport: string;
  dlReport: string;
  colDate: string;
  colWaste: string;
  colQty: string;
  colPrice: string;
  colEarn: string;
  totCollected: string;
  totEarnings: string;
  noRecords: string;
}

export interface Translations {
  en: TranslationKeys;
  id: TranslationKeys;
}
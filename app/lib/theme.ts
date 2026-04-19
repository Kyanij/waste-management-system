import type { WasteTypeConfig, AvatarColor, WasteType } from '../types';

export const theme = {
  colors: {
    green: {
      50: '#eaf3de',
      100: '#c0dd97',
      200: '#97c459',
      400: '#639922',
      600: '#3b6d11',
      700: '#2e560d',
      800: '#27500a',
      900: '#173404',
    },
    amber: {
      50: '#faeeda',
      200: '#ef9f27',
      600: '#854f0b',
    },
    blue: {
      50: '#e6f1fb',
      400: '#378add',
      600: '#185fa5',
    },
    red: {
      50: '#fcebeb',
      400: '#e24b4a',
      600: '#a32d2d',
    },
    gray: {
      50: '#f9f8f5',
      100: '#f1efe8',
      200: '#d3d1c7',
      400: '#888780',
      600: '#5f5e5a',
      900: '#2c2c2a',
    },
    radius: '10px',
    radiusSm: '6px',
  },
} as const;

export const wasteTypeConfig: Record<WasteType, WasteTypeConfig> = {
  'Plastic Bottles': {
    en: 'Plastic Bottles',
    id: 'Botol Plastik',
    className: 'wp',
    sumClassName: 'cp',
    icon: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18',
  },
  'Paper Waste': {
    en: 'Paper Waste',
    id: 'Sampah Kertas',
    className: 'ww',
    sumClassName: 'cw',
    icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6',
  },
  'Cans': {
    en: 'Cans',
    id: 'Kaleng',
    className: 'wc',
    sumClassName: 'cc',
    icon: 'M22 12h-4l-3 9L9 3l-3 9H2',
  },
  'E-Waste': {
    en: 'E-Waste',
    id: 'Sampah Elektronik',
    className: 'we',
    sumClassName: 'ce',
    icon: 'M5 2h14a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2zM12 18v2',
  },
};

export const avatarColors: AvatarColor[] = [
  { bg: '#e6f1fb', tx: '#185fa5' },
  { bg: '#eaf3de', tx: '#27500a' },
  { bg: '#faeeda', tx: '#633806' },
  { bg: '#fcebeb', tx: '#791f1f' },
  { bg: '#fbeaf0', tx: '#72243e' },
  { bg: '#e1f5ee', tx: '#085041' },
];

export const defaultDateRange = {
  from: '2022-01-01',
  to: '2022-12-31',
};
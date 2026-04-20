interface IconProps {
  className?: string;
}

export function RecycleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" />
    </svg>
  );
}

export function GlobeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <polyline points="6 9 12 15 18 9" fill="none" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function DownloadIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" fill="none" stroke="currentColor" strokeWidth="2" />
      <polyline points="7 10 12 15 17 10" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function UserGroupIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path
        d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="9" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function PlasticBottleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path
        d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export function PaperIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path
        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <polyline points="14 2 14 8 20 8" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function CanIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path
        d="M22 12h-4l-3 9L9 3l-3 9H2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export function EWasteIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <rect
        x="5"
        y="2"
        width="14"
        height="20"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line x1="12" y1="18" x2="12.01" y2="18" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path d="M5 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SpinnerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="60" strokeDashoffset="20" />
    </svg>
  );
}

export function CheckCircleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path d="M22 11.08V12a10 10 0 11-10-10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 4L12 14.01l-3-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ErrorIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
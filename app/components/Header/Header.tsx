import { useI18n } from '../../lib/i18n';
import type { Language } from '../../types';
import { RecycleIcon, GlobeIcon, ChevronDownIcon } from '../Icons';

interface HeaderProps {
  onLanguageChange?: (lang: Language) => void;
}

export function Header({ onLanguageChange }: HeaderProps) {
  const { language, setLanguage, t } = useI18n();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as Language;
    setLanguage(newLang);
    onLanguageChange?.(newLang);
  };

  return (
    <header className="header">
      <div className="header-logo">
        <RecycleIcon className="header-logo-icon" />
        <h1 className="header-title">{t.appTitle}</h1>
      </div>
      <div className="header-right">
        <span className="portal-badge">{t.portalBadge}</span>
        <div className="lang-wrap">
          <span className="lang-globe">
            <GlobeIcon />
          </span>
          <select
            id="langSelect"
            value={language}
            onChange={handleLanguageChange}
            className="lang-select"
          >
            <option value="en">English</option>
            <option value="id">Indonesian</option>
          </select>
          <span className="lang-chevron">
            <ChevronDownIcon />
          </span>
        </div>
      </div>
    </header>
  );
}
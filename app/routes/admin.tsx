import type { Route } from "./+types/admin";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "../context/ToastContext";
import { I18nProvider, useI18n } from "../lib/i18n";
import type { Language } from "../types";
import { AdminLogin } from "../components/AdminLogin/AdminLogin";
import { GlobeIcon, ChevronDownIcon } from "../components/Icons";
import "../components/AdminLogin/AdminLogin.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin Login - Recycling Reward System" },
    { name: "description", content: "Secure admin access to waste collection management" },
  ];
}

function AdminLanguageSelector() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="admin-header-lang">
      <span className="lang-globe-icon">
        <GlobeIcon />
      </span>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="admin-lang-select"
      >
        <option value="en">English</option>
        <option value="id">Indonesian</option>
      </select>
      <span className="lang-chevron-icon">
        <ChevronDownIcon />
      </span>
    </div>
  );
}

export default function Admin() {
  return (
    <I18nProvider>
      <ToastProvider>
        <AuthProvider>
          <div className="admin-page">
            <AdminLanguageSelector />
            <AdminLogin />
          </div>
        </AuthProvider>
      </ToastProvider>
    </I18nProvider>
  );
}
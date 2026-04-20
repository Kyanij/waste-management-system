import { useState, useCallback, memo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useI18n } from '../../lib/i18n';
import './EcoLogin.css';

const loginSchema = yup.object().shape({
  email: yup.string().required('Email is required').email('Invalid email'),
  password: yup.string().required('Password is required').min(6, 'Min 6 characters'),
});

interface LoginFormValues {
  email: string;
  password: string;
}

function EcoLoginComponent() {
  const { login, isLoading } = useAuth();
  const { showToast, toasts } = useToast();
  const { t, language, setLanguage } = useI18n();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loginForm = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  });

  const handleLogin = useCallback(async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login({ ...data, rememberMe });
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1500);
    } catch {
      showToast('error', 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  }, [login, rememberMe, showToast, navigate]);

  const togglePassword = useCallback(() => setShowPassword(!showPassword), [showPassword]);
  const toggleRemember = useCallback(() => setRememberMe(!rememberMe), [rememberMe]);

  const isLangEn = language === 'en';

  if (isSuccess) {
    return (
      <div className="eco-container">
        <div className="eco-login-card">
          <div className="eco-success-checkmark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <div className="eco-success-text">
            <h2>{isLangEn ? 'Welcome Back!' : 'Selamat Datang Kembali!'}</h2>
            <p>{isLangEn ? 'Redirecting...' : 'Mengalihkan...'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="eco-container">
      {/* Floating Background */}
      <div className="eco-bg-animation">
        <div className="eco-particle particle-1"></div>
        <div className="eco-particle particle-2"></div>
        <div className="eco-particle particle-3"></div>
        <div className="eco-waste bottle-1"></div>
        <div className="eco-waste bottle-2"></div>
        <div className="eco-waste paper-1"></div>
        <div className="eco-waste paper-2"></div>
        <div className="eco-waste can-1"></div>
        <div className="eco-waste can-2"></div>
      </div>
      <div className="eco-grid-overlay"></div>

      {/* Language Toggle */}
      <div className="language-switch">
        <div 
          className="lang-slider" 
          style={{ width: isLangEn ? 'calc(50% - 4px)' : 'calc(50% - 4px)', left: isLangEn ? '4px' : '50%' }}
        />
        <span className={`lang-option ${isLangEn ? 'active' : ''}`} onClick={() => setLanguage('en')}>EN</span>
        <span className={`lang-option ${!isLangEn ? 'active' : ''}`} onClick={() => setLanguage('id')}>ID</span>
      </div>

<div className="eco-cards-container">
        {/* University Info Card - FIRST */}
        <div className="eco-login-card uni-card">

          {/* University Logos */}
          <div className="affiliation-logos">
            <img src="/assests/logo/1.jpeg" alt="Partner Institution 1" className="aff-logo" />
            <img src="/assests/logo/2.jpeg" alt="Partner Institution 2" className="aff-logo" />
            <img src="/assests/logo/3.jpeg" alt="Partner Institution 3" className="aff-logo" />
          </div>

          {/* Program Title */}
          <h2 className="uni-program">
            {isLangEn ? 'Lecturer Research Program' : 'Program Penelitian Dosen'}
          </h2>

          {/* University Name */}
          <p className="uni-name">Universitas Muhammadiyah Muara Bungo</p>

          {/* Divider */}
          <div className="uni-divider"></div>

  

          {/* Tagline */}
          <p className="uni-tagline">
            {isLangEn ? 'Sustainable Campus Through Education & Innovation' : 'Kampus Berkelanjutan Melalui Pendidikan & Inovasi'}
          </p>
        </div>

        {/* Login Card - SECOND */}
        <div className="eco-login-card">
          {/* Header with Logo */}
          <div className="eco-header">
            <div className="eco-logo-container">
              <img src="/logo.png" alt="EcoCampus Logo" className="eco-logo-img" />
            </div>
            <h1 className="eco-title">EcoCampus Admin</h1>
            <p className="eco-subtitle">
              {isLangEn ? 'Waste Management & Recycling System' : 'Sistem Manajemen Sampah & Daur Ulang'}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="eco-form">
            <div className="eco-form-group">
              <div className="eco-input-wrapper">
                <svg className="eco-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  {...loginForm.register('email')}
                  type="email"
                  className="eco-input"
                  placeholder={isLangEn ? 'Username / Email' : 'Nama Pengguna / Email'}
                />
              </div>
              {loginForm.formState.errors.email && (
                <span className="eco-error">{loginForm.formState.errors.email.message}</span>
              )}
            </div>

            <div className="eco-form-group">
              <div className="eco-input-wrapper">
                <svg className="eco-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <input
                  {...loginForm.register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="eco-input"
                  placeholder={isLangEn ? 'Password' : 'Kata Sandi'}
                />
                <svg className="eco-password-toggle" onClick={togglePassword} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {showPassword ? (
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 6.38m0 0a1 1 0 01-1-1m-1 1a1 1 0 001 1"/>
                  ) : (
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  )}
                </svg>
              </div>
              {loginForm.formState.errors.password && (
                <span className="eco-error">{loginForm.formState.errors.password.message}</span>
              )}
            </div>

            <div className="eco-options">
              <label className="eco-remember" onClick={toggleRemember}>
                <div className={`eco-custom-checkbox ${rememberMe ? 'checked' : ''}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </div>
                <span>{isLangEn ? 'Remember me' : 'Ingat saya'}</span>
              </label>
              <a href="#" className="eco-forgot">
                {isLangEn ? 'Forgot Password?' : 'Lupa Password?'}
              </a>
            </div>

            <button type="submit" className="eco-login-btn" disabled={isSubmitting || isLoading}>
              <span>{isLangEn ? 'Sign In' : 'Masuk'}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </form>

          {/* Stats Section */}
          <div className="eco-stats">
            <div className="eco-stat">
              <span className="eco-stat-value">2.5K+</span>
              <span className="eco-stat-label">{isLangEn ? 'Users' : 'Pengguna'}</span>
            </div>
            <div className="eco-stat">
              <span className="eco-stat-value">15K</span>
              <span className="eco-stat-label">{isLangEn ? 'KG Recycled' : 'KG Didaur'}</span>
            </div>
            <div className="eco-stat">
              <span className="eco-stat-value">98%</span>
              <span className="eco-stat-label">{isLangEn ? 'Efficiency' : 'Efisiensi'}</span>
            </div>
          </div>

          {/* Waste Categories */}
          <div className="eco-categories">
            <div className="eco-cat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
              </svg>
              <span>Plastic</span>
            </div>
            <div className="eco-cat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <span>Paper</span>
            </div>
            <div className="eco-cat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
              <span>Metal</span>
            </div>
          </div>

          {/* Footer */}
          <div className="eco-footer">
            <span>{isLangEn ? 'Made with' : 'Dibuat dengan'}</span>
            <svg className="eco-heart" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            <span>{isLangEn ? 'for a greener campus' : 'untuk kampus yang lebih hijau'}</span>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <div className="eco-toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`eco-toast ${toast.type}`} role="alert">
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const EcoLogin = memo(EcoLoginComponent);
EcoLogin.displayName = 'EcoLogin';
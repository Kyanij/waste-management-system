import { useState, useCallback, memo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useI18n } from '../../lib/i18n';
import { RecycleIcon, ArrowRightIcon, SpinnerIcon, CheckCircleIcon, ErrorIcon } from '../Icons';
import './AdminLogin.css';

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email address is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

interface LoginFormValues {
  email: string;
  password: string;
}

const defaultValues: LoginFormValues = {
  email: '',
  password: '',
};

function AdminLoginComponent() {
  const { login, isLoading, error: authError, clearError } = useAuth();
  const { showToast, toasts } = useToast();
  const { t } = useI18n();
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues,
    mode: 'onChange',
  });

  const isFormSubmitting = isSubmitting || isLoading;

  const onSubmit = useCallback(
    async (data: LoginFormValues) => {
      clearError();
      try {
        await login({ ...data, rememberMe });
        showToast('success', 'Login successful! Redirecting...');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } catch {
        showToast('error', authError?.message || 'Login failed. Please try again.');
      }
    },
    [login, clearError, authError, showToast, rememberMe]
  );

  const onError = useCallback(() => {
    showToast('error', 'Please fix the form errors before submitting.');
  }, [showToast]);

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="admin-badge">
          <RecycleIcon className="badge-icon" />
          {t.adminBadge || 'Secure Admin Access'}
        </div>

        <div className="login-header">
          <h1>{t.adminTitle || 'Admin Portal'}</h1>
          <p>{t.adminSubtitle || 'Waste Collection Management System'}</p>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit(onSubmit, onError)}
          noValidate
        >
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              {t.emailLabel || 'Email Address'}
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className={`form-control ${errors.email ? 'form-control-error' : ''}`}
              placeholder="admin@example.com"
              autoComplete="email"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p className="form-error" id="email-error" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              {t.passwordLabel || 'Password'}
            </label>
            <input
              {...register('password')}
              type="password"
              id="password"
              className={`form-control ${errors.password ? 'form-control-error' : ''}`}
              placeholder="Enter your password"
              autoComplete="current-password"
              aria-invalid={errors.password ? 'true' : 'false'}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {errors.password && (
              <p className="form-error" id="password-error" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="form-options">
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>{t.rememberMe || 'Remember me'}</span>
            </label>
            <a href="#" className="forgot-link">
              {t.forgotPassword || 'Forgot password?'}
            </a>
          </div>

          <button
            type="submit"
            className="btn-login"
            disabled={isFormSubmitting}
            aria-busy={isFormSubmitting}
          >
            {isFormSubmitting ? (
              <>
                <SpinnerIcon className="btn-spinner" />
                {t.signingIn || 'Signing In...'}
              </>
            ) : (
              <>
                <span>{t.signIn || 'Sign In'}</span>
                <ArrowRightIcon className="btn-icon" />
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {t.footerText || 'Protected route. Authorized personnel only.'}
            <br />
            {t.footerContact || 'Contact IT support if you need access reset.'}
          </p>
        </div>
      </div>

      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            role="alert"
          >
            {toast.type === 'success' ? (
              <CheckCircleIcon className="toast-icon" />
            ) : (
              <ErrorIcon className="toast-icon" />
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const AdminLogin = memo(AdminLoginComponent);
AdminLogin.displayName = 'AdminLogin';
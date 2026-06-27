import { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ThemeToggle from './ThemeToggle';
import CityLogo from './CityLogo';
const DEMO_ACCOUNTS = [
  { role: 'inspector', username: 'inspector', password: 'inspector123' },
  { role: 'admin', username: 'admin', password: 'admin123' },
];
// comm
const showDemo = import.meta.env.VITE_SHOW_DEMO !== 'false';

function FeatureIcon({ type }) {
  if (type === 'verify') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinejoin="round" />
      </svg>
    );
  }


  if (type === 'mobile') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <path d="M11 18h2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 3l8 4v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Login() {
  const { user, login } = useAuth();
  const { t, lang, setLang, systemName } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const usernameRef = useRef(null);

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const canSubmit = username.trim().length > 0 && password.length > 0 && !loading;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError('');

    try {
      await login(username.trim(), password);
    } catch {
      setError(t('loginError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (account) => {
    setUsername(account.username);
    setPassword(account.password);
    setError('');
  };

  return (
    <div className="guest-dashboard">
      <div className="guest-bg-shape guest-bg-shape-1" aria-hidden="true" />
      <div className="guest-bg-shape guest-bg-shape-2" aria-hidden="true" />

      <div className="guest-top-bar">
        <ThemeToggle className="theme-toggle-guest" />
        <label className="lang-switch lang-switch-guest">
          <span>{t('language')}</span>
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="en">{t('english')}</option>
            <option value="am">{t('amharic')}</option>
            <option value="om">{t('oromo')}</option>
          </select>
        </label>
      </div>

      <div className="guest-layout">
        <aside className="guest-brand-panel">
          <header className="guest-hero">
            <div className="hero-badge guest-hero-badge">
              <CityLogo />
            </div>
            <p className="app-eyebrow guest-eyebrow">{t('appEyebrow')}</p>
            <h1 className="guest-system-name">{systemName}</h1>
            <p className="guest-subtitle">{t('loginSubtitle')}</p>
          </header>

          <ul className="guest-features">
            <li className="guest-feature">
              <span className="guest-feature-icon" aria-hidden="true">
                <FeatureIcon type="verify" />
              </span>
              <span>{t('guestFeature1')}</span>
            </li>
            <li className="guest-feature">
              <span className="guest-feature-icon" aria-hidden="true">
                <FeatureIcon type="mobile" />
              </span>
              <span>{t('guestFeature2')}</span>
            </li>
            <li className="guest-feature">
              <span className="guest-feature-icon" aria-hidden="true">
                <FeatureIcon type="secure" />
              </span>
              <span>{t('guestFeature3')}</span>
            </li>
          </ul>
        </aside>

        <main className="guest-login-panel">
          <div className="guest-login-card">
            <h2 className="guest-login-title">{t('loginTitle')}</h2>
            <p className="guest-login-hint">{t('loginSecureNote')}</p>

            <form className="guest-login-form" onSubmit={handleSubmit} noValidate>
              <label htmlFor="username" className="guest-label">{t('username')}</label>
              <div className="guest-input-wrap">
                <svg className="guest-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" strokeLinecap="round" />
                </svg>
                <input
                  ref={usernameRef}
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  placeholder={t('username')}
                  disabled={loading}
                />
              </div>

              <label htmlFor="password" className="guest-label">{t('password')}</label>
              <div className="guest-input-wrap guest-input-wrap-password">
                <svg className="guest-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                  <path d="M8 11V8a4 4 0 118 0v3" strokeLinecap="round" />
                </svg>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder={t('password')}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="guest-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                  title={showPassword ? t('hidePassword') : t('showPassword')}
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" strokeLinecap="round" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" strokeLinecap="round" />
                      <path d="M1 1l22 22" strokeLinecap="round" />
                      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {error && <p className="form-error guest-error" role="alert">{error}</p>}

              <button type="submit" className="btn btn-primary btn-guest-signin" disabled={!canSubmit}>
                {loading ? (
                  <>
                    <span className="btn-spinner" aria-hidden="true" />
                    {t('signingIn')}
                  </>
                ) : (
                  t('signIn')
                )}
              </button>
            </form>

            {showDemo && (
              <section className="guest-demo">
                <p className="guest-demo-title">{t('demoAccounts')}</p>
                <p className="guest-demo-hint">{t('tapToFill')}</p>
                <div className="guest-demo-chips">
                  {DEMO_ACCOUNTS.map((account) => (
                    <button
                      key={account.role}
                      type="button"
                      className={`guest-demo-chip guest-demo-chip-${account.role}`}
                      onClick={() => handleDemoFill(account)}
                      disabled={loading}
                    >
                      <span className="guest-demo-role">
                        {account.role === 'inspector' ? t('inspectorRole') : t('adminRole')}
                      </span>
                      <code>{account.username}</code>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>

          <p className="guest-footer">{t('loginFooter')}</p>
        </main>
      </div>
    </div>
  );
}

export default Login;


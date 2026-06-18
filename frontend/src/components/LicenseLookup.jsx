import { useState } from 'react';
import { fetchBusiness } from '../api/businessApi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const showDemo = import.meta.env.VITE_SHOW_DEMO !== 'false';

function formatBalance(amount) {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateString, lang) {
  const locale = lang === 'am' ? 'am-ET' : lang === 'om' ? 'om-ET' : 'en-GB';
  return new Date(dateString).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function StatusIcon({ type }) {
  if (type === 'active') {
    return (
      <div className="status-icon status-icon-active" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  if (type === 'expired') {
    return (
      <div className="status-icon status-icon-expired" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      </div>
    );
  }

  return (
    <div className="status-icon status-icon-not-found" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20L16 16" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function LicenseLookup() {
  const { user } = useAuth();
  const { t, lang, systemName } = useLanguage();
  const [licenseNumber, setLicenseNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const runLookup = async (trimmed) => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await fetchBusiness(trimmed);

      if (data.notFound) {
        setResult({ notFound: true, licenseNumber: trimmed });
      } else {
        setResult(data);
      }
    } catch {
      setError(t('serverError'));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    const trimmed = licenseNumber.trim();
    if (!trimmed) {
      setError(t('enterLicense'));
      return;
    }

    await runLookup(trimmed);
  };

  const handleDemoClick = async (license) => {
    setLicenseNumber(license);
    setError('');
    await runLookup(license);
  };

  const handleReset = () => {
    setLicenseNumber('');
    setResult(null);
    setError('');
  };

  console.log(result);
  if (result && !result.notFound) {
    const isActive = result.is_active;

    return (
      <div className={`result-screen result-screen-enhanced ${isActive ? 'result-active' : 'result-expired'}`}>
        <div className="result-content result-content-enhanced">
          <StatusIcon type={isActive ? 'active' : 'expired'} />
          <span className={`result-badge ${isActive ? 'badge-active' : 'badge-expired'}`}>
            {isActive ? t('active') : t('unpaid')}
          </span>
          <h1 className="result-status">
            {isActive ? t('licenseValid') : t('paymentRequired')}
          </h1>

          {!isActive && (
            <div className="result-balance-card">
              <span className="result-balance-label">{t('balanceDue')}</span>
              <strong className="result-balance-amount">{formatBalance(result.balance_due)}</strong>
            </div>
          )}

          <dl className="result-details result-details-enhanced">
            <div className="detail-row">
              <dt>{t('license')}</dt>
              <dd>{result.license_number}</dd>
            </div>
            <div className="detail-row">
              <dt>{t('owner')}</dt>
              <dd>{result.owner_name}</dd>
            </div>
            <div className="detail-row">
              <dt>{t('subCity')}</dt>
              <dd>{result.sub_city}</dd>
            </div>
            <div className="detail-row">
              <dt>{t('expiry')}</dt>
              <dd>{formatDate(result.expiry_date, lang)}</dd>
            </div>
            <div className="detail-row">
              <dt>{t('status')}</dt>
              <dd>{result.payment_status === 'Paid' ? t('paid') : t('expired')}</dd>
            </div>
          </dl>

          <button type="button" className="btn btn-secondary btn-glass" onClick={handleReset}>
            {t('checkAnother')}
          </button>
        </div>
      </div>
    );
  }

  if (result?.notFound) {
    return (
      <div className="result-screen result-screen-enhanced result-not-found">
        <div className="result-content result-content-enhanced">
          <StatusIcon type="not-found" />
          <span className="result-badge badge-not-found">{t('notFound')}</span>
          <h1 className="result-status">{t('noRecord')}</h1>
          <p className="result-message">
            {t('license')} <strong>{result.licenseNumber}</strong> {t('notInSystem')}
          </p>
          <button type="button" className="btn btn-primary btn-dark" onClick={handleReset}>
            {t('searchAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="inspector-dashboard">
      <div className="inspector-hero">
        <div className="hero-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M3 21h18M5 21V7l7-4 7 4v14" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="app-eyebrow hero-eyebrow">{t('appEyebrow')}</p>
        <h1 className="hero-title">{systemName}</h1>
        <p className="hero-subtitle">{t('appSubtitle')}</p>

        {user && (
          <div className="inspector-welcome">
            <span className="welcome-dot" aria-hidden="true" />
            <span>{t('welcome')}, <strong>{user.full_name}</strong></span>
          </div>
        )}
      </div>

      <div className="inspector-stats">
        <div className="stat-card stat-paid">
          <span className="stat-dot" />
          <span>{t('demoPaid')}</span>
        </div>
        <div className="stat-card stat-expired">
          <span className="stat-dot" />
          <span>{t('demoExpired')}</span>
        </div>
      </div>

      <form className="search-form search-form-enhanced" onSubmit={handleSearch}>
        <label htmlFor="license-number" className="search-label">
          {t('licenseNumber')}
        </label>
        <div className="search-input-wrap">
          <svg className="search-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20L16 16" strokeLinecap="round" />
          </svg>
          <input
            id="license-number"
            type="text"
            value={licenseNumber}
            onChange={(event) => setLicenseNumber(event.target.value)}
            placeholder={t('licensePlaceholder')}
            autoComplete="off"
            autoCapitalize="characters"
          />
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <button type="submit" className="btn btn-primary btn-search" disabled={loading}>
          {loading ? (
            <>
              <span className="btn-spinner" aria-hidden="true" />
              {t('checking')}
            </>
          ) : (
            t('checkLicense')
          )}
        </button>
      </form>

      {showDemo && (
        <section className="demo-section">
          <p className="demo-section-title">{t('demoLicenses')}</p>
          <div className="demo-chips">
            <button
              type="button"
              className="demo-chip demo-chip-paid"
              onClick={() => handleDemoClick('ADM-2024-0001')}
              disabled={loading}
            >
              <span className="chip-dot" />
              <code>ADM-2024-0001</code>
            </button>
            <button
              type="button"
              className="demo-chip demo-chip-expired"
              onClick={() => handleDemoClick('ADM-2024-0002')}
              disabled={loading}
            >
              <span className="chip-dot" />
              <code>ADM-2024-0002</code>
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

export default LicenseLookup;

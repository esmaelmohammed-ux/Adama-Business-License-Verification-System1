import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ThemeToggle from './ThemeToggle';
function AppShell({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const { lang, setLang, t, systemNameShort } = useLanguage();
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  // comm
  if (isLogin) {
    return children;
  }
  return (
    <div className="app-shell">
      <nav className="top-nav">
        <div className="nav-left">
          <Link to="/" className="nav-brand" title={systemNameShort}>{systemNameShort}</Link>
          {user && (
            <span className="nav-user">{t('welcome')}, {user.full_name}</span>
          )}
        </div>
        <div className="nav-right">
          <ThemeToggle />
          <label className="lang-switch">
            <span>{t('language')}</span>
            <select value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="en">{t('english')}</option>
              <option value="am">{t('amharic')}</option>
              <option value="om">{t('oromo')}</option>
            </select>
          </label>
          {user && (
            <>
              <Link to="/" className="nav-link">{t('audit')}</Link>
              {isAdmin && (
                <Link to="/admin" className="nav-link">{t('adminPanel')}</Link>
              )}
              <button type="button" className="btn btn-nav" onClick={logout}>
                {t('logout')}
              </button>
            </>
          )}
        </div>
      </nav>
      {children}
    </div>
  );
}

export default AppShell;




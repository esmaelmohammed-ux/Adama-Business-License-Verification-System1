import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchMe, login as loginRequest } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('ketelelema_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('ketelelema_token'));

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    fetchMe(token)
      .then((data) => {
        if (!cancelled) setUser(data);
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem('ketelelema_token');
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [token]);

  const value = useMemo(() => ({
    token,
    user,
    loading,
    isAdmin: user?.role === 'admin',
    login: async (username, password) => {
      const data = await loginRequest(username, password);
      localStorage.setItem('ketelelema_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    },
    logout: () => {
      localStorage.removeItem('ketelelema_token');
      setToken(null);
      setUser(null);
    },
  }), [token, user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

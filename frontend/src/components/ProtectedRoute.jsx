import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
// comment 
  if (loading) {
    return <div className="loading-screen">…</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;



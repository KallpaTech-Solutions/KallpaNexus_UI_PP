import { Navigate, useLocation } from 'react-router-dom';
import { isAdminTokenValid } from '../utils/adminAuth';

export default function ProtectedAdminRoute({ children }) {
  const location = useLocation();
  if (!isAdminTokenValid()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

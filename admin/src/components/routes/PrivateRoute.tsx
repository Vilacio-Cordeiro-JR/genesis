import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const PrivateRoute = () => {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return (
      <div role="status" className="grid min-h-screen place-items-center text-sm text-slate-400">
        Verificando sessão...
      </div>
    );
  }

  if (status === 'unauthenticated') return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
};

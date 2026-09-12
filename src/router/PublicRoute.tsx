import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { ROUTES } from './routes';

const PublicRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return isAuthenticated ? <Navigate to={ROUTES.ROOT} replace /> : <Outlet />;
};

export default PublicRoute;

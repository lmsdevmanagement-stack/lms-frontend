import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/app/constants/routes';
import { USER_ROLES } from '@/app/constants/roles';
import { getCurrentUser, logout } from '@/app/redux/slices/authSlice';
import type { AppDispatch, RootState } from '@/app/redux/store';

export function useDashboardAuth() {
  const { user, role, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(APP_ROUTES.login);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated, user]);

  const handleLogout = () => {
    dispatch(logout());
    router.push(APP_ROUTES.login);
  };

  return {
    user,
    role,
    isAuthenticated,
    isSuperAdmin: role === USER_ROLES.superAdmin,
    organizationId: user?.organization_id || 1,
    schoolId: user?.school_id || null,
    handleLogout,
  };
}

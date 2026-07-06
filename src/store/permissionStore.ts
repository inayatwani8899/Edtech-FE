import { create } from 'zustand';
import api from '@/api/axios';
import { PermissionItem } from '@/types/types';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from './useAuthStore';

interface PermissionState {
  permissions: PermissionItem[];
  loading: boolean;
  error: string | null;
  permissionsLoaded: boolean;
  fetchPermissions: (force?: boolean) => Promise<void>;
  clearPermissions: () => void;
}

let fetchPermissionsController: AbortController | null = null;

export const usePermissionStore = create<PermissionState>((set, get) => ({
  permissions: [],
  loading: false,
  error: null,
  permissionsLoaded: false,

  fetchPermissions: async (force = false) => {
    // Return early if permissions are already loaded and reload is not forced
    if (!force && get().permissionsLoaded) {
      return;
    }

    // If a request is already in progress, abort it to deduplicate and prevent race conditions
    if (fetchPermissionsController) {
      fetchPermissionsController.abort();
    }
    fetchPermissionsController = new AbortController();
    const ctrl = fetchPermissionsController;

    set({ loading: true, error: null });

    try {
      const response = await api.get('/Permission/getpermissions', {
        signal: ctrl.signal,
      });

      // Verify that this is still the active request
      if (ctrl !== fetchPermissionsController) return;

      const data = response.data;
      const permissionList = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);

      set({ permissions: permissionList, loading: false, permissionsLoaded: true });
    } catch (error: unknown) {
      if ((error as { name?: string })?.name === 'CanceledError' || (error as { code?: string })?.code === 'ERR_CANCELED') {
        return;
      }
      
      if (ctrl === fetchPermissionsController) {
        const msg = (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Failed to fetch permissions';
        set({ error: msg, loading: false, permissions: [], permissionsLoaded: false });
      }
    }
  },

  clearPermissions: () => {
    set({ permissions: [], error: null, loading: false, permissionsLoaded: false });
  },
}));

// Utility function to match current route to permission items (exact or prefix matching)
export const matchPermission = (pathname: string, permissions: PermissionItem[]): PermissionItem | undefined => {
  // 1. Exact match
  let found = permissions.find(p => p.url === pathname);
  if (found) return found;

  // 2. Prefix matching (sort descending by url length to match deep sub-paths first)
  const sorted = [...permissions].sort((a, b) => b.url.length - a.url.length);
  found = sorted.find(p => p.url !== '/' && pathname.startsWith(p.url));
  return found;
};

// Hook for page-level CRUD permission gates
export function usePagePermissions() {
  const location = useLocation();
  const { user } = useAuthStore();
  const permissions = usePermissionStore((s) => s.permissions);
  const loaded = usePermissionStore((s) => s.permissionsLoaded);

  const match = matchPermission(location.pathname, permissions);

  // SuperAdmin has global authorization bypass
  if (user?.role === "SuperAdmin") {
    return { canView: true, canCreate: true, canEdit: true, canDelete: true, loading: false };
  }

  // If path is a general route (dashboard, profile, etc.) or guest page, bypass security checks
  const isSecuredPath = 
    location.pathname.startsWith('/manage') || 
    location.pathname.startsWith('/rbac') || 
    location.pathname.startsWith('/school');

  if (!isSecuredPath) {
    return { canView: true, canCreate: true, canEdit: true, canDelete: true, loading: false };
  }

  if (!loaded) {
    return { canView: false, canCreate: false, canEdit: false, canDelete: false, loading: true };
  }

  return {
    canView: match ? match.canView : false,
    canCreate: match ? match.canCreate : false,
    canEdit: match ? match.canEdit : false,
    canDelete: match ? match.canDelete : false,
    loading: false,
  };
}

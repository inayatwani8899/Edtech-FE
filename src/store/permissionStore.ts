import { create } from 'zustand';
import api from '@/api/axios';
import { PermissionItem } from '@/types/types';

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

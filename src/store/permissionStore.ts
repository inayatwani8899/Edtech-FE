import { create } from 'zustand';
import api from '@/api/axios';
import { PermissionItem } from '@/types/types';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from './useAuthStore';

interface PermissionState {
  permissions: PermissionItem[];
  menus: PermissionItem[];
  isSuperAdmin: boolean;
  loading: boolean;
  loaded: boolean;
  permissionsLoaded: boolean;
  error: string | null;
  fetchPermissions: (force?: boolean) => Promise<void>;
  fetchMenus: (roleId: string | number, force?: boolean) => Promise<void>;
  clearPermissions: () => void;
  clearMenus: () => void;
  getPermission: (url: string) => PermissionItem | undefined;
  canView: (url: string) => boolean;
  canCreate: (url: string) => boolean;
  canEdit: (url: string) => boolean;
  canDelete: (url: string) => boolean;
}

let fetchPermissionsController: AbortController | null = null;

export const usePermissionStore = create<PermissionState>((set, get) => ({
  permissions: [],
  menus: [],
  isSuperAdmin: false,
  loading: false,
  loaded: false,
  permissionsLoaded: false,
  error: null,

  fetchPermissions: async (force = false) => {
    const roleId = useAuthStore.getState().user?.roleId || localStorage.getItem("roleId");
    if (roleId) {
      return get().fetchMenus(roleId, force);
    }

    if (!force && get().loaded) {
      return;
    }

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

      if (ctrl !== fetchPermissionsController) return;

      const data = response.data;
      let permissionList = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);

      const user = useAuthStore.getState().user;
      const isSuperAdmin = user?.role === "SuperAdmin" || user?.role === "Admin";
      if (isSuperAdmin) {
        permissionList = permissionList.filter((item: any) => !item.url?.startsWith('/counselor'));
      }

      set({
        permissions: permissionList,
        menus: permissionList,
        loaded: true,
        permissionsLoaded: true,
        loading: false
      });
    } catch (error: unknown) {
      if ((error as { name?: string })?.name === 'CanceledError' || (error as { name?: string })?.name === 'AbortError' || (error as { code?: string })?.code === 'ERR_CANCELED') {
        return;
      }

      if (ctrl === fetchPermissionsController) {
        const msg = (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Failed to fetch permissions';
        set({
          error: msg,
          loading: false,
          permissions: [],
          menus: [],
          loaded: false,
          permissionsLoaded: false
        });
      }
    }
  },

  fetchMenus: async (roleId: string | number, force = false) => {
    if (!force && (get().loaded || get().loading)) {
      return;
    }

    if (fetchPermissionsController) {
      fetchPermissionsController.abort();
    }
    fetchPermissionsController = new AbortController();
    const ctrl = fetchPermissionsController;

    set({ loading: true, error: null });

    try {
      const response = await api.get(`/Permission/role/${roleId}`, {
        signal: ctrl.signal,
      });

      if (ctrl !== fetchPermissionsController) return;

      const data = response.data;
      let permissionList = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);

      const user = useAuthStore.getState().user;
      const isSuperAdmin = user?.role === "SuperAdmin" || user?.role === "Admin";
      if (isSuperAdmin) {
        permissionList = permissionList.filter((item: any) => !item.url?.startsWith('/counselor'));
      }

      set({
        permissions: permissionList,
        menus: permissionList,
        loaded: true,
        permissionsLoaded: true,
        isSuperAdmin: user?.role === "SuperAdmin",
        loading: false
      });
    } catch (error: unknown) {
      if ((error as { name?: string })?.name === 'CanceledError' || (error as { name?: string })?.name === 'AbortError' || (error as { code?: string })?.code === 'ERR_CANCELED') {
        return;
      }

      if (ctrl === fetchPermissionsController) {
        const msg = (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Failed to fetch role permissions';
        set({
          error: msg,
          loading: false,
          permissions: [],
          menus: [],
          loaded: false,
          permissionsLoaded: false
        });
      }
    }
  },

  clearPermissions: () => {
    get().clearMenus();
  },

  clearMenus: () => {
    set({
      permissions: [],
      menus: [],
      isSuperAdmin: false,
      error: null,
      loading: false,
      loaded: false,
      permissionsLoaded: false
    });
  },

  getPermission: (url: string) => {
    const permissions = get().permissions;
    const user = useAuthStore.getState().user;

    if (user?.role === "SuperAdmin") {
      return {
        menuId: 99999,
        title: "SuperAdmin Bypass",
        url,
        icon: "Shield",
        sortOrder: 0,
        parentId: null,
        canView: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
      } as PermissionItem;
    }

    return matchPermission(url, permissions);
  },

  canView: (url: string) => {
    const perm = get().getPermission(url);
    return perm ? perm.canView : false;
  },

  canCreate: (url: string) => {
    const perm = get().getPermission(url);
    return perm ? perm.canCreate : false;
  },

  canEdit: (url: string) => {
    const perm = get().getPermission(url);
    return perm ? perm.canEdit : false;
  },

  canDelete: (url: string) => {
    const perm = get().getPermission(url);
    return perm ? perm.canDelete : false;
  },
}));

export const matchPermission = (pathname: string, permissions: PermissionItem[]): PermissionItem | undefined => {
  let found = permissions.find(p => p.url === pathname);
  if (found) return found;

  const sorted = [...permissions].sort((a, b) => b.url.length - a.url.length);
  found = sorted.find(p => p.url !== '/' && pathname.startsWith(p.url));
  return found;
};

export function usePagePermissions() {
  const location = useLocation();
  const { user } = useAuthStore();
  const permissions = usePermissionStore((s) => s.permissions);
  const loaded = usePermissionStore((s) => s.loaded || s.permissionsLoaded);

  if (user?.role === "SuperAdmin") {
    return { canView: true, canCreate: true, canEdit: true, canDelete: true, loading: false };
  }

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

  const match = matchPermission(location.pathname, permissions);

  return {
    canView: match ? match.canView : false,
    canCreate: match ? match.canCreate : false,
    canEdit: match ? match.canEdit : false,
    canDelete: match ? match.canDelete : false,
    loading: false,
  };
}

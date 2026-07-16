import { create } from 'zustand';
import api from '@/api/axios';
import { PermissionItem } from '@/types/types';

interface OrgPermissionState {
  orgPermissions: PermissionItem[];
  loading: boolean;
  saving: boolean;
  error: string | null;

  fetchOrgPermissions: (roleId: string | number) => Promise<void>;
  assignOrgRolePermission: (payload: {
    roleId: string | number;
    menuId: string | number;
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  }) => Promise<void>;
  updateOrgRolePermission: (payload: {
    id: string | number;
    roleId: string | number;
    menuId: string | number;
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  }) => Promise<void>;
  assignOrgUserPermission: (payload: {
    userId: string | number;
    menuId: string | number;
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  }) => Promise<void>;
  bulkAssignOrgRolePermissions: (payload: {
    roleId: number;
    tenant: string | null;
    organizationId: number | null;
    permissions: {
      menuId: number;
      canView: boolean;
      canCreate: boolean;
      canEdit: boolean;
      canDelete: boolean;
    }[];
  }) => Promise<void>;
  bulkUpdateOrgRolePermissions: (payload: {
    roleId: number;
    tenant: string | null;
    organizationId: number | null;
    permissions: {
      menuId: number;
      canView: boolean;
      canCreate: boolean;
      canEdit: boolean;
      canDelete: boolean;
    }[];
  }) => Promise<void>;
}

let fetchOrgController: AbortController | null = null;

export const useOrganizationPermissionStore = create<OrgPermissionState>((set, get) => ({
  orgPermissions: [],
  loading: false,
  saving: false,
  error: null,

  fetchOrgPermissions: async (roleId) => {
    if (!roleId || roleId === 'undefined' || roleId === 'null') {
      set({ orgPermissions: [] });
      return;
    }

    if (fetchOrgController) fetchOrgController.abort();
    fetchOrgController = new AbortController();
    const ctrl = fetchOrgController;

    set({ loading: true, error: null });
    try {
      const response = await api.get('/organization/OrganizationPermission/permissions', {
        params: { roleId },
        signal: ctrl.signal,
      });

      if (ctrl !== fetchOrgController) return;

      const data = response.data;
      const list = (data?.data ?? data ?? []) as PermissionItem[];
      set({ orgPermissions: list, loading: false });
    } catch (err: unknown) {
      const e = err as { name?: string; response?: { data?: { message?: string } } };
      if (e.name === 'CanceledError' || e.name === 'AbortError' || (err as { code?: string }).code === 'ERR_CANCELED') return;
      if (ctrl !== fetchOrgController) return;

      set({ error: e.response?.data?.message ?? 'Failed to load organization permissions.', loading: false, orgPermissions: [] });
    }
  },

  assignOrgRolePermission: async (payload) => {
    set({ saving: true, error: null });
    try {
      const formatted = {
        roleId: Number(payload.roleId),
        menuId: Number(payload.menuId),
        canView: Boolean(payload.canView),
        canCreate: Boolean(payload.canCreate),
        canEdit: Boolean(payload.canEdit),
        canDelete: Boolean(payload.canDelete),
      };
      await api.post('/organization/OrganizationPermission/assign-role-permission', formatted);
      set({ saving: false });
      await get().fetchOrgPermissions(payload.roleId);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      set({ error: e.response?.data?.message ?? 'Failed to assign role permission.', saving: false });
      throw err;
    }
  },

  updateOrgRolePermission: async (payload) => {
    set({ saving: true, error: null });
    try {
      const formatted = {
        id: Number(payload.id),
        roleId: Number(payload.roleId),
        menuId: Number(payload.menuId),
        canView: Boolean(payload.canView),
        canCreate: Boolean(payload.canCreate),
        canEdit: Boolean(payload.canEdit),
        canDelete: Boolean(payload.canDelete),
      };
      await api.put('/organization/OrganizationPermission/update-role-permission', formatted);
      set({ saving: false });
      await get().fetchOrgPermissions(payload.roleId);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      set({ error: e.response?.data?.message ?? 'Failed to update role permission.', saving: false });
      throw err;
    }
  },

  assignOrgUserPermission: async (payload) => {
    set({ saving: true, error: null });
    try {
      const formatted = {
        userId: Number(payload.userId),
        menuId: Number(payload.menuId),
        canView: Boolean(payload.canView),
        canCreate: Boolean(payload.canCreate),
        canEdit: Boolean(payload.canEdit),
        canDelete: Boolean(payload.canDelete),
      };
      await api.post('/organization/OrganizationPermission/assign-user-permission', formatted);
      set({ saving: false });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      set({ error: e.response?.data?.message ?? 'Failed to assign user permission override.', saving: false });
      throw err;
    }
  },

  bulkAssignOrgRolePermissions: async (payload) => {
    set({ saving: true, error: null });
    try {
      const formatted = {
        roleId: Number(payload.roleId),
        tenant: payload.tenant,
        organizationId: payload.organizationId ? Number(payload.organizationId) : null,
        permissions: payload.permissions.map(p => ({
          menuId: Number(p.menuId),
          canView: Boolean(p.canView),
          canCreate: Boolean(p.canCreate),
          canEdit: Boolean(p.canEdit),
          canDelete: Boolean(p.canDelete),
        })),
      };
      await api.post('/organization/OrganizationPermission/bulk-assign-role-permission', formatted);
      set({ saving: false });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      set({ error: e.response?.data?.message ?? 'Failed bulk assign of organization permissions.', saving: false });
      throw err;
    }
  },

  bulkUpdateOrgRolePermissions: async (payload) => {
    set({ saving: true, error: null });
    try {
      const formatted = {
        roleId: Number(payload.roleId),
        tenant: payload.tenant,
        organizationId: payload.organizationId ? Number(payload.organizationId) : null,
        permissions: payload.permissions.map(p => ({
          menuId: Number(p.menuId),
          canView: Boolean(p.canView),
          canCreate: Boolean(p.canCreate),
          canEdit: Boolean(p.canEdit),
          canDelete: Boolean(p.canDelete),
        })),
      };
      await api.put('/organization/OrganizationPermission/bulk-update-role-permission', formatted);
      set({ saving: false });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      set({ error: e.response?.data?.message ?? 'Failed bulk update of organization permissions.', saving: false });
      throw err;
    }
  },
}));

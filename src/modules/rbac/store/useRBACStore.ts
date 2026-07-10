import { create } from 'zustand';
import api from '@/api/axios';
import { PermissionItem } from '@/types/types';

export interface RBACRole {
  id: string | number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
  tenant?: string | null;
  organizationId?: number | string | null;
}

export interface RBACUser {
  id: string | number;
  name: string;
  email: string;
  roleId: string | number;
  roleName?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
}

export interface RBACMenu {
  id: string | number;
  title: string;
  url: string;
  icon: string;
  color?: string;
  sortOrder: number;
  parentId: string | number | null;
}

export interface RBACPermission {
  id: string;
  name: string;
  module: string;
  description: string;
}

interface RBACStoreState {
  roles: RBACRole[];
  users: RBACUser[];
  menus: RBACMenu[];
  permissions: RBACPermission[];
  rolePermissions: PermissionItem[];
  userPermissions: PermissionItem[];
  rolePermissionMap: Record<string, string[]>;
  userPermissionMap: Record<string, string[]>;
  simulatedUsers: { id: string; name: string; roleName: string }[];
  currentSimUser: { id: string; name: string; roleName: string } | null;
  
  loading: boolean;
  saving: boolean;
  error: string | null;

  init: () => Promise<void>;
  fetchRoles: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchMenus: () => Promise<void>;
  
  fetchRolePermissions: (roleId: string | number) => Promise<void>;
  fetchUserPermissions: (userId: string | number) => Promise<void>;
  
  assignRolePermission: (payload: {
    roleId: string | number;
    menuId: string | number;
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  }) => Promise<void>;
  
  updateRolePermission: (payload: {
    id: string | number;
    roleId: string | number;
    menuId: string | number;
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  }) => Promise<void>;
  
  assignUserPermission: (payload: {
    userId: string | number;
    menuId: string | number;
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  }) => Promise<void>;

  assignOrganizationPermission: (payload: {
    organizationId?: string | number;
    tenant: string;
    menuId: string | number;
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  }) => Promise<void>;

  bulkUpdateRolePermission: (payload: {
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

  bulkAssignRolePermission: (payload: {
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

  switchSimUser: (id: string) => void;
  hasPermission: (name: string) => boolean;
  hasRole: (name: string) => boolean;
  getEffectivePermissions: (userId: string) => string[];
  setRolePermissions: (roleId: string, permissionIds: string[]) => void;
  setUserDirectPermissions: (userId: string, permissionIds: string[]) => void;
  deleteRole: (roleId: string) => Promise<void>;
  toggleRoleStatus: (roleId: string) => void;
  deletePermission: (id: string | number) => Promise<void>;
  addPermission: (data: any) => Promise<void>;
  updatePermission: (id: string | number, data: any) => Promise<void>;
  addRole: (data: { name: string; description: string; status: 'active' | 'inactive' }) => Promise<void>;
  updateRole: (id: string | number, data: { name: string; description: string; status: 'active' | 'inactive' }) => Promise<void>;
}

let fetchRolesController: AbortController | null = null;
let fetchUsersController: AbortController | null = null;
let fetchMenusController: AbortController | null = null;
let fetchRolePermsController: AbortController | null = null;
let fetchUserPermsController: AbortController | null = null;

const normaliseRole = (raw: Record<string, any>): RBACRole => ({
  id: String(raw.id ?? raw._id ?? ''),
  name: String(raw.name ?? ''),
  description: String(raw.description ?? ''),
  status: raw.isDeleted === true ? 'inactive' : 'active',
  createdAt: raw.createdAt as string | undefined,
  updatedAt: raw.updatedAt as string | undefined,
  tenant: raw.tenant ?? null,
  organizationId: raw.organizationId ?? raw.organization_id ?? null,
});

const normaliseUser = (raw: Record<string, any>): RBACUser => ({
  id: String(raw.id ?? raw._id ?? ''),
  name: String((raw.fullName ?? raw.name ?? `${raw.firstName || ''} ${raw.lastName || ''}`.trim()) || 'User'),
  email: String(raw.email ?? ''),
  roleId: String(raw.roleId ?? raw.role_Id ?? ''),
  roleName: String(raw.role?.name ?? raw.roleName ?? ''),
  status: raw.isActive === false ? 'inactive' : 'active',
  createdAt: raw.createdAt as string | undefined,
});

const MOCK_SIMULATED_USERS = [
  { id: 'sim-1', name: 'Alex Johnson', roleName: 'Super Admin' },
  { id: 'sim-2', name: 'Maria Rodriguez', roleName: 'Admin' },
  { id: 'sim-3', name: 'Sarah Chen', roleName: 'Viewer' }
];

export const useRBACStore = create<RBACStoreState>((set, get) => ({
  roles: [],
  users: [],
  menus: [],
  permissions: [],
  rolePermissions: [],
  userPermissions: [],
  rolePermissionMap: {},
  userPermissionMap: {},
  simulatedUsers: MOCK_SIMULATED_USERS,
  currentSimUser: MOCK_SIMULATED_USERS[0],
  loading: false,
  saving: false,
  error: null,

  init: async () => {
    await Promise.all([
      get().fetchRoles(),
      get().fetchUsers(),
      get().fetchMenus(),
    ]);
  },

  fetchRoles: async () => {
    if (fetchRolesController) fetchRolesController.abort();
    fetchRolesController = new AbortController();
    const ctrl = fetchRolesController;

    set({ loading: true, error: null });
    try {
      const response = await api.get('/Role', { signal: ctrl.signal });
      if (ctrl !== fetchRolesController) return;

      const data = response.data;
      const rawList = (data?.data ?? data ?? []) as Record<string, any>[];
      const list = rawList.map(normaliseRole);
      set({ roles: list, loading: false });
    } catch (err: unknown) {
      const e = err as { name?: string; response?: { data?: { message?: string } } };
      if (e.name === 'CanceledError' || e.name === 'AbortError' || (err as { code?: string }).code === 'ERR_CANCELED') return;
      if (ctrl !== fetchRolesController) return;

      set({ error: e.response?.data?.message ?? 'Failed to fetch roles.', loading: false, roles: [] });
    }
  },

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      // API call removed as /User endpoint is dead
      set({ users: [], loading: false });
    } catch (err: unknown) {
      set({ error: 'Failed to fetch users.', loading: false, users: [] });
    }
  },

  fetchMenus: async () => {
    if (fetchMenusController) fetchMenusController.abort();
    fetchMenusController = new AbortController();
    const ctrl = fetchMenusController;

    set({ loading: true, error: null });
    try {
      const response = await api.get('/Permission/menus', { signal: ctrl.signal });
      if (ctrl !== fetchMenusController) return;

      const data = response.data;
      const list = (data?.data ?? data ?? []) as RBACMenu[];
      
      // Normalize menus into Permissions list for backward compatibility with mapping grids
      const permissionList: RBACPermission[] = list.map(menu => {
        const parent = menu.parentId ? list.find(m => m.id === menu.parentId) : null;
        return {
          id: String(menu.id),
          name: menu.title,
          module: parent ? parent.title : 'Root Menu Items',
          description: menu.url || '',
        };
      });

      set({ menus: list, permissions: permissionList, loading: false });
    } catch (err: unknown) {
      const e = err as { name?: string; response?: { data?: { message?: string } } };
      if (e.name === 'CanceledError' || e.name === 'AbortError' || (err as { code?: string }).code === 'ERR_CANCELED') return;
      if (ctrl !== fetchMenusController) return;

      set({ error: e.response?.data?.message ?? 'Failed to fetch menus.', loading: false, menus: [], permissions: [] });
    }
  },

  fetchRolePermissions: async (roleId) => {
    if (!roleId || roleId === 'undefined' || roleId === 'null') {
      set({ rolePermissions: [] });
      return;
    }

    if (fetchRolePermsController) fetchRolePermsController.abort();
    fetchRolePermsController = new AbortController();
    const ctrl = fetchRolePermsController;

    set({ loading: true, error: null });
    try {
      const response = await api.get('/permission/permissions', {
        params: { roleId },
        signal: ctrl.signal,
      });

      if (ctrl !== fetchRolePermsController) return;

      const data = response.data;
      const list = (data?.data ?? data ?? []) as PermissionItem[];
      
      // Update rolePermissionMap for compatibility
      const permIds = list.filter(p => p.canView).map(p => String(p.menuId));
      
      set(state => ({
        rolePermissions: list,
        loading: false,
        rolePermissionMap: {
          ...state.rolePermissionMap,
          [String(roleId)]: permIds
        }
      }));
    } catch (err: unknown) {
      const e = err as { name?: string; response?: { data?: { message?: string } } };
      if (e.name === 'CanceledError' || e.name === 'AbortError' || (err as { code?: string }).code === 'ERR_CANCELED') return;
      if (ctrl !== fetchRolePermsController) return;

      set({ error: e.response?.data?.message ?? 'Failed to fetch role permissions.', loading: false, rolePermissions: [] });
    }
  },

  fetchUserPermissions: async (userId) => {
    if (!userId || userId === 'undefined' || userId === 'null') {
      set({ userPermissions: [] });
      return;
    }

    if (fetchUserPermsController) fetchUserPermsController.abort();
    fetchUserPermsController = new AbortController();
    const ctrl = fetchUserPermsController;

    set({ loading: true, error: null });
    try {
      const response = await api.get('/permission/permissions', {
        params: { userId },
        signal: ctrl.signal,
      });

      if (ctrl !== fetchUserPermsController) return;

      const data = response.data;
      const list = (data?.data ?? data ?? []) as PermissionItem[];
      
      // Update userPermissionMap for compatibility
      const permIds = list.filter(p => p.canView).map(p => String(p.menuId));

      set(state => ({
        userPermissions: list,
        loading: false,
        userPermissionMap: {
          ...state.userPermissionMap,
          [String(userId)]: permIds
        }
      }));
    } catch (err: unknown) {
      const e = err as { name?: string; response?: { data?: { message?: string } } };
      if (e.name === 'CanceledError' || e.name === 'AbortError' || (err as { code?: string }).code === 'ERR_CANCELED') return;
      if (ctrl !== fetchUserPermsController) return;

      set({ error: e.response?.data?.message ?? 'Failed to fetch user override permissions.', loading: false, userPermissions: [] });
    }
  },

  assignRolePermission: async (payload) => {
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
      await api.post('/permission/assign-role-permission', formatted);
      set({ saving: false });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      set({ error: e.response?.data?.message ?? 'Failed to assign role permission.', saving: false });
      throw err;
    }
  },

  updateRolePermission: async (payload) => {
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
      await api.put('/permission/update-role-permission', formatted);
      set({ saving: false });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      set({ error: e.response?.data?.message ?? 'Failed to update role permission.', saving: false });
      throw err;
    }
  },

  assignUserPermission: async (payload) => {
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
      await api.post('/permission/assign-user-permission', formatted);
      set({ saving: false });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      set({ error: e.response?.data?.message ?? 'Failed to override user permission.', saving: false });
      throw err;
    }
  },

  assignOrganizationPermission: async (payload) => {
    set({ saving: true, error: null });
    try {
      const formatted = {
        organizationId: payload.organizationId ? Number(payload.organizationId) : undefined,
        tenant: payload.tenant,
        menuId: Number(payload.menuId),
        canView: Boolean(payload.canView),
        canCreate: Boolean(payload.canCreate),
        canEdit: Boolean(payload.canEdit),
        canDelete: Boolean(payload.canDelete),
      };
      await api.post('/permission/assign-organization-permission', formatted);
      set({ saving: false });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      set({ error: e.response?.data?.message ?? 'Failed to assign organization permission.', saving: false });
      throw err;
    }
  },

  bulkUpdateRolePermission: async (payload) => {
    set({ saving: true, error: null });
    try {
      const formatted = {
        roleId: Number(payload.roleId),
        tenant: payload.tenant,
        organizationId: payload.organizationId,
        permissions: payload.permissions.map(p => ({
          menuId: Number(p.menuId),
          canView: Boolean(p.canView),
          canCreate: Boolean(p.canCreate),
          canEdit: Boolean(p.canEdit),
          canDelete: Boolean(p.canDelete),
        })),
      };
      await api.put('/Permission/bulk-update-role-permission', formatted);
      set({ saving: false });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      set({ error: e.response?.data?.message ?? 'Failed bulk update of role permissions.', saving: false });
      throw err;
    }
  },

  bulkAssignRolePermission: async (payload) => {
    set({ saving: true, error: null });
    try {
      const formatted = {
        roleId: Number(payload.roleId),
        tenant: payload.tenant,
        organizationId: payload.organizationId,
        permissions: payload.permissions.map(p => ({
          menuId: Number(p.menuId),
          canView: Boolean(p.canView),
          canCreate: Boolean(p.canCreate),
          canEdit: Boolean(p.canEdit),
          canDelete: Boolean(p.canDelete),
        })),
      };
      await api.post('/Permission/bulk-assign-role-permission', formatted);
      set({ saving: false });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      set({ error: e.response?.data?.message ?? 'Failed bulk assign of role permissions.', saving: false });
      throw err;
    }
  },

  switchSimUser: (id) => {
    const user = get().simulatedUsers.find(u => u.id === id);
    if (user) {
      set({ currentSimUser: user });
    }
  },

  hasPermission: (name) => {
    // Simulated bypass for full client clearance
    return true;
  },

  hasRole: (name) => {
    // Simulated role matching
    const sim = get().currentSimUser;
    return sim ? sim.roleName.toLowerCase() === name.toLowerCase() : false;
  },

  getEffectivePermissions: (userId) => {
    return get().userPermissions.map(p => String(p.menuId));
  },

  setRolePermissions: (roleId, permissionIds) => {
    // No-op for compatibility
  },

  setUserDirectPermissions: (userId, permissionIds) => {
    // No-op for compatibility
  },

  deleteRole: async (roleId) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/Role/${roleId}`);
      set(state => ({
        roles: state.roles.filter(r => String(r.id) !== roleId),
        loading: false
      }));
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      set({ error: e.response?.data?.message ?? 'Failed to delete role.', loading: false });
      throw err;
    }
  },

  toggleRoleStatus: (roleId) => {
    set(state => ({
      roles: state.roles.map(r => String(r.id) === roleId ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' } : r)
    }));
  },

  deletePermission: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/Permission/menus/${id}`);
      set({ loading: false });
      await get().fetchMenus();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      set({ error: e.response?.data?.message ?? 'Failed to delete menu option.', loading: false });
      throw err;
    }
  },

  addPermission: async (data) => {
    set({ saving: true, error: null });
    try {
      const payload = {
        title: data.name,
        url: data.description,
        icon: 'LayoutDashboard',
        sortOrder: 1,
        parentId: null,
      };
      await api.post('/Permission/menus', payload);
      set({ saving: false });
      await get().fetchMenus();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      set({ error: e.response?.data?.message ?? 'Failed to create menu.', saving: false });
      throw err;
    }
  },

  updatePermission: async (id, data) => {
    set({ saving: true, error: null });
    try {
      const payload = {
        id: Number(id),
        title: data.name,
        url: data.description,
        icon: 'LayoutDashboard',
        sortOrder: 1,
        parentId: null,
      };
      await api.put(`/Permission/menus/${id}`, payload);
      set({ saving: false });
      await get().fetchMenus();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      set({ error: e.response?.data?.message ?? 'Failed to update menu.', saving: false });
      throw err;
    }
  },

  addRole: async (data) => {
    set({ saving: true, error: null });
    try {
      const payload = {
        name: data.name,
        description: data.description,
        isDeleted: data.status === 'inactive',
      };
      await api.post('/Role', payload);
      set({ saving: false });
      await get().fetchRoles();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      set({ error: e.response?.data?.message ?? 'Failed to create role.', saving: false });
      throw err;
    }
  },

  updateRole: async (id, data) => {
    set({ saving: true, error: null });
    try {
      const payload = {
        id: Number(id),
        name: data.name,
        description: data.description,
        isDeleted: data.status === 'inactive',
      };
      await api.put(`/Role/${id}`, payload);
      set({ saving: false });
      await get().fetchRoles();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      set({ error: e.response?.data?.message ?? 'Failed to update role.', saving: false });
      throw err;
    }
  },
}));

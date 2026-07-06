import { create } from 'zustand';
import api from '@/api/axios';

export interface MenuItem {
  id: string | number;
  title: string;
  url: string;
  icon: string;
  color?: string;
  sortOrder: number;
  parentId: string | number | null;
}

export interface PermissionType {
  id: number;
  name: string;
  code: string;
}

interface MenuState {
  menus: MenuItem[];
  menuTree: any[];
  permissionTypes: PermissionType[];
  menuPermissionTypes: PermissionType[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  fetchMenus: () => Promise<void>;
  fetchMenuTree: () => Promise<void>;
  createMenu: (data: Omit<MenuItem, 'id'>) => Promise<any>;
  updateMenu: (id: string | number, data: Partial<MenuItem>) => Promise<void>;
  deleteMenu: (id: string | number) => Promise<void>;
  fetchPermissionTypes: () => Promise<void>;
  fetchMenuPermissionTypes: (menuId: string | number) => Promise<void>;
  assignMenuPermissionTypes: (menuId: string | number, permissionTypeIds: number[]) => Promise<void>;
}

let fetchMenusController: AbortController | null = null;
let fetchMenuTreeController: AbortController | null = null;
let fetchPermissionTypesController: AbortController | null = null;
let fetchMenuPermissionTypesController: AbortController | null = null;

export const useMenuStore = create<MenuState>((set, get) => ({
  menus: [],
  menuTree: [],
  permissionTypes: [],
  menuPermissionTypes: [],
  loading: false,
  saving: false,
  error: null,

  fetchMenus: async () => {
    if (fetchMenusController) fetchMenusController.abort();
    fetchMenusController = new AbortController();
    const ctrl = fetchMenusController;

    set({ loading: true, error: null });
    try {
      const response = await api.get('/Permission/menus', { signal: ctrl.signal });
      if (ctrl !== fetchMenusController) return;

      const data = response.data;
      const list = (data?.data ?? data ?? []) as MenuItem[];
      set({ menus: list, loading: false });
    } catch (err: unknown) {
      const e = err as { name?: string; response?: { data?: { message?: string } } };
      if (e.name === 'CanceledError' || (err as { code?: string }).code === 'ERR_CANCELED') return;
      if (ctrl !== fetchMenusController) return;

      set({ error: e.response?.data?.message ?? 'Failed to load menus.', loading: false, menus: [] });
    }
  },

  createMenu: async (data) => {
    set({ saving: true, error: null });
    try {
      const payload = {
        title: data.title,
        url: data.url,
        icon: data.icon,
        color: data.color || '',
        sortOrder: Number(data.sortOrder),
        parentId: data.parentId ? Number(data.parentId) : null,
      };
      const response = await api.post('/Permission/menus', payload);
      set({ saving: false });
      await get().fetchMenus();
      return response.data?.data ?? response.data;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      set({ error: e.response?.data?.message ?? 'Failed to create menu.', saving: false });
      throw err;
    }
  },

  updateMenu: async (id, data) => {
    set({ saving: true, error: null });
    try {
      const payload = {
        id: Number(id),
        title: data.title,
        url: data.url,
        icon: data.icon,
        color: data.color || '',
        sortOrder: Number(data.sortOrder),
        parentId: data.parentId ? Number(data.parentId) : null,
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

  deleteMenu: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/Permission/menus/${id}`);
      set({ loading: false });
      await get().fetchMenus();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      set({ error: e.response?.data?.message ?? 'Failed to delete menu.', loading: false });
      throw err;
    }
  },

  fetchMenuTree: async () => {
    if (fetchMenuTreeController) fetchMenuTreeController.abort();
    fetchMenuTreeController = new AbortController();
    const ctrl = fetchMenuTreeController;

    set({ loading: true, error: null });
    try {
      const response = await api.get('/Permission/menu-tree', { signal: ctrl.signal });
      if (ctrl !== fetchMenuTreeController) return;

      const data = response.data;
      const list = (data?.data ?? data ?? []) as any[];
      set({ menuTree: list, loading: false });
    } catch (err: unknown) {
      const e = err as { name?: string; response?: { data?: { message?: string } } };
      if (e.name === 'CanceledError' || (err as { code?: string }).code === 'ERR_CANCELED') return;
      if (ctrl !== fetchMenuTreeController) return;

      set({ error: e.response?.data?.message ?? 'Failed to load menu tree.', loading: false, menuTree: [] });
    }
  },

  fetchPermissionTypes: async () => {
    if (fetchPermissionTypesController) fetchPermissionTypesController.abort();
    fetchPermissionTypesController = new AbortController();
    const ctrl = fetchPermissionTypesController;

    set({ loading: true, error: null });
    try {
      const response = await api.get('/Permission/permission-types', { signal: ctrl.signal });
      if (ctrl !== fetchPermissionTypesController) return;

      const data = response.data;
      const list = (data?.data ?? data ?? []) as PermissionType[];
      set({ permissionTypes: list, loading: false });
    } catch (err: unknown) {
      const e = err as { name?: string; response?: { data?: { message?: string } } };
      if (e.name === 'CanceledError' || (err as { code?: string }).code === 'ERR_CANCELED') return;
      if (ctrl !== fetchPermissionTypesController) return;

      set({ error: e.response?.data?.message ?? 'Failed to load permission types.', loading: false, permissionTypes: [] });
    }
  },

  fetchMenuPermissionTypes: async (menuId) => {
    if (!menuId) {
      set({ menuPermissionTypes: [] });
      return;
    }

    if (fetchMenuPermissionTypesController) fetchMenuPermissionTypesController.abort();
    fetchMenuPermissionTypesController = new AbortController();
    const ctrl = fetchMenuPermissionTypesController;

    set({ loading: true, error: null });
    try {
      const response = await api.get(`/Permission/menus/${menuId}/permission-types`, { signal: ctrl.signal });
      if (ctrl !== fetchMenuPermissionTypesController) return;

      const data = response.data;
      const list = (data?.data ?? data ?? []) as PermissionType[];
      set({ menuPermissionTypes: list, loading: false });
    } catch (err: unknown) {
      const e = err as { name?: string; response?: { data?: { message?: string } } };
      if (e.name === 'CanceledError' || (err as { code?: string }).code === 'ERR_CANCELED') return;
      if (ctrl !== fetchMenuPermissionTypesController) return;

      set({ error: e.response?.data?.message ?? 'Failed to load menu permission types.', loading: false, menuPermissionTypes: [] });
    }
  },

  assignMenuPermissionTypes: async (menuId, permissionTypeIds) => {
    set({ saving: true, error: null });
    try {
      await api.post(`/Permission/menus/${menuId}/permission-types`, permissionTypeIds);
      set({ saving: false });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      set({ error: e.response?.data?.message ?? 'Failed to assign permission types to menu.', saving: false });
      throw err;
    }
  },
}));

// ============================================================
// RBAC Module — Zustand Store
// ============================================================
import { create } from 'zustand';
import type { RBACState } from '../types';
import {
    MOCK_ROLES,
    MOCK_PERMISSIONS,
    MOCK_RBAC_USERS,
    MOCK_ROLE_PERMISSION_MAP,
    MOCK_USER_PERMISSION_MAP,
    MOCK_SIMULATED_USERS,
} from '../services/mockData';
import { roleService, permissionService, userService } from '../services/rbacService';

export const useRBACStore = create<RBACState>((set, get) => ({
    // ── Initial State ──
    roles: [],
    permissions: [],
    users: [],
    rolePermissionMap: {},
    userPermissionMap: {},
    currentSimUser: null,
    simulatedUsers: [],
    loading: false,

    // ── Init (loads mock data) ──
    init: () => {
        set({
            roles: [...MOCK_ROLES],
            permissions: [...MOCK_PERMISSIONS],
            users: [...MOCK_RBAC_USERS],
            rolePermissionMap: { ...MOCK_ROLE_PERMISSION_MAP },
            userPermissionMap: { ...MOCK_USER_PERMISSION_MAP },
            simulatedUsers: [...MOCK_SIMULATED_USERS],
            currentSimUser: MOCK_SIMULATED_USERS[0], // Default: Super Admin
        });
    },

    // ── Role CRUD ─────────────────────────────────────────────
    addRole: async (data) => {
        set({ loading: true });
        const created = await roleService.create(data);
        set(s => ({ roles: [...s.roles, created], loading: false }));
        return created;
    },

    updateRole: async (id, data) => {
        set({ loading: true });
        const updated = await roleService.update(get().roles, id, data);
        set(s => ({
            roles: s.roles.map(r => (r.id === id ? updated : r)),
            loading: false,
        }));
        return updated;
    },

    deleteRole: async (id) => {
        set({ loading: true });
        await roleService.remove(id);
        set(s => ({
            roles: s.roles.filter(r => r.id !== id),
            rolePermissionMap: (() => { const m = { ...s.rolePermissionMap }; delete m[id]; return m; })(),
            loading: false,
        }));
    },

    toggleRoleStatus: (id) => {
        set(s => ({
            roles: s.roles.map(r =>
                r.id === id ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' } : r
            ),
        }));
    },

    // ── Permission CRUD ───────────────────────────────────────
    addPermission: async (data) => {
        set({ loading: true });
        const created = await permissionService.create(data);
        set(s => ({ permissions: [...s.permissions, created], loading: false }));
        return created;
    },

    updatePermission: async (id, data) => {
        set({ loading: true });
        const updated = await permissionService.update(get().permissions, id, data);
        set(s => ({
            permissions: s.permissions.map(p => (p.id === id ? updated : p)),
            loading: false,
        }));
        return updated;
    },

    deletePermission: async (id) => {
        set({ loading: true });
        await permissionService.remove(id);
        set(s => ({
            permissions: s.permissions.filter(p => p.id !== id),
            // Remove from all role maps
            rolePermissionMap: Object.fromEntries(
                Object.entries(s.rolePermissionMap).map(([k, v]) => [k, v.filter(pid => pid !== id)])
            ),
            // Remove from all user maps
            userPermissionMap: Object.fromEntries(
                Object.entries(s.userPermissionMap).map(([k, v]) => [k, v.filter(pid => pid !== id)])
            ),
            loading: false,
        }));
    },

    // ── User CRUD ─────────────────────────────────────────────
    addUser: async (data) => {
        set({ loading: true });
        const created = await userService.create(data);
        set(s => ({ users: [...s.users, created], loading: false }));
        return created;
    },

    updateUser: async (id, data) => {
        set({ loading: true });
        const updated = await userService.update(get().users, id, data);
        set(s => ({
            users: s.users.map(u => (u.id === id ? updated : u)),
            loading: false,
        }));
        return updated;
    },

    deleteUser: async (id) => {
        set({ loading: true });
        await userService.remove(id);
        set(s => ({
            users: s.users.filter(u => u.id !== id),
            userPermissionMap: (() => { const m = { ...s.userPermissionMap }; delete m[id]; return m; })(),
            loading: false,
        }));
    },

    // ── Mappings ──────────────────────────────────────────────
    setRolePermissions: (roleId, permissionIds) => {
        set(s => ({
            rolePermissionMap: { ...s.rolePermissionMap, [roleId]: permissionIds },
        }));
    },

    setUserDirectPermissions: (userId, permissionIds) => {
        set(s => ({
            userPermissionMap: { ...s.userPermissionMap, [userId]: permissionIds },
        }));
    },

    // ── Permission Engine ─────────────────────────────────────
    switchSimUser: (userId) => {
        const { simulatedUsers } = get();
        const user = simulatedUsers.find(u => u.id === userId);
        if (user) set({ currentSimUser: user });
    },

    getEffectivePermissions: (userId) => {
        const { users, rolePermissionMap, userPermissionMap } = get();
        const user = users.find(u => u.id === userId);
        if (!user) return [];
        const rolePerms = rolePermissionMap[user.roleId] || [];
        const directPerms = userPermissionMap[userId] || [];
        return [...new Set([...rolePerms, ...directPerms])];
    },

    hasPermission: (permissionName) => {
        const { currentSimUser, rolePermissionMap, userPermissionMap, permissions } = get();
        if (!currentSimUser) return false;

        const perm = permissions.find(p => p.name === permissionName);
        if (!perm) return false;

        const rolePerms = rolePermissionMap[currentSimUser.roleId] || [];
        const directPerms = userPermissionMap[currentSimUser.id] || currentSimUser.directPermissions || [];

        return rolePerms.includes(perm.id) || directPerms.includes(perm.id);
    },

    hasRole: (roleName) => {
        const { currentSimUser } = get();
        if (!currentSimUser) return false;
        return currentSimUser.roleName.toLowerCase() === roleName.toLowerCase();
    },
}));

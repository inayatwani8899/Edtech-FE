// ============================================================
// RBAC Module — Mock Service Layer (simulates API calls)
// ============================================================
import type { Role, RoleFormData, Permission, PermissionFormData, RBACUser, RBACUserFormData } from '../types';

// Utility to simulate async delay
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

// Utility to generate IDs
let counter = Date.now();
const genId = (prefix: string) => `${prefix}${++counter}`;

// ─── Role Service ───────────────────────────────────────────
export const roleService = {
    async getAll(roles: Role[]): Promise<Role[]> {
        await delay();
        return [...roles];
    },

    async create(data: RoleFormData): Promise<Role> {
        await delay(300);
        const now = new Date().toISOString().slice(0, 10);
        return { ...data, id: genId('r'), createdAt: now, updatedAt: now };
    },

    async update(roles: Role[], id: string, data: Partial<RoleFormData>): Promise<Role> {
        await delay(300);
        const existing = roles.find(r => r.id === id);
        if (!existing) throw new Error('Role not found');
        return { ...existing, ...data, updatedAt: new Date().toISOString().slice(0, 10) };
    },

    async remove(_id: string): Promise<void> {
        await delay(200);
    },
};

// ─── Permission Service ─────────────────────────────────────
export const permissionService = {
    async getAll(permissions: Permission[]): Promise<Permission[]> {
        await delay();
        return [...permissions];
    },

    async create(data: PermissionFormData): Promise<Permission> {
        await delay(300);
        const now = new Date().toISOString().slice(0, 10);
        return { ...data, id: genId('p'), createdAt: now, updatedAt: now };
    },

    async update(permissions: Permission[], id: string, data: Partial<PermissionFormData>): Promise<Permission> {
        await delay(300);
        const existing = permissions.find(p => p.id === id);
        if (!existing) throw new Error('Permission not found');
        return { ...existing, ...data, updatedAt: new Date().toISOString().slice(0, 10) };
    },

    async remove(_id: string): Promise<void> {
        await delay(200);
    },
};

// ─── User Service ───────────────────────────────────────────
export const userService = {
    async getAll(users: RBACUser[]): Promise<RBACUser[]> {
        await delay();
        return [...users];
    },

    async create(data: RBACUserFormData): Promise<RBACUser> {
        await delay(300);
        const now = new Date().toISOString().slice(0, 10);
        return { ...data, id: genId('u'), createdAt: now, updatedAt: now };
    },

    async update(users: RBACUser[], id: string, data: Partial<RBACUserFormData>): Promise<RBACUser> {
        await delay(300);
        const existing = users.find(u => u.id === id);
        if (!existing) throw new Error('User not found');
        return { ...existing, ...data, updatedAt: new Date().toISOString().slice(0, 10) };
    },

    async remove(_id: string): Promise<void> {
        await delay(200);
    },
};

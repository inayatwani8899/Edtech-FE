// ============================================================
// RBAC Module — Mock Data
// ============================================================
import type { Role, Permission, RBACUser, RolePermissionMap, UserPermissionMap, SimulatedUser } from '../types';

// ─── Permissions ────────────────────────────────────────────
export const MOCK_PERMISSIONS: Permission[] = [
    // User Management
    { id: 'p1', name: 'user.create', module: 'User Management', description: 'Create new users', createdAt: '2025-12-01', updatedAt: '2025-12-01' },
    { id: 'p2', name: 'user.read', module: 'User Management', description: 'View user details', createdAt: '2025-12-01', updatedAt: '2025-12-01' },
    { id: 'p3', name: 'user.update', module: 'User Management', description: 'Edit user information', createdAt: '2025-12-01', updatedAt: '2025-12-01' },
    { id: 'p4', name: 'user.delete', module: 'User Management', description: 'Delete users from the system', createdAt: '2025-12-01', updatedAt: '2025-12-01' },

    // Role Management
    { id: 'p5', name: 'role.create', module: 'Role Management', description: 'Create new roles', createdAt: '2025-12-01', updatedAt: '2025-12-01' },
    { id: 'p6', name: 'role.read', module: 'Role Management', description: 'View role details', createdAt: '2025-12-01', updatedAt: '2025-12-01' },
    { id: 'p7', name: 'role.update', module: 'Role Management', description: 'Edit role information', createdAt: '2025-12-01', updatedAt: '2025-12-01' },
    { id: 'p8', name: 'role.delete', module: 'Role Management', description: 'Delete roles', createdAt: '2025-12-01', updatedAt: '2025-12-01' },

    // Permission Management
    { id: 'p9', name: 'permission.create', module: 'Permission Management', description: 'Create new permissions', createdAt: '2025-12-01', updatedAt: '2025-12-01' },
    { id: 'p10', name: 'permission.read', module: 'Permission Management', description: 'View permissions', createdAt: '2025-12-01', updatedAt: '2025-12-01' },
    { id: 'p11', name: 'permission.update', module: 'Permission Management', description: 'Edit permissions', createdAt: '2025-12-01', updatedAt: '2025-12-01' },
    { id: 'p12', name: 'permission.delete', module: 'Permission Management', description: 'Delete permissions', createdAt: '2025-12-01', updatedAt: '2025-12-01' },

    // Test Management
    { id: 'p13', name: 'test.create', module: 'Test Management', description: 'Create new tests', createdAt: '2025-12-01', updatedAt: '2025-12-01' },
    { id: 'p14', name: 'test.read', module: 'Test Management', description: 'View tests', createdAt: '2025-12-01', updatedAt: '2025-12-01' },
    { id: 'p15', name: 'test.update', module: 'Test Management', description: 'Edit tests', createdAt: '2025-12-01', updatedAt: '2025-12-01' },
    { id: 'p16', name: 'test.delete', module: 'Test Management', description: 'Delete tests', createdAt: '2025-12-01', updatedAt: '2025-12-01' },

    // Dashboard
    { id: 'p17', name: 'dashboard.view', module: 'Dashboard', description: 'View dashboard analytics', createdAt: '2025-12-01', updatedAt: '2025-12-01' },
    { id: 'p18', name: 'dashboard.export', module: 'Dashboard', description: 'Export dashboard data', createdAt: '2025-12-01', updatedAt: '2025-12-01' },

    // Reports
    { id: 'p19', name: 'report.view', module: 'Reports', description: 'View reports', createdAt: '2025-12-01', updatedAt: '2025-12-01' },
    { id: 'p20', name: 'report.generate', module: 'Reports', description: 'Generate reports', createdAt: '2025-12-01', updatedAt: '2025-12-01' },

    // Settings
    { id: 'p21', name: 'settings.view', module: 'Settings', description: 'View system settings', createdAt: '2025-12-01', updatedAt: '2025-12-01' },
    { id: 'p22', name: 'settings.update', module: 'Settings', description: 'Update system settings', createdAt: '2025-12-01', updatedAt: '2025-12-01' },
];

// ─── Roles ──────────────────────────────────────────────────
export const MOCK_ROLES: Role[] = [
    { id: 'r1', name: 'Super Admin', description: 'Full system access with no restrictions', status: 'active', createdAt: '2025-11-20', updatedAt: '2025-12-01' },
    { id: 'r2', name: 'Admin', description: 'Administrative access with limited system configuration', status: 'active', createdAt: '2025-11-20', updatedAt: '2025-12-01' },
    { id: 'r3', name: 'Viewer', description: 'Read-only access to all modules', status: 'active', createdAt: '2025-11-20', updatedAt: '2025-12-01' },
    { id: 'r4', name: 'Counselor', description: 'Manages student guidance and test results', status: 'active', createdAt: '2025-11-20', updatedAt: '2025-12-01' },
    { id: 'r5', name: 'Test Manager', description: 'Full access to test creation and management', status: 'inactive', createdAt: '2025-11-20', updatedAt: '2025-12-01' },
];

// ─── Role → Permission Map ──────────────────────────────────
export const MOCK_ROLE_PERMISSION_MAP: RolePermissionMap = {
    r1: MOCK_PERMISSIONS.map(p => p.id), // Super Admin → all
    r2: ['p1', 'p2', 'p3', 'p5', 'p6', 'p7', 'p9', 'p10', 'p13', 'p14', 'p15', 'p17', 'p18', 'p19', 'p20', 'p21'],
    r3: ['p2', 'p6', 'p10', 'p14', 'p17', 'p19', 'p21'],
    r4: ['p2', 'p6', 'p10', 'p14', 'p17', 'p19'],
    r5: ['p13', 'p14', 'p15', 'p16'],
};

// ─── Users ──────────────────────────────────────────────────
export const MOCK_RBAC_USERS: RBACUser[] = [
    { id: 'u1', name: 'Marcus Chen', email: 'marcus.chen@edtech.io', roleId: 'r1', status: 'active', createdAt: '2025-11-01', updatedAt: '2025-12-01' },
    { id: 'u2', name: 'Sarah Johnson', email: 'sarah.johnson@edtech.io', roleId: 'r2', status: 'active', createdAt: '2025-11-05', updatedAt: '2025-12-01' },
    { id: 'u3', name: 'Alex Rivera', email: 'alex.rivera@edtech.io', roleId: 'r3', status: 'active', createdAt: '2025-11-10', updatedAt: '2025-12-01' },
    { id: 'u4', name: 'Priya Patel', email: 'priya.patel@edtech.io', roleId: 'r4', status: 'active', createdAt: '2025-11-12', updatedAt: '2025-12-01' },
    { id: 'u5', name: 'James Wilson', email: 'james.wilson@edtech.io', roleId: 'r2', status: 'inactive', createdAt: '2025-11-15', updatedAt: '2025-12-01' },
    { id: 'u6', name: 'Emily Zhang', email: 'emily.zhang@edtech.io', roleId: 'r5', status: 'active', createdAt: '2025-11-20', updatedAt: '2025-12-01' },
];

// ─── User → Direct Permission Map ──────────────────────────
export const MOCK_USER_PERMISSION_MAP: UserPermissionMap = {
    u2: ['p4'],      // Sarah has extra delete-user permission beyond her Admin role
    u3: ['p20'],     // Alex (Viewer) can also generate reports
};

// ─── Simulated Personas for Permission Testing ──────────────
export const MOCK_SIMULATED_USERS: SimulatedUser[] = [
    { id: 'u1', name: 'Marcus Chen', email: 'marcus.chen@edtech.io', roleId: 'r1', roleName: 'Super Admin', directPermissions: [] },
    { id: 'u2', name: 'Sarah Johnson', email: 'sarah.johnson@edtech.io', roleId: 'r2', roleName: 'Admin', directPermissions: ['p4'] },
    { id: 'u3', name: 'Alex Rivera', email: 'alex.rivera@edtech.io', roleId: 'r3', roleName: 'Viewer', directPermissions: ['p20'] },
];

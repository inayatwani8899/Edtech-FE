// ============================================================
// RBAC Module — Type Definitions
// ============================================================

// ─── Role ───────────────────────────────────────────────────
export interface Role {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}

export type RoleFormData = Omit<Role, 'id' | 'createdAt' | 'updatedAt'>;

// ─── Permission ─────────────────────────────────────────────
export interface Permission {
    id: string;
    name: string;          // e.g. "user.create"
    module: string;        // e.g. "User Management"
    description: string;
    createdAt: string;
    updatedAt: string;
}

export type PermissionFormData = Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>;

// ─── RBAC User (local mock, separate from auth User) ────────
export interface RBACUser {
    id: string;
    name: string;
    email: string;
    roleId: string;        // FK → Role.id
    status: 'active' | 'inactive';
    avatar?: string;
    createdAt: string;
    updatedAt: string;
}

export type RBACUserFormData = Omit<RBACUser, 'id' | 'createdAt' | 'updatedAt' | 'avatar'>;

// ─── Mappings ───────────────────────────────────────────────
/** roleId → permissionIds */
export type RolePermissionMap = Record<string, string[]>;

/** userId → directly-assigned permissionIds */
export type UserPermissionMap = Record<string, string[]>;

// ─── Simulated logged-in persona ────────────────────────────
export interface SimulatedUser {
    id: string;
    name: string;
    email: string;
    roleId: string;
    roleName: string;
    directPermissions: string[];
}

// ─── Store slice ────────────────────────────────────────────
export interface RBACState {
    // Data
    roles: Role[];
    permissions: Permission[];
    users: RBACUser[];
    rolePermissionMap: RolePermissionMap;
    userPermissionMap: UserPermissionMap;

    // Simulated current user for permission engine
    currentSimUser: SimulatedUser | null;
    simulatedUsers: SimulatedUser[];

    // Loading / UI
    loading: boolean;

    // ── Role CRUD ──
    addRole: (data: RoleFormData) => Promise<Role>;
    updateRole: (id: string, data: Partial<RoleFormData>) => Promise<Role>;
    deleteRole: (id: string) => Promise<void>;
    toggleRoleStatus: (id: string) => void;

    // ── Permission CRUD ──
    addPermission: (data: PermissionFormData) => Promise<Permission>;
    updatePermission: (id: string, data: Partial<PermissionFormData>) => Promise<Permission>;
    deletePermission: (id: string) => Promise<void>;

    // ── User CRUD ──
    addUser: (data: RBACUserFormData) => Promise<RBACUser>;
    updateUser: (id: string, data: Partial<RBACUserFormData>) => Promise<RBACUser>;
    deleteUser: (id: string) => Promise<void>;

    // ── Mappings ──
    setRolePermissions: (roleId: string, permissionIds: string[]) => void;
    setUserDirectPermissions: (userId: string, permissionIds: string[]) => void;

    // ── Permission Engine ──
    switchSimUser: (userId: string) => void;
    getEffectivePermissions: (userId: string) => string[];
    hasPermission: (permissionName: string) => boolean;
    hasRole: (roleName: string) => boolean;

    // ── Init ──
    init: () => void;
}

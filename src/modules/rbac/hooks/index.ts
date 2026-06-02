// ============================================================
// RBAC Module — Custom Hooks
// ============================================================
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRBACStore } from '../store/useRBACStore';

/**
 * Initialize the RBAC store on first mount.
 */
export function useRBACInit() {
    const init = useRBACStore(s => s.init);
    const roles = useRBACStore(s => s.roles);

    useEffect(() => {
        if (roles.length === 0) init();
    }, [init, roles.length]);
}

/**
 * Permission gate hook. Returns true if the currently simulated
 * user has the given permission.
 */
export function usePermission(permissionName: string): boolean {
    const hasPermission = useRBACStore(s => s.hasPermission);
    return hasPermission(permissionName);
}

/**
 * Role gate hook.
 */
export function useRole(roleName: string): boolean {
    const hasRole = useRBACStore(s => s.hasRole);
    return hasRole(roleName);
}

/**
 * Get effective permissions for a user (role + direct).
 */
export function useEffectivePermissions(userId: string) {
    const getEffectivePermissions = useRBACStore(s => s.getEffectivePermissions);
    const permissions = useRBACStore(s => s.permissions);
    const rolePermissionMap = useRBACStore(s => s.rolePermissionMap);
    const userPermissionMap = useRBACStore(s => s.userPermissionMap);

    return useMemo(() => {
        const effectiveIds = getEffectivePermissions(userId);
        return permissions.filter(p => effectiveIds.includes(p.id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, permissions, rolePermissionMap, userPermissionMap]);
}

/**
 * Grouped permissions for selector UIs.
 */
export function useGroupedPermissions() {
    const permissions = useRBACStore(s => s.permissions);

    return useMemo(() => {
        const groups: Record<string, typeof permissions> = {};
        permissions.forEach(p => {
            if (!groups[p.module]) groups[p.module] = [];
            groups[p.module].push(p);
        });
        return groups;
    }, [permissions]);
}

/**
 * Search / filter hook for any list.
 */
export function useSearch<T>(items: T[], searchFields: (keyof T)[], initialQuery = '') {
    const [query, setQuery] = useState(initialQuery);

    const filtered = useMemo(() => {
        if (!query.trim()) return items;
        const lc = query.toLowerCase();
        return items.filter(item =>
            searchFields.some(field => String(item[field]).toLowerCase().includes(lc))
        );
    }, [items, query, searchFields]);

    return { query, setQuery, filtered };
}

/**
 * Pagination hook.
 */
export function usePagination<T>(items: T[], pageSize = 10) {
    const [page, setPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

    const paginated = useMemo(() => {
        const start = (page - 1) * pageSize;
        return items.slice(start, start + pageSize);
    }, [items, page, pageSize]);

    // Reset to page 1 if items change length
    useEffect(() => {
        if (page > totalPages) setPage(1);
    }, [page, totalPages]);

    return { page, setPage, totalPages, paginated, totalItems: items.length };
}

/**
 * Toast helper (uses sonner).
 */
export function useToast() {
    const showToast = useCallback(async (type: 'success' | 'error' | 'info', message: string) => {
        const { toast } = await import('sonner');
        if (type === 'success') toast.success(message);
        else if (type === 'error') toast.error(message);
        else toast.info(message);
    }, []);

    return { showToast };
}

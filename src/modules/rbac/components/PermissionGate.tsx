// ============================================================
// PermissionGate — Conditionally renders children based on perms
// ============================================================
import React from 'react';
import { useRBACStore } from '../store/useRBACStore';

interface PermissionGateProps {
    permission?: string;
    role?: string;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
    permission,
    role,
    children,
    fallback = null,
}) => {
    const hasPermission = useRBACStore(s => s.hasPermission);
    const hasRole = useRBACStore(s => s.hasRole);

    const permOk = !permission || hasPermission(permission);
    const roleOk = !role || hasRole(role);

    if (!permOk || !roleOk) return <>{fallback}</>;
    return <>{children}</>;
};

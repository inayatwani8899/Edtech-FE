// ============================================================
// ProtectedRoute — Wraps routes requiring specific permissions
// ============================================================
import React from 'react';
import { useRBACStore } from '../store/useRBACStore';
import { ShieldOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
    requiredPermission?: string;
    requiredRole?: string;
    children: React.ReactNode;
}

export const RBACProtectedRoute: React.FC<ProtectedRouteProps> = ({
    requiredPermission,
    requiredRole,
    children,
}) => {
    const hasPermission = useRBACStore(s => s.hasPermission);
    const hasRole = useRBACStore(s => s.hasRole);
    const currentSimUser = useRBACStore(s => s.currentSimUser);
    const navigate = useNavigate();

    const permOk = !requiredPermission || hasPermission(requiredPermission);
    const roleOk = !requiredRole || hasRole(requiredRole);

    if (!permOk || !roleOk) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
                <div className="relative mb-6">
                    <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-rose-500/10 to-orange-500/10 flex items-center justify-center">
                        <ShieldOff className="h-12 w-12 text-rose-500" />
                    </div>
                    <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-rose-500 flex items-center justify-center">
                        <span className="text-white text-xs font-black">!</span>
                    </div>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Access Denied</h2>
                <p className="text-sm text-slate-500 max-w-md mb-1">
                    You don't have the required permissions to view this page.
                </p>
                <p className="text-xs text-slate-400 mb-6">
                    Current persona: <span className="font-bold text-slate-600">{currentSimUser?.name}</span>
                    {' '}({currentSimUser?.roleName})
                    {requiredPermission && (
                        <> · Required: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-rose-600">{requiredPermission}</code></>
                    )}
                </p>
                <Button
                    onClick={() => navigate('/rbac')}
                    variant="outline"
                    className="gap-2 rounded-xl border-slate-200"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to RBAC Dashboard
                </Button>
            </div>
        );
    }

    return <>{children}</>;
};

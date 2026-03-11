// ============================================================
// RBAC Dashboard — Overview landing page
// ============================================================
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRBACStore } from '../store/useRBACStore';
import { useRBACInit } from '../hooks';
import { UserSwitcher } from '../components/UserSwitcher';
import { PermissionGate } from '../components/PermissionGate';
import { Card, CardContent } from '@/components/ui/card';
import {
    Shield, Key, Users, Link2, UserCog, ArrowRight,
    Activity, TrendingUp, Layers, Lock
} from 'lucide-react';

interface QuickCard {
    title: string;
    subtitle: string;
    count: number;
    icon: React.ReactNode;
    gradient: string;
    href: string;
    permission?: string;
}

const RBACDashboard: React.FC = () => {
    useRBACInit();
    const navigate = useNavigate();
    const roles = useRBACStore(s => s.roles);
    const permissions = useRBACStore(s => s.permissions);
    const users = useRBACStore(s => s.users);
    const currentSimUser = useRBACStore(s => s.currentSimUser);

    const activeRoles = roles.filter(r => r.status === 'active').length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const modules = [...new Set(permissions.map(p => p.module))].length;

    const cards: QuickCard[] = [
        { title: 'Roles', subtitle: `${activeRoles} Active`, count: roles.length, icon: <Shield className="h-6 w-6" />, gradient: 'from-indigo-500 to-purple-600', href: '/rbac/roles', permission: 'role.read' },
        { title: 'Permissions', subtitle: `${modules} Modules`, count: permissions.length, icon: <Key className="h-6 w-6" />, gradient: 'from-emerald-500 to-teal-600', href: '/rbac/permissions', permission: 'permission.read' },
        { title: 'Users', subtitle: `${activeUsers} Active`, count: users.length, icon: <Users className="h-6 w-6" />, gradient: 'from-blue-500 to-cyan-600', href: '/rbac/users', permission: 'user.read' },
        { title: 'Role Mapping', subtitle: 'Role ↔ Permissions', count: 0, icon: <Link2 className="h-6 w-6" />, gradient: 'from-amber-500 to-orange-600', href: '/rbac/role-permissions' },
        { title: 'User Permissions', subtitle: 'Direct Assignment', count: 0, icon: <UserCog className="h-6 w-6" />, gradient: 'from-rose-500 to-pink-600', href: '/rbac/user-permissions' },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#F8FAFC]">
            {/* Backdrop Glow */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/8 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-400/8 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
                {/* Header with User Switcher */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-px w-6 bg-primary/40" />
                            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-primary">Access Control Hub</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900">
                            RBAC <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Dashboard</span>
                        </h1>
                        <p className="text-sm font-medium text-slate-500 mt-1">
                            Manage roles, permissions, and user access across the platform.
                        </p>
                    </div>
                    <UserSwitcher />
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Roles', value: roles.length, icon: <Shield className="h-4 w-4 text-indigo-500" />, change: `${activeRoles} active` },
                        { label: 'Permissions', value: permissions.length, icon: <Key className="h-4 w-4 text-emerald-500" />, change: `${modules} modules` },
                        { label: 'Users', value: users.length, icon: <Users className="h-4 w-4 text-blue-500" />, change: `${activeUsers} active` },
                        { label: 'Current Role', value: currentSimUser?.roleName || '—', icon: <Lock className="h-4 w-4 text-amber-500" />, change: currentSimUser?.name || '' },
                    ].map((stat, i) => (
                        <Card key={i} className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="h-8 w-8 rounded-xl bg-white shadow-sm flex items-center justify-center">{stat.icon}</div>
                                    <Activity className="h-3.5 w-3.5 text-slate-300 group-hover:text-primary transition-colors" />
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
                                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                                    <span className="text-[10px] font-bold text-emerald-600">{stat.change}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Access Cards */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Layers className="h-4 w-4 text-slate-400" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quick Access Modules</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cards.map((card, i) => {
                        const content = (
                            <Card
                                key={i}
                                className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                                onClick={() => navigate(card.href)}
                            >
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            {card.icon}
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-300" />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-primary transition-colors">{card.title}</h3>
                                    <p className="text-xs font-medium text-slate-500">{card.subtitle}</p>
                                    {card.count > 0 && (
                                        <div className="mt-3 flex items-center gap-1.5">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-bold text-slate-400">{card.count} records</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );

                        if (card.permission) {
                            return (
                                <PermissionGate key={i} permission={card.permission} fallback={
                                    <Card className="border-none shadow-none rounded-2xl overflow-hidden bg-slate-50/50 opacity-50 cursor-not-allowed">
                                        <CardContent className="p-5">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="h-12 w-12 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-400">{card.icon}</div>
                                                <Lock className="h-4 w-4 text-slate-300" />
                                            </div>
                                            <h3 className="text-lg font-black text-slate-400 mb-1">{card.title}</h3>
                                            <p className="text-xs font-medium text-slate-400">{card.subtitle}</p>
                                            <div className="mt-3">
                                                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">No Access</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                }>
                                    {content}
                                </PermissionGate>
                            );
                        }
                        return content;
                    })}
                </div>

                {/* Active Persona Info */}
                <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden mt-8">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-8 w-8 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                <Lock className="h-4 w-4 text-indigo-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Permission Engine Status</p>
                                <p className="text-xs font-medium text-slate-600">Currently simulating access as <span className="font-black text-primary">{currentSimUser?.name}</span> ({currentSimUser?.roleName})</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3">
                            <p className="text-[10px] font-medium text-slate-500 leading-relaxed">
                                Switch between predefined personas using the switcher above to see how different permission levels affect the UI.
                                Protected buttons, pages, and features will hide or show based on the active persona's effective permissions.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RBACDashboard;

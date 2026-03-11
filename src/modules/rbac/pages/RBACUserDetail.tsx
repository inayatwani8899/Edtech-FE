// ============================================================
// RBACUserDetail — View user details + effective permissions
// ============================================================
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRBACStore } from '../store/useRBACStore';
import { useRBACInit, useEffectivePermissions } from '../hooks';
import { PageHeader } from '../components/PageHeader';
import { PermissionGate } from '../components/PermissionGate';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Users, ArrowLeft, Edit, Key, Shield, Calendar, Activity,
    CheckCircle2, XCircle, Mail, Fingerprint, UserCog,
} from 'lucide-react';

const RBACUserDetail: React.FC = () => {
    useRBACInit();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const users = useRBACStore(s => s.users);
    const roles = useRBACStore(s => s.roles);
    const permissions = useRBACStore(s => s.permissions);
    const rolePermissionMap = useRBACStore(s => s.rolePermissionMap);
    const userPermissionMap = useRBACStore(s => s.userPermissionMap);

    const user = users.find(u => u.id === id);
    const effectivePerms = useEffectivePermissions(id || '');

    if (!user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <Users className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-lg font-black text-slate-400">User not found</p>
                    <Button variant="outline" onClick={() => navigate('/rbac/users')} className="mt-4 rounded-xl gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Users
                    </Button>
                </div>
            </div>
        );
    }

    const role = roles.find(r => r.id === user.roleId);
    const rolePerms = (rolePermissionMap[user.roleId] || []).map(pid => permissions.find(p => p.id === pid)).filter(Boolean);
    const directPerms = (userPermissionMap[user.id] || []).map(pid => permissions.find(p => p.id === pid)).filter(Boolean);

    // Group effective permissions by module
    const grouped: Record<string, typeof permissions> = {};
    effectivePerms.forEach(p => {
        if (!grouped[p.module]) grouped[p.module] = [];
        grouped[p.module].push(p);
    });

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#F8FAFC]">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/8 rounded-full blur-[120px] animate-pulse" />
            </div>

            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 max-w-4xl">
                <PageHeader
                    tag="User Details"
                    title={user.name}
                    subtitle={user.email}
                    breadcrumbs={[
                        { label: 'RBAC', href: '/rbac' },
                        { label: 'Users', href: '/rbac/users' },
                        { label: user.name },
                    ]}
                    actions={
                        <div className="flex items-center gap-3">
                            <Button variant="outline" onClick={() => navigate('/rbac/users')} className="rounded-xl border-slate-200 gap-2 font-bold text-xs uppercase tracking-wider">
                                <ArrowLeft className="h-3.5 w-3.5" /> Back
                            </Button>
                            <PermissionGate permission="user.update">
                                <Button onClick={() => navigate(`/rbac/users/edit/${user.id}`)} className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white gap-2 font-bold text-xs uppercase tracking-wider">
                                    <Edit className="h-3.5 w-3.5" /> Edit User
                                </Button>
                            </PermissionGate>
                        </div>
                    }
                />

                {/* User Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card className="glass-card border-none shadow-elegant rounded-2xl">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-sm font-black shadow-lg">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                    {user.status === 'active' ? (
                                        <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /><span className="text-xs font-bold text-emerald-600">Active</span></>
                                    ) : (
                                        <><XCircle className="h-3.5 w-3.5 text-slate-400" /><span className="text-xs font-bold text-slate-500">Inactive</span></>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-none shadow-elegant rounded-2xl">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                <Shield className="h-5 w-5 text-indigo-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</p>
                                <p className="text-xs font-bold text-slate-800">{role?.name || 'Unknown'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-none shadow-elegant rounded-2xl">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <Key className="h-5 w-5 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Effective</p>
                                <p className="text-lg font-black text-slate-900">{effectivePerms.length}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-none shadow-elegant rounded-2xl">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                <UserCog className="h-5 w-5 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Direct</p>
                                <p className="text-lg font-black text-slate-900">{directPerms.length}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Permission Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Role Permissions */}
                    <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Shield className="h-4 w-4 text-indigo-500" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role Permissions</span>
                                <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 border-none font-bold text-[9px] ml-auto">
                                    {rolePerms.length}
                                </Badge>
                            </div>
                            {rolePerms.length === 0 ? (
                                <p className="text-xs text-slate-400 text-center py-4">No role permissions</p>
                            ) : (
                                <div className="flex flex-wrap gap-1.5">
                                    {rolePerms.map(p => p && (
                                        <Badge key={p.id} variant="outline" className="bg-indigo-50/50 text-indigo-700 border-indigo-200 font-mono text-[9px] py-0.5 px-2 rounded-md">
                                            {p.name}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Direct Permissions */}
                    <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <UserCog className="h-4 w-4 text-amber-500" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Direct Permissions</span>
                                <Badge variant="secondary" className="bg-amber-50 text-amber-600 border-none font-bold text-[9px] ml-auto">
                                    {directPerms.length}
                                </Badge>
                            </div>
                            {directPerms.length === 0 ? (
                                <p className="text-xs text-slate-400 text-center py-4">No direct permissions</p>
                            ) : (
                                <div className="flex flex-wrap gap-1.5">
                                    {directPerms.map(p => p && (
                                        <Badge key={p.id} variant="outline" className="bg-amber-50/50 text-amber-700 border-amber-200 font-mono text-[9px] py-0.5 px-2 rounded-md">
                                            {p.name}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Effective Permissions (Combined) */}
                <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Key className="h-4 w-4 text-emerald-500" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Effective Permissions (Combined)</span>
                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-none font-bold text-[9px] ml-auto">
                                {effectivePerms.length} total
                            </Badge>
                        </div>
                        {Object.keys(grouped).length === 0 ? (
                            <p className="text-xs text-slate-400 text-center py-6">No effective permissions</p>
                        ) : (
                            <div className="space-y-3">
                                {Object.entries(grouped).map(([module, perms]) => (
                                    <div key={module}>
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{module}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 ml-3">
                                            {perms.map(p => {
                                                const isDirect = directPerms.some(dp => dp && dp.id === p.id);
                                                return (
                                                    <Badge
                                                        key={p.id}
                                                        variant="outline"
                                                        className={`font-mono text-[9px] py-0.5 px-2 rounded-md ${isDirect
                                                                ? 'bg-amber-50 text-amber-700 border-amber-300'
                                                                : 'bg-white text-slate-700 border-slate-200'
                                                            }`}
                                                    >
                                                        {p.name}
                                                        {isDirect && <span className="ml-1 text-[7px] text-amber-500">DIRECT</span>}
                                                    </Badge>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Meta */}
                <div className="flex items-center gap-4 mt-4 text-[10px] text-slate-400">
                    <div className="flex items-center gap-1"><Mail className="h-3 w-3" /><span>{user.email}</span></div>
                    <div className="flex items-center gap-1"><Fingerprint className="h-3 w-3" /><span>ID: {user.id}</span></div>
                    <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /><span>Created: {user.createdAt}</span></div>
                </div>
            </div>
        </div>
    );
};

export default RBACUserDetail;

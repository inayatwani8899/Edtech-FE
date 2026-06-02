// ============================================================
// RoleDetail — View role details + assigned permissions
// ============================================================
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRBACStore } from '../store/useRBACStore';
import { useRBACInit } from '../hooks';
import { PageHeader } from '../components/PageHeader';
import { PermissionGate } from '../components/PermissionGate';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Shield, ArrowLeft, Edit, Key, Calendar, Activity, CheckCircle2, XCircle, Users,
} from 'lucide-react';

const RoleDetail: React.FC = () => {
    useRBACInit();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const roles = useRBACStore(s => s.roles);
    const permissions = useRBACStore(s => s.permissions);
    const rolePermissionMap = useRBACStore(s => s.rolePermissionMap);
    const users = useRBACStore(s => s.users);

    const role = roles.find(r => r.id === id);
    if (!role) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <Shield className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-lg font-black text-slate-400">Role not found</p>
                    <Button variant="outline" onClick={() => navigate('/rbac/roles')} className="mt-4 rounded-xl gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Roles
                    </Button>
                </div>
            </div>
        );
    }

    const assignedPermIds = rolePermissionMap[role.id] || [];
    const assignedPerms = permissions.filter(p => assignedPermIds.includes(p.id));
    const assignedUsers = users.filter(u => u.roleId === role.id);

    // Group by module
    const grouped: Record<string, typeof permissions> = {};
    assignedPerms.forEach(p => {
        if (!grouped[p.module]) grouped[p.module] = [];
        grouped[p.module].push(p);
    });

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#F8FAFC]">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/8 rounded-full blur-[120px] animate-pulse" />
            </div>

            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 max-w-4xl">
                <PageHeader
                    tag="Role Details"
                    title={role.name}
                    subtitle={role.description}
                    breadcrumbs={[
                        { label: 'RBAC', href: '/rbac' },
                        { label: 'Roles', href: '/rbac/roles' },
                        { label: role.name },
                    ]}
                    actions={
                        <div className="flex items-center gap-3">
                            <Button variant="outline" onClick={() => navigate('/rbac/roles')} className="rounded-xl border-slate-200 gap-2 font-bold text-xs uppercase tracking-wider">
                                <ArrowLeft className="h-3.5 w-3.5" /> Back
                            </Button>
                            <PermissionGate permission="role.update">
                                <Button onClick={() => navigate(`/rbac/roles/edit/${role.id}`)} className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white gap-2 font-bold text-xs uppercase tracking-wider">
                                    <Edit className="h-3.5 w-3.5" /> Edit Role
                                </Button>
                            </PermissionGate>
                        </div>
                    }
                />

                {/* Role Info Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="glass-card border-none shadow-elegant rounded-2xl">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                                <Shield className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    {role.status === 'active' ? (
                                        <><CheckCircle2 className="h-4 w-4 text-emerald-500" /><span className="text-sm font-bold text-emerald-600">Active</span></>
                                    ) : (
                                        <><XCircle className="h-4 w-4 text-slate-400" /><span className="text-sm font-bold text-slate-500">Inactive</span></>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-none shadow-elegant rounded-2xl">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
                                <Key className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Permissions</p>
                                <p className="text-xl font-black text-slate-900">{assignedPerms.length}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-none shadow-elegant rounded-2xl">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-lg">
                                <Users className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Users</p>
                                <p className="text-xl font-black text-slate-900">{assignedUsers.length}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Permissions by Module */}
                <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden mb-6">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Key className="h-4 w-4 text-indigo-500" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Permissions</span>
                        </div>
                        {Object.keys(grouped).length === 0 ? (
                            <div className="text-center py-8">
                                <Key className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                                <p className="text-sm text-slate-400 font-medium">No permissions assigned to this role</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {Object.entries(grouped).map(([module, perms]) => (
                                    <div key={module}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{module}</span>
                                            <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 border-none font-bold text-[9px] ml-auto">
                                                {perms.length}
                                            </Badge>
                                        </div>
                                        <div className="flex flex-wrap gap-2 ml-3">
                                            {perms.map(p => (
                                                <Badge key={p.id} variant="outline" className="bg-white border-slate-200 text-slate-700 font-mono text-[10px] py-1 px-2.5 rounded-lg">
                                                    {p.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Assigned Users */}
                <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="h-4 w-4 text-blue-500" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Users with this Role</span>
                        </div>
                        {assignedUsers.length === 0 ? (
                            <div className="text-center py-8">
                                <Users className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                                <p className="text-sm text-slate-400 font-medium">No users assigned to this role</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {assignedUsers.map(u => (
                                    <div key={u.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-[10px] font-black">
                                            {u.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-slate-800 truncate">{u.name}</p>
                                            <p className="text-[10px] text-slate-500 truncate">{u.email}</p>
                                        </div>
                                        <Badge variant="outline" className={`text-[8px] font-bold ${u.status === 'active' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-slate-400'}`}>
                                            {u.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Meta */}
                <div className="flex items-center gap-4 mt-4 text-[10px] text-slate-400">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Created: {role.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        <span>Updated: {role.updatedAt}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleDetail;

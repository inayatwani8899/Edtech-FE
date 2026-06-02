// ============================================================
// UserPermissionMapping — Assign direct permissions to users
// ============================================================
import React, { useState, useEffect, useMemo } from 'react';
import { useRBACStore } from '../store/useRBACStore';
import { useRBACInit, useGroupedPermissions, useToast, useEffectivePermissions } from '../hooks';
import { PageHeader } from '../components/PageHeader';
import { UserSwitcher } from '../components/UserSwitcher';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
    UserCog, Save, Shield, Key, Layers, Loader2, Users, Info,
} from 'lucide-react';

const UserPermissionMapping: React.FC = () => {
    useRBACInit();
    const { showToast } = useToast();

    const users = useRBACStore(s => s.users);
    const roles = useRBACStore(s => s.roles);
    const permissions = useRBACStore(s => s.permissions);
    const rolePermissionMap = useRBACStore(s => s.rolePermissionMap);
    const userPermissionMap = useRBACStore(s => s.userPermissionMap);
    const setUserDirectPermissions = useRBACStore(s => s.setUserDirectPermissions);

    const grouped = useGroupedPermissions();

    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [directPerms, setDirectPerms] = useState<Set<string>>(new Set());
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const selectedUser = users.find(u => u.id === selectedUserId);
    const selectedRole = selectedUser ? roles.find(r => r.id === selectedUser.roleId) : null;
    const rolePerms = selectedUser ? new Set(rolePermissionMap[selectedUser.roleId] || []) : new Set<string>();

    const effectivePerms = useEffectivePermissions(selectedUserId);

    // Load current direct perms when user changes
    useEffect(() => {
        if (selectedUserId) {
            const current = userPermissionMap[selectedUserId] || [];
            setDirectPerms(new Set(current));
            setHasChanges(false);
        }
    }, [selectedUserId, userPermissionMap]);

    const toggleDirectPerm = (permId: string) => {
        const next = new Set(directPerms);
        if (next.has(permId)) next.delete(permId); else next.add(permId);
        setDirectPerms(next);
        setHasChanges(true);
    };

    const handleSave = async () => {
        if (!selectedUserId) return;
        setSaving(true);
        await new Promise(r => setTimeout(r, 500));
        setUserDirectPermissions(selectedUserId, Array.from(directPerms));
        setSaving(false);
        setHasChanges(false);
        showToast('success', 'User permissions updated successfully');
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#F8FAFC]">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-500/8 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-400/8 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
                <PageHeader
                    tag="Direct Assignment"
                    title="User"
                    highlight="Permission Override"
                    subtitle="Assign additional permissions directly to users, beyond their role"
                    breadcrumbs={[
                        { label: 'RBAC', href: '/rbac' },
                        { label: 'User Permissions' },
                    ]}
                    actions={<UserSwitcher />}
                />

                {/* User Selector */}
                <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden mb-6">
                    <CardContent className="p-5">
                        <div className="flex flex-col md:flex-row md:items-end gap-4">
                            <div className="flex-1 space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select User</label>
                                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                                        <SelectValue placeholder="Choose a user to configure..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {users.map(user => {
                                            const uRole = roles.find(r => r.id === user.roleId);
                                            return (
                                                <SelectItem key={user.id} value={user.id} className="rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-3.5 w-3.5 text-blue-500" />
                                                        <span>{user.name}</span>
                                                        <Badge variant="secondary" className="text-[8px] ml-1">{uRole?.name}</Badge>
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                            {selectedUserId && (
                                <div className="flex items-center gap-3">
                                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 border-none font-bold text-[10px] py-1 px-3 gap-1">
                                        <Shield className="h-3 w-3" /> Role: {rolePerms.size}
                                    </Badge>
                                    <Badge variant="secondary" className="bg-amber-50 text-amber-600 border-none font-bold text-[10px] py-1 px-3 gap-1">
                                        <UserCog className="h-3 w-3" /> Direct: {directPerms.size}
                                    </Badge>
                                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px] py-1 px-3 gap-1">
                                        <Key className="h-3 w-3" /> Effective: {effectivePerms.length}
                                    </Badge>
                                </div>
                            )}
                        </div>

                        {selectedUser && (
                            <div className="mt-4 p-3 bg-blue-50/50 rounded-xl flex items-start gap-2">
                                <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <p className="text-[10px] text-blue-700 leading-relaxed">
                                    <strong>{selectedUser.name}</strong> has the <strong>{selectedRole?.name}</strong> role with {rolePerms.size} permissions.
                                    Check additional permissions below to grant them directly. Direct permissions override role restrictions.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Permission Matrix */}
                {!selectedUserId ? (
                    <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
                        <CardContent className="p-16 text-center">
                            <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                                <UserCog className="h-8 w-8 text-slate-200" />
                            </div>
                            <h3 className="text-lg font-black text-slate-400 mb-1">Select a User</h3>
                            <p className="text-xs text-slate-400">Choose a user above to manage their direct permissions</p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="space-y-4 mb-6">
                            {Object.entries(grouped).map(([module, perms]) => (
                                <Card key={module} className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
                                    <CardContent className="p-0">
                                        {/* Module Header */}
                                        <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-50 bg-slate-50/30">
                                            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-sm">
                                                <Layers className="h-3.5 w-3.5" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-800">{module}</span>
                                        </div>

                                        {/* Permissions */}
                                        <div className="divide-y divide-slate-50">
                                            {perms.map(perm => {
                                                const isFromRole = rolePerms.has(perm.id);
                                                const isDirect = directPerms.has(perm.id);

                                                return (
                                                    <label
                                                        key={perm.id}
                                                        className={`flex items-center gap-3 px-5 py-3 transition-colors cursor-pointer group ${isFromRole ? 'bg-indigo-50/30' : 'hover:bg-slate-50/50'
                                                            }`}
                                                    >
                                                        <Checkbox
                                                            checked={isDirect}
                                                            onCheckedChange={() => toggleDirectPerm(perm.id)}
                                                            className="data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500"
                                                        />
                                                        <Key className={`h-3.5 w-3.5 flex-shrink-0 ${isDirect ? 'text-rose-500' : isFromRole ? 'text-indigo-400' : 'text-slate-300'} transition-colors`} />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <code className={`text-[11px] font-mono font-bold ${isDirect ? 'text-slate-800' : isFromRole ? 'text-indigo-600' : 'text-slate-500'}`}>
                                                                    {perm.name}
                                                                </code>
                                                                {isFromRole && (
                                                                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-600 border-none text-[7px] font-bold py-0 px-1.5">
                                                                        FROM ROLE
                                                                    </Badge>
                                                                )}
                                                                {isDirect && (
                                                                    <Badge variant="secondary" className="bg-rose-100 text-rose-600 border-none text-[7px] font-bold py-0 px-1.5">
                                                                        DIRECT
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-[10px] text-slate-400 mt-0.5">{perm.description}</p>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Save Bar */}
                        <div className="sticky bottom-4 z-20">
                            <Card className={`border-none shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ${hasChanges ? 'bg-white/95 backdrop-blur-2xl' : 'bg-white/60 backdrop-blur'}`}>
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-sm">
                                            {selectedUser?.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800">{selectedUser?.name}</p>
                                            <p className="text-[10px] text-slate-400">{directPerms.size} direct + {rolePerms.size} role = {effectivePerms.length} effective</p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleSave}
                                        disabled={!hasChanges || saving}
                                        className={`rounded-xl font-bold text-xs uppercase tracking-wider gap-2 shadow-lg transition-all ${hasChanges
                                                ? 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-rose-500/20'
                                                : 'bg-slate-200 text-slate-400 shadow-none'
                                            }`}
                                    >
                                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                        {saving ? 'Saving...' : hasChanges ? 'Save Changes' : 'No Changes'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserPermissionMapping;

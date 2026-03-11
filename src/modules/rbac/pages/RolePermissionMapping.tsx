// ============================================================
// RolePermissionMapping — Multi-select checkbox UI
// ============================================================
import React, { useState, useEffect } from 'react';
import { useRBACStore } from '../store/useRBACStore';
import { useRBACInit, useGroupedPermissions, useToast } from '../hooks';
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
    Link2, Save, Shield, Key, Layers, CheckSquare, Loader2,
} from 'lucide-react';

const RolePermissionMapping: React.FC = () => {
    useRBACInit();
    const { showToast } = useToast();

    const roles = useRBACStore(s => s.roles);
    const permissions = useRBACStore(s => s.permissions);
    const rolePermissionMap = useRBACStore(s => s.rolePermissionMap);
    const setRolePermissions = useRBACStore(s => s.setRolePermissions);

    const grouped = useGroupedPermissions();

    const [selectedRoleId, setSelectedRoleId] = useState<string>('');
    const [selectedPerms, setSelectedPerms] = useState<Set<string>>(new Set());
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // When role changes, load current permissions
    useEffect(() => {
        if (selectedRoleId) {
            const current = rolePermissionMap[selectedRoleId] || [];
            setSelectedPerms(new Set(current));
            setHasChanges(false);
        }
    }, [selectedRoleId, rolePermissionMap]);

    const togglePerm = (permId: string) => {
        const next = new Set(selectedPerms);
        if (next.has(permId)) next.delete(permId); else next.add(permId);
        setSelectedPerms(next);
        setHasChanges(true);
    };

    const toggleModule = (module: string) => {
        const modulePerms = grouped[module] || [];
        const allSelected = modulePerms.every(p => selectedPerms.has(p.id));
        const next = new Set(selectedPerms);
        modulePerms.forEach(p => {
            if (allSelected) next.delete(p.id); else next.add(p.id);
        });
        setSelectedPerms(next);
        setHasChanges(true);
    };

    const selectAll = () => {
        setSelectedPerms(new Set(permissions.map(p => p.id)));
        setHasChanges(true);
    };

    const deselectAll = () => {
        setSelectedPerms(new Set());
        setHasChanges(true);
    };

    const handleSave = async () => {
        if (!selectedRoleId) return;
        setSaving(true);
        await new Promise(r => setTimeout(r, 500));
        setRolePermissions(selectedRoleId, Array.from(selectedPerms));
        setSaving(false);
        setHasChanges(false);
        showToast('success', 'Role permissions updated successfully');
    };

    const selectedRole = roles.find(r => r.id === selectedRoleId);

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#F8FAFC]">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/8 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-400/8 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
                <PageHeader
                    tag="Access Mapping"
                    title="Role ↔"
                    highlight="Permission Mapping"
                    subtitle="Assign granular permissions to roles using the multi-select matrix"
                    breadcrumbs={[
                        { label: 'RBAC', href: '/rbac' },
                        { label: 'Role Permissions' },
                    ]}
                    actions={<UserSwitcher />}
                />

                {/* Role Selector */}
                <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden mb-6">
                    <CardContent className="p-5">
                        <div className="flex flex-col md:flex-row md:items-end gap-4">
                            <div className="flex-1 space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Role</label>
                                <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                                        <SelectValue placeholder="Choose a role to configure..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {roles.map(role => (
                                            <SelectItem key={role.id} value={role.id} className="rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <Shield className="h-3.5 w-3.5 text-indigo-500" />
                                                    <span>{role.name}</span>
                                                    <Badge variant={role.status === 'active' ? 'default' : 'secondary'} className="text-[8px] ml-2">
                                                        {role.status}
                                                    </Badge>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {selectedRoleId && (
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" onClick={selectAll} size="sm" className="h-9 rounded-lg text-[10px] font-bold uppercase tracking-wider gap-1.5 border-slate-200">
                                        <CheckSquare className="h-3.5 w-3.5" /> Select All
                                    </Button>
                                    <Button variant="outline" onClick={deselectAll} size="sm" className="h-9 rounded-lg text-[10px] font-bold uppercase tracking-wider gap-1.5 border-slate-200">
                                        Deselect All
                                    </Button>
                                    <Badge variant="secondary" className="bg-amber-50 text-amber-600 border-none font-bold text-[10px] py-1 px-3">
                                        {selectedPerms.size} / {permissions.length} selected
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Permission Matrix */}
                {!selectedRoleId ? (
                    <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
                        <CardContent className="p-16 text-center">
                            <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                                <Link2 className="h-8 w-8 text-slate-200" />
                            </div>
                            <h3 className="text-lg font-black text-slate-400 mb-1">Select a Role</h3>
                            <p className="text-xs text-slate-400">Choose a role above to configure its permissions</p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="space-y-4 mb-6">
                            {Object.entries(grouped).map(([module, perms]) => {
                                const allChecked = perms.every(p => selectedPerms.has(p.id));
                                const someChecked = perms.some(p => selectedPerms.has(p.id)) && !allChecked;
                                const checkedCount = perms.filter(p => selectedPerms.has(p.id)).length;

                                return (
                                    <Card key={module} className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
                                        <CardContent className="p-0">
                                            {/* Module Header */}
                                            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-50 bg-slate-50/30">
                                                <div className="flex items-center gap-3">
                                                    <Checkbox
                                                        checked={allChecked}
                                                        // @ts-ignore
                                                        indeterminate={someChecked}
                                                        onCheckedChange={() => toggleModule(module)}
                                                        className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-sm">
                                                            <Layers className="h-3.5 w-3.5" />
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-800">{module}</span>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className={`text-[9px] font-bold rounded-md ${allChecked ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                                    {checkedCount}/{perms.length}
                                                </Badge>
                                            </div>

                                            {/* Permissions */}
                                            <div className="divide-y divide-slate-50">
                                                {perms.map(perm => (
                                                    <label
                                                        key={perm.id}
                                                        className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                                                    >
                                                        <Checkbox
                                                            checked={selectedPerms.has(perm.id)}
                                                            onCheckedChange={() => togglePerm(perm.id)}
                                                            className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                                                        />
                                                        <Key className={`h-3.5 w-3.5 flex-shrink-0 ${selectedPerms.has(perm.id) ? 'text-amber-500' : 'text-slate-300'} transition-colors`} />
                                                        <div className="flex-1 min-w-0">
                                                            <code className={`text-[11px] font-mono font-bold transition-colors ${selectedPerms.has(perm.id) ? 'text-slate-800' : 'text-slate-500'}`}>
                                                                {perm.name}
                                                            </code>
                                                            <p className="text-[10px] text-slate-400 mt-0.5">{perm.description}</p>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Save Bar */}
                        <div className="sticky bottom-4 z-20">
                            <Card className={`border-none shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ${hasChanges ? 'bg-white/95 backdrop-blur-2xl' : 'bg-white/60 backdrop-blur'}`}>
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                                            <Shield className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800">{selectedRole?.name}</p>
                                            <p className="text-[10px] text-slate-400">{selectedPerms.size} permissions selected</p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleSave}
                                        disabled={!hasChanges || saving}
                                        className={`rounded-xl font-bold text-xs uppercase tracking-wider gap-2 shadow-lg transition-all ${hasChanges
                                                ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-amber-500/20'
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

export default RolePermissionMapping;

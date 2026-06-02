// ============================================================
// PermissionsList — List all permissions with module grouping
// ============================================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRBACStore } from '../store/useRBACStore';
import { useRBACInit, useSearch, useToast, useGroupedPermissions } from '../hooks';
import { PageHeader } from '../components/PageHeader';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { PermissionGate } from '../components/PermissionGate';
import { UserSwitcher } from '../components/UserSwitcher';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Plus, Search, Edit, Trash2, Key, ChevronDown, ChevronRight, Layers,
} from 'lucide-react';

const PermissionsList: React.FC = () => {
    useRBACInit();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const permissions = useRBACStore(s => s.permissions);
    const deletePermission = useRBACStore(s => s.deletePermission);

    const { query, setQuery, filtered } = useSearch(permissions, ['name', 'module', 'description'] as (keyof typeof permissions[0])[]);
    const [moduleFilter, setModuleFilter] = useState<string>('all');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

    const modules = [...new Set(permissions.map(p => p.module))];

    // Apply module filter
    const displayed = moduleFilter === 'all' ? filtered : filtered.filter(p => p.module === moduleFilter);

    // Group for display
    const grouped: Record<string, typeof permissions> = {};
    displayed.forEach(p => {
        if (!grouped[p.module]) grouped[p.module] = [];
        grouped[p.module].push(p);
    });

    const toggleModule = (m: string) => {
        const next = new Set(expandedModules);
        if (next.has(m)) next.delete(m);
        else next.add(m);
        setExpandedModules(next);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        await deletePermission(deleteId);
        showToast('success', 'Permission deleted successfully');
        setDeleteId(null);
    };

    // Expand all by default if there are results
    const isExpanded = (m: string) =>
        expandedModules.size === 0 ? true : expandedModules.has(m);

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#F8FAFC]">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/8 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-400/8 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
                <PageHeader
                    tag="Permission Management"
                    title="Permissions"
                    highlight="Registry"
                    subtitle="Define and manage granular permissions across modules"
                    breadcrumbs={[
                        { label: 'RBAC', href: '/rbac' },
                        { label: 'Permissions' },
                    ]}
                    actions={
                        <div className="flex items-center gap-3">
                            <UserSwitcher />
                            <PermissionGate permission="permission.create">
                                <Button
                                    onClick={() => navigate('/rbac/permissions/add')}
                                    className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 rounded-lg h-9 px-4 transition-all hover:scale-105 active:scale-95 group"
                                >
                                    <Plus className="h-3.5 w-3.5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                                    <span className="text-[10px] font-bold uppercase tracking-wide">Add Permission</span>
                                </Button>
                            </PermissionGate>
                        </div>
                    }
                />

                <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
                    <CardHeader className="p-3 border-b border-slate-50">
                        <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
                            <div className="relative group w-full md:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                                <Input
                                    placeholder="Search permissions..."
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    className="h-9 pl-9 bg-white border border-slate-200 rounded-lg font-medium text-xs text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition-all w-full"
                                />
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <Button
                                    variant={moduleFilter === 'all' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setModuleFilter('all')}
                                    className={`h-7 rounded-lg text-[10px] font-bold uppercase tracking-wider ${moduleFilter === 'all' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}
                                >
                                    All ({permissions.length})
                                </Button>
                                {modules.map(m => (
                                    <Button
                                        key={m}
                                        variant={moduleFilter === m ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setModuleFilter(m)}
                                        className={`h-7 rounded-lg text-[10px] font-bold tracking-wider ${moduleFilter === m ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                    >
                                        {m.split(' ')[0]}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-4">
                        {Object.keys(grouped).length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                                    <Key className="h-8 w-8 text-slate-200" />
                                </div>
                                <h3 className="text-lg font-black text-slate-400 mb-1">No Permissions Found</h3>
                                <p className="text-xs text-slate-400">Try adjusting your search or filter</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {Object.entries(grouped).map(([module, perms]) => (
                                    <div key={module} className="border border-slate-100 rounded-xl overflow-hidden bg-white">
                                        {/* Module Header */}
                                        <button
                                            onClick={() => toggleModule(module)}
                                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm">
                                                    <Layers className="h-4 w-4" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs font-bold text-slate-800">{module}</p>
                                                    <p className="text-[10px] text-slate-400">{perms.length} permission{perms.length > 1 ? 's' : ''}</p>
                                                </div>
                                            </div>
                                            {isExpanded(module) ? (
                                                <ChevronDown className="h-4 w-4 text-slate-400" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4 text-slate-400" />
                                            )}
                                        </button>

                                        {/* Permission Items */}
                                        {isExpanded(module) && (
                                            <div className="border-t border-slate-50 divide-y divide-slate-50">
                                                {perms.map(perm => (
                                                    <div key={perm.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50/50 transition-colors group">
                                                        <div className="flex items-center gap-3">
                                                            <Key className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                                                            <div>
                                                                <code className="text-[11px] font-mono font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{perm.name}</code>
                                                                <p className="text-[10px] text-slate-400 mt-0.5">{perm.description}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <PermissionGate permission="permission.update">
                                                                <Button
                                                                    variant="ghost" size="icon"
                                                                    onClick={() => navigate(`/rbac/permissions/edit/${perm.id}`)}
                                                                    className="h-6 w-6 rounded-md bg-transparent hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-all"
                                                                >
                                                                    <Edit className="h-3 w-3" />
                                                                </Button>
                                                            </PermissionGate>
                                                            <PermissionGate permission="permission.delete">
                                                                <Button
                                                                    variant="ghost" size="icon"
                                                                    onClick={() => setDeleteId(perm.id)}
                                                                    className="h-6 w-6 rounded-md bg-transparent hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all"
                                                                >
                                                                    <Trash2 className="h-3 w-3" />
                                                                </Button>
                                                            </PermissionGate>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <ConfirmDialog
                    open={!!deleteId}
                    onOpenChange={() => setDeleteId(null)}
                    onConfirm={handleDelete}
                    title="Delete Permission"
                    description="This will permanently remove the permission and unlink it from all roles and users. This action cannot be undone."
                    confirmText="Delete Permission"
                    variant="danger"
                />
            </div>
        </div>
    );
};

export default PermissionsList;

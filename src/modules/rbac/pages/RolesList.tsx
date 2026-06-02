// ============================================================
// RolesList — List all roles with search, pagination, status
// ============================================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRBACStore } from '../store/useRBACStore';
import { useRBACInit, useSearch, usePagination, useToast } from '../hooks';
import { PageHeader } from '../components/PageHeader';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { PermissionGate } from '../components/PermissionGate';
import { UserSwitcher } from '../components/UserSwitcher';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
    Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from '@/components/ui/table';
import {
    Plus, Search, Edit, Trash2, Eye, Shield, ChevronLeft, ChevronRight, Filter,
} from 'lucide-react';

const RolesList: React.FC = () => {
    useRBACInit();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const roles = useRBACStore(s => s.roles);
    const deleteRole = useRBACStore(s => s.deleteRole);
    const toggleRoleStatus = useRBACStore(s => s.toggleRoleStatus);
    const rolePermissionMap = useRBACStore(s => s.rolePermissionMap);

    const { query, setQuery, filtered } = useSearch(roles, ['name', 'description'] as (keyof typeof roles[0])[]);
    const { page, setPage, totalPages, paginated, totalItems } = usePagination(filtered, 8);

    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!deleteId) return;
        await deleteRole(deleteId);
        showToast('success', 'Role deleted successfully');
        setDeleteId(null);
    };

    const handleToggle = (id: string) => {
        toggleRoleStatus(id);
        showToast('info', 'Role status updated');
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#F8FAFC]">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/8 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-400/8 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                        <PageHeader
                            tag="Role Management"
                            title="Roles"
                            highlight="Registry"
                            subtitle="Define system roles and their access levels"
                            breadcrumbs={[
                                { label: 'RBAC', href: '/rbac' },
                                { label: 'Roles' },
                            ]}
                            actions={
                                <div className="flex items-center gap-3">
                                    <UserSwitcher />
                                    <PermissionGate permission="role.create">
                                        <Button
                                            onClick={() => navigate('/rbac/roles/add')}
                                            className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 rounded-lg h-9 px-4 transition-all hover:scale-105 active:scale-95 group"
                                        >
                                            <Plus className="h-3.5 w-3.5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                                            <span className="text-[10px] font-bold uppercase tracking-wide">Add Role</span>
                                        </Button>
                                    </PermissionGate>
                                </div>
                            }
                        />
                    </div>
                </div>

                <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
                    <CardHeader className="p-3 border-b border-slate-50">
                        <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
                            <div className="relative group w-full md:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Search roles..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="h-9 pl-9 bg-white border border-slate-200 rounded-lg font-medium text-xs text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all w-full"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-white border-slate-200 text-slate-600 font-bold text-[10px] py-1 px-3 rounded-lg">
                                    <Shield className="h-3 w-3 mr-1.5 text-indigo-500" /> {totalItems} Roles
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {paginated.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                                    <Shield className="h-8 w-8 text-slate-200" />
                                </div>
                                <h3 className="text-lg font-black text-slate-400 mb-1">No Roles Found</h3>
                                <p className="text-xs text-slate-400">
                                    {query ? 'Try adjusting your search criteria' : 'Create your first role to get started'}
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-slate-50">
                                            <TableRow className="border-slate-200 hover:bg-transparent">
                                                <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Role</TableHead>
                                                <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Description</TableHead>
                                                <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">Permissions</TableHead>
                                                <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">Status</TableHead>
                                                <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginated.map(role => (
                                                <TableRow key={role.id} className="border-slate-100 hover:bg-slate-50/50 transition-all duration-200 group">
                                                    <TableCell className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-black shadow-sm group-hover:scale-105 transition-transform">
                                                                {role.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors">{role.name}</p>
                                                                <p className="text-[10px] text-slate-400">Created {role.createdAt}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3">
                                                        <p className="text-xs text-slate-600 max-w-xs truncate">{role.description}</p>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-center">
                                                        <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 border-none font-bold text-[10px]">
                                                            {(rolePermissionMap[role.id] || []).length} assigned
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-center">
                                                        <PermissionGate
                                                            permission="role.update"
                                                            fallback={
                                                                <Badge variant="outline" className={`text-[9px] font-bold ${role.status === 'active' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-slate-400 bg-slate-50 border-slate-200'}`}>
                                                                    {role.status}
                                                                </Badge>
                                                            }
                                                        >
                                                            <div className="flex items-center justify-center gap-2">
                                                                <Switch
                                                                    checked={role.status === 'active'}
                                                                    onCheckedChange={() => handleToggle(role.id)}
                                                                    className="data-[state=checked]:bg-emerald-500"
                                                                />
                                                                <span className={`text-[9px] font-bold uppercase ${role.status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                                    {role.status}
                                                                </span>
                                                            </div>
                                                        </PermissionGate>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3">
                                                        <div className="flex justify-center gap-2">
                                                            <Button
                                                                variant="ghost" size="icon"
                                                                onClick={() => navigate(`/rbac/roles/view/${role.id}`)}
                                                                className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-primary hover:bg-primary/5 hover:border-primary/30 transition-all"
                                                                title="View"
                                                            >
                                                                <Eye className="h-3.5 w-3.5" />
                                                            </Button>
                                                            <PermissionGate permission="role.update">
                                                                <Button
                                                                    variant="ghost" size="icon"
                                                                    onClick={() => navigate(`/rbac/roles/edit/${role.id}`)}
                                                                    className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                                                                    title="Edit"
                                                                >
                                                                    <Edit className="h-3.5 w-3.5" />
                                                                </Button>
                                                            </PermissionGate>
                                                            <PermissionGate permission="role.delete">
                                                                <Button
                                                                    variant="ghost" size="icon"
                                                                    onClick={() => setDeleteId(role.id)}
                                                                    className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                </Button>
                                                            </PermissionGate>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Mobile Cards */}
                                <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
                                    {paginated.map(role => (
                                        <Card key={role.id} className="border border-slate-200 shadow-sm rounded-xl bg-white">
                                            <CardContent className="p-4 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-black">
                                                            {role.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900">{role.name}</p>
                                                            <Badge variant="outline" className={`text-[9px] font-bold mt-0.5 ${role.status === 'active' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-slate-400 bg-slate-50 border-slate-200'}`}>
                                                                {role.status}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 border-none font-bold text-[10px]">
                                                        {(rolePermissionMap[role.id] || []).length} perms
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-slate-500">{role.description}</p>
                                                <div className="flex gap-2 pt-1">
                                                    <Button variant="outline" size="sm" onClick={() => navigate(`/rbac/roles/view/${role.id}`)} className="flex-1 h-8 rounded-lg text-[10px] font-bold uppercase">
                                                        <Eye className="h-3 w-3 mr-1.5" /> View
                                                    </Button>
                                                    <PermissionGate permission="role.update">
                                                        <Button variant="outline" size="sm" onClick={() => navigate(`/rbac/roles/edit/${role.id}`)} className="flex-1 h-8 rounded-lg text-[10px] font-bold uppercase text-indigo-600">
                                                            <Edit className="h-3 w-3 mr-1.5" /> Edit
                                                        </Button>
                                                    </PermissionGate>
                                                    <PermissionGate permission="role.delete">
                                                        <Button variant="outline" size="sm" onClick={() => setDeleteId(role.id)} className="h-8 w-8 rounded-lg text-rose-600 border-rose-200">
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </PermissionGate>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                        <p className="text-[10px] font-bold text-slate-400">
                                            Page {page} of {totalPages} · {totalItems} total
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="h-7 w-7 rounded-lg">
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                                <Button
                                                    key={p} variant={p === page ? 'default' : 'ghost'} size="icon"
                                                    onClick={() => setPage(p)}
                                                    className={`h-7 w-7 rounded-lg text-xs font-bold ${p === page ? 'bg-primary text-white' : ''}`}
                                                >
                                                    {p}
                                                </Button>
                                            ))}
                                            <Button variant="ghost" size="icon" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="h-7 w-7 rounded-lg">
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

                <ConfirmDialog
                    open={!!deleteId}
                    onOpenChange={() => setDeleteId(null)}
                    onConfirm={handleDelete}
                    title="Delete Role"
                    description="This will permanently remove the role and unlink all associated permissions. This action cannot be undone."
                    confirmText="Delete Role"
                    variant="danger"
                />
            </div>
        </div>
    );
};

export default RolesList;

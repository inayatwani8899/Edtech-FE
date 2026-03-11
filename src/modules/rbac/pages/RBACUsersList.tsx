// ============================================================
// RBACUsersList — List all RBAC users
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
import {
    Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from '@/components/ui/table';
import {
    Plus, Search, Edit, Trash2, Eye, Users, ChevronLeft, ChevronRight,
    ShieldCheck, UserCog,
} from 'lucide-react';

const getRoleGradient = (roleName: string) => {
    const map: Record<string, string> = {
        'Super Admin': 'from-amber-500 to-orange-600',
        'Admin': 'from-indigo-500 to-purple-600',
        'Viewer': 'from-emerald-500 to-teal-600',
        'Counselor': 'from-blue-500 to-cyan-600',
        'Test Manager': 'from-rose-500 to-pink-600',
    };
    return map[roleName] || 'from-slate-500 to-slate-600';
};

const RBACUsersList: React.FC = () => {
    useRBACInit();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const users = useRBACStore(s => s.users);
    const roles = useRBACStore(s => s.roles);
    const deleteUser = useRBACStore(s => s.deleteUser);

    const { query, setQuery, filtered } = useSearch(users, ['name', 'email'] as (keyof typeof users[0])[]);
    const { page, setPage, totalPages, paginated, totalItems } = usePagination(filtered, 8);

    const [deleteId, setDeleteId] = useState<string | null>(null);

    const getRoleName = (roleId: string) => roles.find(r => r.id === roleId)?.name || 'Unknown';

    const handleDelete = async () => {
        if (!deleteId) return;
        await deleteUser(deleteId);
        showToast('success', 'User removed successfully');
        setDeleteId(null);
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#F8FAFC]">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/8 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-400/8 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
                <PageHeader
                    tag="User Management"
                    title="RBAC"
                    highlight="Users"
                    subtitle="Manage users, roles, and direct permission assignments"
                    breadcrumbs={[
                        { label: 'RBAC', href: '/rbac' },
                        { label: 'Users' },
                    ]}
                    actions={
                        <div className="flex items-center gap-3">
                            <UserSwitcher />
                            <PermissionGate permission="user.create">
                                <Button
                                    onClick={() => navigate('/rbac/users/add')}
                                    className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 rounded-lg h-9 px-4 transition-all hover:scale-105 active:scale-95 group"
                                >
                                    <Plus className="h-3.5 w-3.5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                                    <span className="text-[10px] font-bold uppercase tracking-wide">Add User</span>
                                </Button>
                            </PermissionGate>
                        </div>
                    }
                />

                <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
                    <CardHeader className="p-3 border-b border-slate-50">
                        <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
                            <div className="relative group w-full md:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                <Input
                                    placeholder="Search users..."
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    className="h-9 pl-9 bg-white border border-slate-200 rounded-lg font-medium text-xs"
                                />
                            </div>
                            <Badge variant="outline" className="bg-white border-slate-200 text-slate-600 font-bold text-[10px] py-1 px-3 rounded-lg">
                                <Users className="h-3 w-3 mr-1.5 text-blue-500" /> {totalItems} Users
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {paginated.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                                    <Users className="h-8 w-8 text-slate-200" />
                                </div>
                                <h3 className="text-lg font-black text-slate-400 mb-1">No Users Found</h3>
                                <p className="text-xs text-slate-400">{query ? 'Try adjusting your search' : 'Create your first user'}</p>
                            </div>
                        ) : (
                            <>
                                {/* Desktop */}
                                <div className="hidden md:block overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-slate-50">
                                            <TableRow className="border-slate-200 hover:bg-transparent">
                                                <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">User</TableHead>
                                                <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Email</TableHead>
                                                <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">Role</TableHead>
                                                <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">Status</TableHead>
                                                <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginated.map(user => {
                                                const roleName = getRoleName(user.roleId);
                                                return (
                                                    <TableRow key={user.id} className="border-slate-100 hover:bg-slate-50/50 transition-all group">
                                                        <TableCell className="px-4 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`h-8 w-8 rounded-xl bg-gradient-to-br ${getRoleGradient(roleName)} flex items-center justify-center text-white text-[10px] font-black shadow-sm group-hover:scale-105 transition-transform`}>
                                                                    {user.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors">{user.name}</p>
                                                                    <p className="text-[10px] text-slate-400">ID: {user.id}</p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="px-4 py-3">
                                                            <span className="text-xs font-semibold text-slate-600">{user.email}</span>
                                                        </TableCell>
                                                        <TableCell className="px-4 py-3 text-center">
                                                            <Badge variant="outline" className={`bg-indigo-50 text-indigo-700 border-indigo-200 font-bold text-[10px] rounded-lg`}>
                                                                {roleName}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="px-4 py-3 text-center">
                                                            <div className="flex items-center justify-center gap-1">
                                                                <ShieldCheck className={`h-3 w-3 ${user.status === 'active' ? 'text-emerald-500' : 'text-slate-300'}`} />
                                                                <span className={`text-[9px] font-bold uppercase ${user.status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                                    {user.status}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="px-4 py-3">
                                                            <div className="flex justify-center gap-2">
                                                                <Button variant="ghost" size="icon" onClick={() => navigate(`/rbac/users/view/${user.id}`)} className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-primary hover:bg-primary/5 hover:border-primary/30 transition-all" title="View">
                                                                    <Eye className="h-3.5 w-3.5" />
                                                                </Button>
                                                                <PermissionGate permission="user.update">
                                                                    <Button variant="ghost" size="icon" onClick={() => navigate(`/rbac/users/edit/${user.id}`)} className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all" title="Edit">
                                                                        <Edit className="h-3.5 w-3.5" />
                                                                    </Button>
                                                                </PermissionGate>
                                                                <PermissionGate permission="user.delete">
                                                                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(user.id)} className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all" title="Delete">
                                                                        <Trash2 className="h-3.5 w-3.5" />
                                                                    </Button>
                                                                </PermissionGate>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Mobile */}
                                <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
                                    {paginated.map(user => {
                                        const roleName = getRoleName(user.roleId);
                                        return (
                                            <Card key={user.id} className="border border-slate-200 shadow-sm rounded-xl bg-white">
                                                <CardContent className="p-4 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${getRoleGradient(roleName)} flex items-center justify-center text-white text-sm font-black`}>
                                                                {user.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                                                                <p className="text-[10px] text-slate-500">{user.email}</p>
                                                            </div>
                                                        </div>
                                                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 font-bold text-[10px]">
                                                            {roleName}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex gap-2 pt-1">
                                                        <Button variant="outline" size="sm" onClick={() => navigate(`/rbac/users/view/${user.id}`)} className="flex-1 h-8 rounded-lg text-[10px] font-bold uppercase">
                                                            <Eye className="h-3 w-3 mr-1.5" /> View
                                                        </Button>
                                                        <PermissionGate permission="user.update">
                                                            <Button variant="outline" size="sm" onClick={() => navigate(`/rbac/users/edit/${user.id}`)} className="flex-1 h-8 rounded-lg text-[10px] font-bold uppercase text-indigo-600">
                                                                <Edit className="h-3 w-3 mr-1.5" /> Edit
                                                            </Button>
                                                        </PermissionGate>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                        <p className="text-[10px] font-bold text-slate-400">Page {page} of {totalPages} · {totalItems} total</p>
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="h-7 w-7 rounded-lg">
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                                <Button key={p} variant={p === page ? 'default' : 'ghost'} size="icon" onClick={() => setPage(p)} className={`h-7 w-7 rounded-lg text-xs font-bold ${p === page ? 'bg-primary text-white' : ''}`}>
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
                    title="Delete User"
                    description="This will permanently remove the user and their direct permission assignments. This action cannot be undone."
                    confirmText="Delete User"
                    variant="danger"
                />
            </div>
        </div>
    );
};

export default RBACUsersList;

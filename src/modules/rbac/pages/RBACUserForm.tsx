// ============================================================
// RBACUserForm — Add / Edit RBAC User
// ============================================================
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRBACStore } from '../store/useRBACStore';
import { useRBACInit, useToast } from '../hooks';
import { PageHeader } from '../components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Save, ArrowLeft, Users, Loader2 } from 'lucide-react';

const RBACUserForm: React.FC = () => {
    useRBACInit();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { showToast } = useToast();
    const isEdit = !!id;

    const users = useRBACStore(s => s.users);
    const roles = useRBACStore(s => s.roles);
    const addUser = useRBACStore(s => s.addUser);
    const updateUser = useRBACStore(s => s.updateUser);
    const loading = useRBACStore(s => s.loading);

    const [form, setForm] = useState({
        name: '',
        email: '',
        roleId: '',
        status: 'active' as 'active' | 'inactive',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isEdit) {
            const user = users.find(u => u.id === id);
            if (user) {
                setForm({ name: user.name, email: user.email, roleId: user.roleId, status: user.status });
            }
        }
    }, [isEdit, id, users]);

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!form.email.trim()) e.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email format';
        if (!form.roleId) e.roleId = 'Please select a role';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (ev: React.FormEvent) => {
        ev.preventDefault();
        if (!validate()) return;
        try {
            if (isEdit) {
                await updateUser(id!, form);
                showToast('success', 'User updated successfully');
            } else {
                await addUser(form);
                showToast('success', 'User created successfully');
            }
            navigate('/rbac/users');
        } catch {
            showToast('error', 'Operation failed');
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#F8FAFC]">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/8 rounded-full blur-[120px] animate-pulse" />
            </div>

            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 max-w-3xl">
                <PageHeader
                    tag="User Management"
                    title={isEdit ? 'Edit' : 'Create'}
                    highlight="User"
                    subtitle={isEdit ? 'Update user details and role assignment' : 'Add a new user to the system'}
                    breadcrumbs={[
                        { label: 'RBAC', href: '/rbac' },
                        { label: 'Users', href: '/rbac/users' },
                        { label: isEdit ? 'Edit' : 'Add' },
                    ]}
                    actions={
                        <Button variant="outline" onClick={() => navigate('/rbac/users')} className="rounded-xl border-slate-200 gap-2 font-bold text-xs uppercase tracking-wider">
                            <ArrowLeft className="h-3.5 w-3.5" /> Back
                        </Button>
                    }
                />

                <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex justify-center">
                                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                                    <Users className="h-8 w-8 text-white" />
                                </div>
                            </div>

                            {/* Name */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Full Name <span className="text-rose-500">*</span>
                                </Label>
                                <Input
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="e.g., John Doe"
                                    className={`h-11 rounded-xl border ${errors.name ? 'border-rose-300' : 'border-slate-200'}`}
                                />
                                {errors.name && <p className="text-[10px] font-bold text-rose-500">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Email Address <span className="text-rose-500">*</span>
                                </Label>
                                <Input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                    placeholder="e.g., john@example.com"
                                    className={`h-11 rounded-xl border ${errors.email ? 'border-rose-300' : 'border-slate-200'}`}
                                />
                                {errors.email && <p className="text-[10px] font-bold text-rose-500">{errors.email}</p>}
                            </div>

                            {/* Role */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Role <span className="text-rose-500">*</span>
                                </Label>
                                <Select value={form.roleId} onValueChange={v => setForm(f => ({ ...f, roleId: v }))}>
                                    <SelectTrigger className={`h-11 rounded-xl border ${errors.roleId ? 'border-rose-300' : 'border-slate-200'}`}>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {roles.filter(r => r.status === 'active').map(role => (
                                            <SelectItem key={role.id} value={role.id} className="rounded-lg">
                                                {role.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.roleId && <p className="text-[10px] font-bold text-rose-500">{errors.roleId}</p>}
                            </div>

                            {/* Status */}
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                <div>
                                    <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Status</Label>
                                    <p className="text-[10px] text-slate-500 mt-0.5">
                                        {form.status === 'active' ? 'User account is active' : 'User account is disabled'}
                                    </p>
                                </div>
                                <Switch
                                    checked={form.status === 'active'}
                                    onCheckedChange={checked => setForm(f => ({ ...f, status: checked ? 'active' : 'inactive' }))}
                                    className="data-[state=checked]:bg-emerald-500"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => navigate('/rbac/users')} className="flex-1 h-11 rounded-xl border-slate-200 font-bold text-xs uppercase tracking-wider">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading} className="flex-1 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20">
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                    {isEdit ? 'Update User' : 'Create User'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RBACUserForm;

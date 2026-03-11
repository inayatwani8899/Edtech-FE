// ============================================================
// RoleForm — Add / Edit Role
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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Save, ArrowLeft, Shield, Loader2 } from 'lucide-react';

const RoleForm: React.FC = () => {
    useRBACInit();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { showToast } = useToast();
    const isEdit = !!id;

    const roles = useRBACStore(s => s.roles);
    const addRole = useRBACStore(s => s.addRole);
    const updateRole = useRBACStore(s => s.updateRole);
    const loading = useRBACStore(s => s.loading);

    const [form, setForm] = useState({
        name: '',
        description: '',
        status: 'active' as 'active' | 'inactive',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isEdit) {
            const role = roles.find(r => r.id === id);
            if (role) {
                setForm({ name: role.name, description: role.description, status: role.status });
            }
        }
    }, [isEdit, id, roles]);

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.name.trim()) e.name = 'Role name is required';
        else if (form.name.length < 2) e.name = 'Role name must be at least 2 characters';
        if (!form.description.trim()) e.description = 'Description is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            if (isEdit) {
                await updateRole(id!, form);
                showToast('success', 'Role updated successfully');
            } else {
                await addRole(form);
                showToast('success', 'Role created successfully');
            }
            navigate('/rbac/roles');
        } catch {
            showToast('error', 'Operation failed');
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#F8FAFC]">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/8 rounded-full blur-[120px] animate-pulse" />
            </div>

            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 max-w-3xl">
                <PageHeader
                    tag="Role Management"
                    title={isEdit ? 'Edit' : 'Create'}
                    highlight="Role"
                    subtitle={isEdit ? 'Modify role details and configuration' : 'Define a new role for the system'}
                    breadcrumbs={[
                        { label: 'RBAC', href: '/rbac' },
                        { label: 'Roles', href: '/rbac/roles' },
                        { label: isEdit ? 'Edit Role' : 'Add Role' },
                    ]}
                    actions={
                        <Button variant="outline" onClick={() => navigate('/rbac/roles')} className="rounded-xl border-slate-200 gap-2 font-bold text-xs uppercase tracking-wider">
                            <ArrowLeft className="h-3.5 w-3.5" /> Back
                        </Button>
                    }
                />

                <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Icon */}
                            <div className="flex justify-center">
                                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                                    <Shield className="h-8 w-8 text-white" />
                                </div>
                            </div>

                            {/* Name */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Role Name <span className="text-rose-500">*</span>
                                </Label>
                                <Input
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="e.g., Content Manager"
                                    className={`h-11 rounded-xl border ${errors.name ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-primary/20'}`}
                                />
                                {errors.name && <p className="text-[10px] font-bold text-rose-500">{errors.name}</p>}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Description <span className="text-rose-500">*</span>
                                </Label>
                                <Textarea
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    placeholder="Describe what this role can do..."
                                    rows={3}
                                    className={`rounded-xl border resize-none ${errors.description ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-primary/20'}`}
                                />
                                {errors.description && <p className="text-[10px] font-bold text-rose-500">{errors.description}</p>}
                            </div>

                            {/* Status */}
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                <div>
                                    <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Status</Label>
                                    <p className="text-[10px] text-slate-500 mt-0.5">
                                        {form.status === 'active' ? 'Role is currently active and assignable' : 'Role is disabled'}
                                    </p>
                                </div>
                                <Switch
                                    checked={form.status === 'active'}
                                    onCheckedChange={checked =>
                                        setForm(f => ({ ...f, status: checked ? 'active' : 'inactive' }))
                                    }
                                    className="data-[state=checked]:bg-emerald-500"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/rbac/roles')}
                                    className="flex-1 h-11 rounded-xl border-slate-200 font-bold text-xs uppercase tracking-wider"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/20 transition-all hover:shadow-xl"
                                >
                                    {loading ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <Save className="h-4 w-4 mr-2" />
                                    )}
                                    {isEdit ? 'Update Role' : 'Create Role'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RoleForm;

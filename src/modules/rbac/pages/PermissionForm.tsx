// ============================================================
// PermissionForm — Add / Edit Permission
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
import { Save, ArrowLeft, Key, Loader2 } from 'lucide-react';

const PermissionForm: React.FC = () => {
    useRBACInit();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { showToast } = useToast();
    const isEdit = !!id;

    const permissions = useRBACStore(s => s.permissions);
    const addPermission = useRBACStore(s => s.addPermission);
    const updatePermission = useRBACStore(s => s.updatePermission);
    const loading = useRBACStore(s => s.loading);

    const existingModules = [...new Set(permissions.map(p => p.module))];

    const [form, setForm] = useState({
        name: '',
        module: '',
        description: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isEdit) {
            const perm = permissions.find(p => p.id === id);
            if (perm) {
                setForm({ name: perm.name, module: perm.module, description: perm.description });
            }
        }
    }, [isEdit, id, permissions]);

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.name.trim()) e.name = 'Permission name is required';
        else if (!/^[a-z]+\.[a-z]+$/.test(form.name.trim())) e.name = 'Use format: module.action (e.g., user.create)';
        if (!form.module.trim()) e.module = 'Module name is required';
        if (!form.description.trim()) e.description = 'Description is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (ev: React.FormEvent) => {
        ev.preventDefault();
        if (!validate()) return;
        try {
            if (isEdit) {
                await updatePermission(id!, form);
                showToast('success', 'Permission updated successfully');
            } else {
                await addPermission(form);
                showToast('success', 'Permission created successfully');
            }
            navigate('/rbac/permissions');
        } catch {
            showToast('error', 'Operation failed');
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#F8FAFC]">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/8 rounded-full blur-[120px] animate-pulse" />
            </div>

            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 max-w-3xl">
                <PageHeader
                    tag="Permission Management"
                    title={isEdit ? 'Edit' : 'Create'}
                    highlight="Permission"
                    subtitle={isEdit ? 'Modify permission details' : 'Define a new granular permission'}
                    breadcrumbs={[
                        { label: 'RBAC', href: '/rbac' },
                        { label: 'Permissions', href: '/rbac/permissions' },
                        { label: isEdit ? 'Edit' : 'Add' },
                    ]}
                    actions={
                        <Button variant="outline" onClick={() => navigate('/rbac/permissions')} className="rounded-xl border-slate-200 gap-2 font-bold text-xs uppercase tracking-wider">
                            <ArrowLeft className="h-3.5 w-3.5" /> Back
                        </Button>
                    }
                />

                <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex justify-center">
                                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                                    <Key className="h-8 w-8 text-white" />
                                </div>
                            </div>

                            {/* Permission Name */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Permission Name <span className="text-rose-500">*</span>
                                </Label>
                                <Input
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="e.g., user.create"
                                    className={`h-11 rounded-xl font-mono border ${errors.name ? 'border-rose-300' : 'border-slate-200'}`}
                                />
                                {errors.name && <p className="text-[10px] font-bold text-rose-500">{errors.name}</p>}
                                <p className="text-[10px] text-slate-400">Format: module.action (lowercase, dot-separated)</p>
                            </div>

                            {/* Module */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Module <span className="text-rose-500">*</span>
                                </Label>
                                <Input
                                    value={form.module}
                                    onChange={e => setForm(f => ({ ...f, module: e.target.value }))}
                                    placeholder="e.g., User Management"
                                    list="module-list"
                                    className={`h-11 rounded-xl border ${errors.module ? 'border-rose-300' : 'border-slate-200'}`}
                                />
                                <datalist id="module-list">
                                    {existingModules.map(m => <option key={m} value={m} />)}
                                </datalist>
                                {errors.module && <p className="text-[10px] font-bold text-rose-500">{errors.module}</p>}
                                <p className="text-[10px] text-slate-400">Choose from existing modules or create a new one</p>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Description <span className="text-rose-500">*</span>
                                </Label>
                                <Textarea
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    placeholder="Describe what this permission grants..."
                                    rows={3}
                                    className={`rounded-xl border resize-none ${errors.description ? 'border-rose-300' : 'border-slate-200'}`}
                                />
                                {errors.description && <p className="text-[10px] font-bold text-rose-500">{errors.description}</p>}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/rbac/permissions')}
                                    className="flex-1 h-11 rounded-xl border-slate-200 font-bold text-xs uppercase tracking-wider"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20"
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                    {isEdit ? 'Update Permission' : 'Create Permission'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PermissionForm;

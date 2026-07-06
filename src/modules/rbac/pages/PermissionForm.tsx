import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMenuStore } from '@/store/menuStore';
import { useToast } from '../hooks';
import { PageHeader } from '../components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Save, ArrowLeft, Key, Loader2, Star } from 'lucide-react';

const STANDARD_ICONS = [
  'LayoutDashboard', 'Shield', 'Settings', 'Users', 'Layers', 
  'BookOpen', 'GraduationCap', 'Building', 'HelpCircle', 
  'Award', 'Clock', 'FolderOpen', 'Database', 'Menu'
];

export const PermissionForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const isEdit = !!id;

  const {
    menus, fetchMenus, createMenu, updateMenu, loading, saving,
    permissionTypes, menuPermissionTypes,
    fetchPermissionTypes, fetchMenuPermissionTypes, assignMenuPermissionTypes
  } = useMenuStore();

  const [form, setForm] = useState({
    title: '',
    url: '',
    icon: 'LayoutDashboard',
    sortOrder: '1',
    parentId: 'none',
  });
  const [selectedPermissionTypeIds, setSelectedPermissionTypeIds] = useState<Set<number>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchMenus();
    fetchPermissionTypes();
  }, [fetchMenus, fetchPermissionTypes]);

  useEffect(() => {
    if (isEdit) {
      fetchMenuPermissionTypes(id);
    }
  }, [isEdit, id, fetchMenuPermissionTypes]);

  useEffect(() => {
    if (isEdit && menuPermissionTypes) {
      setSelectedPermissionTypeIds(new Set(menuPermissionTypes.map(t => t.id)));
    }
  }, [isEdit, menuPermissionTypes]);

  useEffect(() => {
    if (isEdit && menus.length > 0) {
      const menu = menus.find(m => String(m.id) === id);
      if (menu) {
        setForm({
          title: menu.title,
          url: menu.url,
          icon: menu.icon || 'LayoutDashboard',
          sortOrder: String(menu.sortOrder),
          parentId: menu.parentId ? String(menu.parentId) : 'none',
        });
      }
    }
  }, [isEdit, id, menus]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Menu title is required';
    if (!form.url.trim()) e.url = 'Route endpoint URL is required';
    if (!form.sortOrder.trim() || isNaN(Number(form.sortOrder))) e.sortOrder = 'Sort order must be a valid number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        title: form.title,
        url: form.url,
        icon: form.icon,
        sortOrder: Number(form.sortOrder),
        parentId: form.parentId === 'none' ? null : form.parentId,
      };

      let menuId: string | number | undefined = id;
      if (isEdit) {
        await updateMenu(id!, payload);
        showToast('success', 'Menu option updated successfully');
      } else {
        const createdMenu = await createMenu(payload);
        menuId = createdMenu?.id;
        showToast('success', 'Menu option created successfully');
      }

      if (menuId) {
        await assignMenuPermissionTypes(menuId, Array.from(selectedPermissionTypeIds));
      }
      navigate('/rbac/permissions');
    } catch (err) {
      showToast('error', 'Operation failed');
    }
  };

  // Only permit selection of other parent menus as the parent menu
  const availableParents = menus.filter(m => m.parentId === null && String(m.id) !== id);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#F8FAFC]">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 max-w-3xl">
        <PageHeader
          tag="Application Architecture"
          title={isEdit ? 'Edit' : 'Create'}
          highlight="Menu Option"
          subtitle={isEdit ? 'Modify sidebar navigation details' : 'Define a new sidebar navigation option'}
          breadcrumbs={[
            { label: 'RBAC', href: '/rbac' },
            { label: 'Menus', href: '/rbac/permissions' },
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
                <div className="h-16 w-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center">
                  <Key className="h-8 w-8 text-emerald-600" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-xs font-bold text-slate-700 dark:text-slate-300">Menu Option Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Question Bank"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    className="h-11 rounded-xl border-slate-200 bg-white"
                  />
                  {errors.title && <p className="text-[10px] text-rose-500 font-semibold">{errors.title}</p>}
                </div>

                {/* URL */}
                <div className="space-y-2">
                  <Label htmlFor="url" className="text-xs font-bold text-slate-700 dark:text-slate-300">Route URL Endpoint</Label>
                  <Input
                    id="url"
                    placeholder="e.g. /manage/questions"
                    value={form.url}
                    onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                    className="h-11 rounded-xl border-slate-200 bg-white"
                  />
                  {errors.url && <p className="text-[10px] text-rose-500 font-semibold">{errors.url}</p>}
                </div>

                {/* Icon Selection */}
                <div className="space-y-2">
                  <Label htmlFor="icon" className="text-xs font-bold text-slate-700 dark:text-slate-300">Sidebar Icon</Label>
                  <Select
                    value={form.icon}
                    onValueChange={val => setForm(f => ({ ...f, icon: val }))}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                      <SelectValue placeholder="Choose an icon..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {STANDARD_ICONS.map(ic => (
                        <SelectItem key={ic} value={ic} className="rounded-lg">
                          <div className="flex items-center gap-2">
                            <Star className="h-3.5 w-3.5 text-slate-400" />
                            <span>{ic}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort Order */}
                <div className="space-y-2">
                  <Label htmlFor="sortOrder" className="text-xs font-bold text-slate-700 dark:text-slate-300">Sequence Sort Order</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    placeholder="1"
                    value={form.sortOrder}
                    onChange={e => setForm(f => ({ ...f, sortOrder: e.target.value }))}
                    className="h-11 rounded-xl border-slate-200 bg-white"
                  />
                  {errors.sortOrder && <p className="text-[10px] text-rose-500 font-semibold">{errors.sortOrder}</p>}
                </div>

                {/* Parent Menu Dropdown */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="parentId" className="text-xs font-bold text-slate-700 dark:text-slate-300">Parent Menu (Optional)</Label>
                  <Select
                    value={form.parentId}
                    onValueChange={val => setForm(f => ({ ...f, parentId: val }))}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                      <SelectValue placeholder="None (Make this a Root Option)" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="none" className="rounded-lg font-bold text-slate-500">None (Make this a Root Option)</SelectItem>
                      {availableParents.map(parent => (
                        <SelectItem key={parent.id} value={String(parent.id)} className="rounded-lg">
                          {parent.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Permission Types Selection */}
                <div className="space-y-3 md:col-span-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-2">
                  <div>
                    <Label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Assigned Capabilities</Label>
                    <p className="text-[10px] text-slate-500 mt-0.5">Select the CRUD permissions and actions allowed for this menu option</p>
                  </div>
                  
                  {loading && permissionTypes.length === 0 ? (
                    <div className="flex items-center gap-2 py-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
                      <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">Fetching system capabilities...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
                      {permissionTypes.map(type => {
                        const isChecked = selectedPermissionTypeIds.has(type.id);
                        return (
                          <label 
                            key={type.id} 
                            className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200/60 hover:bg-slate-50 cursor-pointer select-none transition-all"
                          >
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              onChange={e => {
                                const next = new Set(selectedPermissionTypeIds);
                                if (e.target.checked) next.add(type.id);
                                else next.delete(type.id);
                                setSelectedPermissionTypeIds(next);
                              }}
                              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20"
                            />
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-900 leading-tight">{type.name}</span>
                              <span className="text-[8.5px] font-mono text-slate-400 leading-tight uppercase mt-0.5">{type.code}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/rbac/permissions')}
                  className="rounded-xl border-slate-250 font-bold text-xs uppercase tracking-wider h-11 px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider h-11 px-6 gap-2"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {isEdit ? 'Save Changes' : 'Create Option'}
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

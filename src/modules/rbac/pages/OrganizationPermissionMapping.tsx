import React, { useState, useEffect } from 'react';
import { useRBACStore } from '../store/useRBACStore';
import { useOrganizationStore } from '@/store/organizationStore';
import { useToast } from '../hooks';
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
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from '@/components/ui/table';
import {
  Building, Save, Key, Loader2, CheckSquare, Layers, Lock, ShieldAlert
} from 'lucide-react';
import api from '@/api/axios';
import { PermissionItem } from '@/types/types';

export const OrganizationPermissionMapping: React.FC = () => {
  const { showToast } = useToast();
  
  const { menus, fetchMenus, loading: rbacLoading } = useRBACStore();
  const { organizations, fetchOrganizations, loading: orgLoading } = useOrganizationStore();

  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [mappedPermissions, setMappedPermissions] = useState<Record<number, PermissionItem>>({});
  const [originalPermissions, setOriginalPermissions] = useState<Record<number, PermissionItem>>({});
  const [loadingPerms, setLoadingPerms] = useState(false);
  const [isSavingLocal, setIsSavingLocal] = useState(false);

  useEffect(() => {
    fetchMenus();
    fetchOrganizations();
  }, [fetchMenus, fetchOrganizations]);

  const selectedOrg = organizations.find(o => String(o.id) === selectedOrgId);
  const tenantName = selectedOrg?.tenantDb || selectedOrg?.instituteName?.toLowerCase().replace(/\s+/g, '-') || '';

  // Load organization permissions when selectedOrg changes
  useEffect(() => {
    const loadOrgPermissions = async () => {
      if (!selectedOrgId || !tenantName) {
        setMappedPermissions({});
        setOriginalPermissions({});
        return;
      }
      setLoadingPerms(true);
      try {
        const response = await api.get('/permission/permissions', {
          params: { tenant: tenantName }
        });
        const list = (response.data?.data ?? response.data ?? []) as PermissionItem[];
        const map: Record<number, PermissionItem> = {};
        list.forEach(p => {
          map[p.menuId] = {
            ...p,
            canView: Boolean(p.canView),
            canCreate: Boolean(p.canCreate),
            canEdit: Boolean(p.canEdit),
            canDelete: Boolean(p.canDelete),
          };
        });
        setMappedPermissions(JSON.parse(JSON.stringify(map)));
        setOriginalPermissions(JSON.parse(JSON.stringify(map)));
      } catch (err) {
        console.error('Failed to load organization permissions', err);
        showToast('error', 'Failed to load tenant permissions');
      } finally {
        setLoadingPerms(false);
      }
    };
    loadOrgPermissions();
  }, [selectedOrgId, tenantName, showToast]);

  const handleToggle = (menuId: number, field: 'canView' | 'canCreate' | 'canEdit' | 'canDelete', checked: boolean) => {
    setMappedPermissions(prev => {
      const existing = prev[menuId] || {
        menuId,
        title: '',
        url: '',
        icon: '',
        sortOrder: 0,
        parentId: null,
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
      };
      
      const updated = {
        ...existing,
        [field]: checked,
      };

      // Auto-enable canView if create/edit/delete is enabled
      if ((field === 'canCreate' || field === 'canEdit' || field === 'canDelete') && checked) {
        updated.canView = true;
      }

      // Auto-disable create/edit/delete if canView is disabled
      if (field === 'canView' && !checked) {
        updated.canCreate = false;
        updated.canEdit = false;
        updated.canDelete = false;
      }

      return {
        ...prev,
        [menuId]: updated,
      };
    });
  };

  // Helper to determine if a specific menu row has been modified
  const isRowChanged = (menuId: number) => {
    const orig = originalPermissions[menuId] || { canView: false, canCreate: false, canEdit: false, canDelete: false };
    const curr = mappedPermissions[menuId] || { canView: false, canCreate: false, canEdit: false, canDelete: false };
    return (
      Boolean(orig.canView) !== Boolean(curr.canView) ||
      Boolean(orig.canCreate) !== Boolean(curr.canCreate) ||
      Boolean(orig.canEdit) !== Boolean(curr.canEdit) ||
      Boolean(orig.canDelete) !== Boolean(curr.canDelete)
    );
  };

  const computedHasChanges = menus.some(menu => isRowChanged(Number(menu.id)));

  const handleSave = async () => {
    if (!selectedOrgId || !tenantName || isSavingLocal) return;

    // Filter down to only changed menu items
    const changedMenus = menus.filter(menu => isRowChanged(Number(menu.id)));
    if (changedMenus.length === 0) {
      showToast('info', 'No changes to apply');
      return;
    }

    setIsSavingLocal(true);
    try {
      // Loop changed menus and save each permission override record
      const promises = changedMenus.map(async (menu) => {
        const mId = Number(menu.id);
        const current = mappedPermissions[mId] || {
          canView: false,
          canCreate: false,
          canEdit: false,
          canDelete: false,
        };

        const payload = {
          tenant: tenantName,
          menuId: mId,
          canView: Boolean(current.canView),
          canCreate: Boolean(current.canCreate),
          canEdit: Boolean(current.canEdit),
          canDelete: Boolean(current.canDelete),
        };

        await api.post('/permission/assign-organization-permission', payload);
      });

      await Promise.all(promises);
      showToast('success', 'Tenant permissions updated successfully');
      
      // Reload permissions from server to align original state
      const response = await api.get('/permission/permissions', {
        params: { tenant: tenantName }
      });
      const list = (response.data?.data ?? response.data ?? []) as PermissionItem[];
      const map: Record<number, PermissionItem> = {};
      list.forEach(p => {
        map[p.menuId] = {
          ...p,
          canView: Boolean(p.canView),
          canCreate: Boolean(p.canCreate),
          canEdit: Boolean(p.canEdit),
          canDelete: Boolean(p.canDelete),
        };
      });
      setMappedPermissions(JSON.parse(JSON.stringify(map)));
      setOriginalPermissions(JSON.parse(JSON.stringify(map)));
    } catch (err) {
      console.error('Failed to save tenant permissions', err);
      showToast('error', 'Failed to save tenant permissions');
    } finally {
      setIsSavingLocal(false);
    }
  };

  const selectAll = () => {
    const map: Record<number, PermissionItem> = {};
    menus.forEach(menu => {
      const mId = Number(menu.id);
      const existing = mappedPermissions[mId] || {};
      map[mId] = {
        ...existing,
        menuId: mId,
        canView: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
      };
    });
    setMappedPermissions(map);
  };

  const deselectAll = () => {
    const map: Record<number, PermissionItem> = {};
    menus.forEach(menu => {
      const mId = Number(menu.id);
      const existing = mappedPermissions[mId] || {};
      map[mId] = {
        ...existing,
        menuId: mId,
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
      };
    });
    setMappedPermissions(map);
  };

  // Group child menus by parent
  const parentMenus = menus.filter(m => m.parentId === null).sort((a, b) => a.sortOrder - b.sortOrder);
  const childrenByParent: Record<number, typeof menus> = {};
  menus.filter(m => m.parentId !== null).forEach(m => {
    const pid = Number(m.parentId);
    if (!childrenByParent[pid]) childrenByParent[pid] = [];
    childrenByParent[pid].push(m);
  });
  Object.keys(childrenByParent).forEach(pid => {
    childrenByParent[Number(pid)].sort((a, b) => a.sortOrder - b.sortOrder);
  });

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#F8FAFC]">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-400/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <PageHeader
          tag="Tenant Licensing"
          title="Organization"
          highlight="Permission Mapping"
          subtitle="Configure system menu visibility and feature permissions for entire tenant databases"
          breadcrumbs={[
            { label: 'RBAC', href: '/rbac' },
            { label: 'Tenant Permissions' },
          ]}
          actions={<UserSwitcher />}
        />

        {/* Organization Selector */}
        <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden mb-6">
          <CardContent className="p-5">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Organization (Tenant)</label>
                <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                    <SelectValue placeholder={orgLoading ? "Loading organizations..." : "Choose an organization to license..."} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl max-h-60">
                    {organizations.map(org => (
                      <SelectItem key={org.id} value={String(org.id)} className="rounded-lg">
                        <div className="flex items-center gap-2">
                          <Building className="h-3.5 w-3.5 text-indigo-500" />
                          <span>{org.instituteName}</span>
                          <Badge variant={org.isActive ? 'default' : 'secondary'} className="text-[8px] ml-2">
                            {org.isActive ? 'active' : 'inactive'}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedOrgId && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={selectAll} size="sm" className="h-9 rounded-lg text-[10px] font-bold uppercase tracking-wider gap-1.5 border-slate-200">
                    <CheckSquare className="h-3.5 w-3.5" /> License All
                  </Button>
                  <Button variant="outline" onClick={deselectAll} size="sm" className="h-9 rounded-lg text-[10px] font-bold uppercase tracking-wider gap-1.5 border-slate-200">
                    Revoke All
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Matrix View */}
        {!selectedOrgId ? (
          <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
            <CardContent className="p-16 text-center">
              <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                <Building className="h-8 w-8 text-slate-200" />
              </div>
              <h3 className="text-lg font-black text-slate-400 mb-1">Select an Organization</h3>
              <p className="text-xs text-slate-400">Choose a tenant above to configure their database permissions</p>
            </CardContent>
          </Card>
        ) : loadingPerms || rbacLoading ? (
          <div className="flex flex-col justify-center items-center py-20 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading tenant permissions...</span>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow className="border-slate-200 hover:bg-transparent">
                        <TableHead className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[40%]">Menu Option</TableHead>
                        <TableHead className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center w-[15%]">View</TableHead>
                        <TableHead className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center w-[15%]">Create</TableHead>
                        <TableHead className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center w-[15%]">Edit</TableHead>
                        <TableHead className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center w-[15%]">Delete</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parentMenus.map(parent => {
                        const pid = Number(parent.id);
                        const children = childrenByParent[pid] || [];
                        const parentPerm = mappedPermissions[pid] || { canView: false, canCreate: false, canEdit: false, canDelete: false };

                        return (
                          <React.Fragment key={pid}>
                            {/* Parent Menu Row */}
                            <TableRow className="bg-slate-50/30 hover:bg-slate-50/50 border-slate-100">
                              <TableCell className="px-6 py-3 font-bold text-slate-800 text-xs flex items-center gap-2">
                                <Layers className="h-4 w-4 text-indigo-500" />
                                {parent.title}
                              </TableCell>
                              <TableCell className="px-4 py-3 text-center">
                                <Checkbox
                                  checked={Boolean(parentPerm.canView)}
                                  onCheckedChange={(checked) => handleToggle(pid, 'canView', Boolean(checked))}
                                />
                              </TableCell>
                              <TableCell className="px-4 py-3 text-center">
                                <Checkbox
                                  checked={Boolean(parentPerm.canCreate)}
                                  onCheckedChange={(checked) => handleToggle(pid, 'canCreate', Boolean(checked))}
                                />
                              </TableCell>
                              <TableCell className="px-4 py-3 text-center">
                                <Checkbox
                                  checked={Boolean(parentPerm.canEdit)}
                                  onCheckedChange={(checked) => handleToggle(pid, 'canEdit', Boolean(checked))}
                                />
                              </TableCell>
                              <TableCell className="px-4 py-3 text-center">
                                <Checkbox
                                  checked={Boolean(parentPerm.canDelete)}
                                  onCheckedChange={(checked) => handleToggle(pid, 'canDelete', Boolean(checked))}
                                />
                              </TableCell>
                            </TableRow>

                            {/* Child Menus */}
                            {children.map(child => {
                              const cid = Number(child.id);
                              const childPerm = mappedPermissions[cid] || { canView: false, canCreate: false, canEdit: false, canDelete: false };

                              return (
                                <TableRow key={cid} className="hover:bg-slate-50/30 border-slate-50">
                                  <TableCell className="px-12 py-2.5 text-slate-650 text-xs">
                                    <span className="text-slate-300 mr-2">└─</span>
                                    {child.title}
                                  </TableCell>
                                  <TableCell className="px-4 py-2.5 text-center">
                                    <Checkbox
                                      checked={Boolean(childPerm.canView)}
                                      onCheckedChange={(checked) => handleToggle(cid, 'canView', Boolean(checked))}
                                    />
                                  </TableCell>
                                  <TableCell className="px-4 py-2.5 text-center">
                                    <Checkbox
                                      checked={Boolean(childPerm.canCreate)}
                                      onCheckedChange={(checked) => handleToggle(cid, 'canCreate', Boolean(checked))}
                                    />
                                  </TableCell>
                                  <TableCell className="px-4 py-2.5 text-center">
                                    <Checkbox
                                      checked={Boolean(childPerm.canEdit)}
                                      onCheckedChange={(checked) => handleToggle(cid, 'canEdit', Boolean(checked))}
                                    />
                                  </TableCell>
                                  <TableCell className="px-4 py-2.5 text-center">
                                    <Checkbox
                                      checked={Boolean(childPerm.canDelete)}
                                      onCheckedChange={(checked) => handleToggle(cid, 'canDelete', Boolean(checked))}
                                    />
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </React.Fragment>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Save Bar */}
            <div className="sticky bottom-4 z-20">
              <Card className={`border-none shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ${computedHasChanges ? 'bg-white/95 backdrop-blur-2xl' : 'bg-white/60 backdrop-blur'}`}>
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-650 flex items-center justify-center text-white shadow-sm animate-none">
                      <Building className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{selectedOrg?.instituteName}</p>
                      <p className="text-[10px] text-slate-400">Database: <code className="font-mono bg-slate-105 px-1 py-0.5 rounded">{tenantName}</code></p>
                    </div>
                  </div>
                  <Button
                    onClick={handleSave}
                    disabled={!computedHasChanges || loadingPerms || rbacLoading || isSavingLocal}
                    className="rounded-xl font-bold text-xs uppercase tracking-wider gap-2 shadow-lg transition-all bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    {(loadingPerms || rbacLoading || isSavingLocal) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {(loadingPerms || rbacLoading || isSavingLocal) ? 'Synchronizing...' : computedHasChanges ? 'Apply Matrix' : 'No Alterations'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationPermissionMapping;

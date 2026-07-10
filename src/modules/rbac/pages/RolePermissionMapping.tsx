import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useRBACStore } from '../store/useRBACStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useOrganizationPermissionStore } from '@/store/organizationPermissionStore';
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
  Link2, Save, Shield, Key, Layers, CheckSquare, Loader2
} from 'lucide-react';

export const RolePermissionMapping: React.FC = () => {
  const { showToast } = useToast();
  const { user, tenantData } = useAuthStore();
  const location = useLocation();
  const isOrgMode = location.pathname.startsWith('/school') || location.pathname.startsWith('/organization');

  const {
    roles, fetchRoles,
    rolePermissions, fetchRolePermissions,
    bulkUpdateRolePermission,
    loading: rbacLoading, saving: rbacSaving
  } = useRBACStore();

  const {
    orgPermissions,
    fetchOrgPermissions,
    bulkUpdateOrgRolePermissions,
    loading: orgLoading, saving: orgSaving
  } = useOrganizationPermissionStore();

  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [permissionMatrix, setPermissionMatrix] = useState<Record<number, {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  }>>({});
  const [originalMatrix, setOriginalMatrix] = useState<Record<number, {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  }>>({});
  const [isSavingLocal, setIsSavingLocal] = useState(false);

  const loading = isOrgMode ? orgLoading : rbacLoading;
  const saving = isOrgMode ? orgSaving : rbacSaving;
  const activePermissions = isOrgMode ? orgPermissions : rolePermissions;

  // Derive menus dynamically from activePermissions (no menus API needed!)
  const displayMenus = activePermissions ? activePermissions.map(p => ({
    id: p.menuId,
    title: p.title,
    url: p.url,
    icon: p.icon,
    color: p.color || '',
    sortOrder: p.sortOrder || 0,
    parentId: p.parentId ?? null
  })) : [];

  // Mount effect: only load roles
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Preselect logged-in user's role on mount/load
  useEffect(() => {
    if (roles.length > 0 && user && !selectedRoleId) {
      setSelectedRoleId(String(user.roleId));
    }
  }, [roles, user, selectedRoleId]);

  // Sync role's mapped permissions when roleId changes
  useEffect(() => {
    if (selectedRoleId) {
      // Clear previous matrix first to avoid showing stale values while loading
      setPermissionMatrix({});
      setOriginalMatrix({});
      if (isOrgMode) {
        fetchOrgPermissions(selectedRoleId);
      } else {
        fetchRolePermissions(selectedRoleId);
      }
    } else {
      setPermissionMatrix({});
      setOriginalMatrix({});
    }
  }, [selectedRoleId, isOrgMode, fetchRolePermissions, fetchOrgPermissions]);

  // When activePermissions loads, transform into a local mapping record
  useEffect(() => {
    if (selectedRoleId && activePermissions) {
      const matrix: Record<number, {
        canView: boolean;
        canCreate: boolean;
        canEdit: boolean;
        canDelete: boolean;
      }> = {};

      activePermissions.forEach(p => {
        matrix[Number(p.menuId)] = {
          canView: Boolean(p.canView),
          canCreate: Boolean(p.canCreate),
          canEdit: Boolean(p.canEdit),
          canDelete: Boolean(p.canDelete),
        };
      });

      setPermissionMatrix(JSON.parse(JSON.stringify(matrix)));
      setOriginalMatrix(JSON.parse(JSON.stringify(matrix)));
    }
  }, [selectedRoleId, activePermissions]);

  const handleToggle = (menuId: number, field: 'canView' | 'canCreate' | 'canEdit' | 'canDelete', checked: boolean) => {
    if (loading || saving || isSavingLocal) return;

    setPermissionMatrix(prev => {
      const existing = prev[menuId] || {
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
      };

      const updated = {
        ...existing,
        [field]: checked,
      };

      // Cascade view checking: if Create, Edit, or Delete is enabled, View must also be enabled
      if ((field === 'canCreate' || field === 'canEdit' || field === 'canDelete') && checked) {
        updated.canView = true;
      }

      // Cascade view unchecking: if View is disabled, Create, Edit, and Delete must also be disabled
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
  const isRowChanged = (menuId: number | string) => {
    const mId = Number(menuId);
    const orig = originalMatrix[mId] || { canView: false, canCreate: false, canEdit: false, canDelete: false };
    const curr = permissionMatrix[mId] || { canView: false, canCreate: false, canEdit: false, canDelete: false };
    return (
      Boolean(orig.canView) !== Boolean(curr.canView) ||
      Boolean(orig.canCreate) !== Boolean(curr.canCreate) ||
      Boolean(orig.canEdit) !== Boolean(curr.canEdit) ||
      Boolean(orig.canDelete) !== Boolean(curr.canDelete)
    );
  };

  const computedHasChanges = displayMenus.some(menu => isRowChanged(menu.id));

  const handleSave = async () => {
    if (!selectedRoleId || isSavingLocal) return;

    // Build payload for all menus representing the full matrix
    const payloadPermissions = displayMenus.map((menu) => {
      const mId = Number(menu.id);
      const current = permissionMatrix[mId] || {
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
      };
      return {
        menuId: mId,
        canView: Boolean(current.canView),
        canCreate: Boolean(current.canCreate),
        canEdit: Boolean(current.canEdit),
        canDelete: Boolean(current.canDelete),
      };
    });

    setIsSavingLocal(true);
    try {
      const tenant = selectedRole?.tenant || localStorage.getItem("tenantName") || tenantData?.tenantName || null;
      const orgIdStr = selectedRole?.organizationId || localStorage.getItem("organizationId") || tenantData?.id || null;
      const organizationId = orgIdStr ? Number(orgIdStr) : null;

      const payload = {
        roleId: Number(selectedRoleId),
        tenant,
        organizationId,
        permissions: payloadPermissions,
      };

      if (isOrgMode) {
        await bulkUpdateOrgRolePermissions(payload);
        showToast('success', 'Organization role permissions updated successfully.');
        await fetchOrgPermissions(selectedRoleId);
      } else {
        await bulkUpdateRolePermission(payload);
        showToast('success', 'Global role permissions updated successfully.');
        await fetchRolePermissions(selectedRoleId);
      }
    } catch (err) {
      showToast('error', 'Failed to update role permissions');
    } finally {
      setIsSavingLocal(false);
    }
  };

  const selectAll = () => {
    if (loading || saving || isSavingLocal) return;
    const matrix: Record<number, {
      canView: boolean;
      canCreate: boolean;
      canEdit: boolean;
      canDelete: boolean;
    }> = {};
    displayMenus.forEach(menu => {
      matrix[Number(menu.id)] = {
        canView: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
      };
    });
    setPermissionMatrix(matrix);
  };

  const deselectAll = () => {
    if (loading || saving || isSavingLocal) return;
    const matrix: Record<number, {
      canView: boolean;
      canCreate: boolean;
      canEdit: boolean;
      canDelete: boolean;
    }> = {};
    displayMenus.forEach(menu => {
      matrix[Number(menu.id)] = {
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
      };
    });
    setPermissionMatrix(matrix);
  };

  const selectedRole = roles.find(r => String(r.id) === selectedRoleId);

  // Group child menus by parent menu
  const parentMenus = displayMenus.filter(m => m.parentId === null).sort((a, b) => a.sortOrder - b.sortOrder);
  const childrenByParent: Record<number | string, typeof displayMenus> = {};
  displayMenus.filter(m => m.parentId !== null).forEach(m => {
    const pid = m.parentId!;
    if (!childrenByParent[pid]) childrenByParent[pid] = [];
    childrenByParent[pid].push(m);
  });
  Object.keys(childrenByParent).forEach(pid => {
    childrenByParent[pid].sort((a, b) => a.sortOrder - b.sortOrder);
  });

  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((_, idx) => (
      <TableRow key={idx} className="animate-pulse border-slate-100">
        <TableCell className="px-6 py-4">
          <div className="h-4 w-48 bg-slate-200 rounded" />
        </TableCell>
        <TableCell className="px-4 py-4 text-center">
          <div className="h-4 w-4 bg-slate-200 rounded mx-auto" />
        </TableCell>
        <TableCell className="px-4 py-4 text-center">
          <div className="h-4 w-4 bg-slate-200 rounded mx-auto" />
        </TableCell>
        <TableCell className="px-4 py-4 text-center">
          <div className="h-4 w-4 bg-slate-200 rounded mx-auto" />
        </TableCell>
        <TableCell className="px-4 py-4 text-center">
          <div className="h-4 w-4 bg-slate-200 rounded mx-auto" />
        </TableCell>
      </TableRow>
    ));
  };

  const isInteractionDisabled = loading || saving || isSavingLocal;

  // Single dynamic loader spinner on initial mount or when matrix loads for the first time
  const isInitialLoading = roles.length === 0 || (selectedRoleId && activePermissions.length === 0 && loading);

  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto" />
          <p className="text-sm font-bold text-slate-500 animate-pulse">Initializing permission matrix...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#F8FAFC]">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-400/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <PageHeader
          tag={isOrgMode ? 'Org Settings' : 'Access Mapping'}
          title={isOrgMode ? 'Organization' : 'Role ↔'}
          highlight="Permission Mapping"
          subtitle="Assign granular dynamic capabilities (View, Create, Edit, Delete) to system roles"
          breadcrumbs={isOrgMode ? [
            { label: 'School Admin', href: '/school/dashboard' },
            { label: 'Role Permissions' },
          ] : [
            { label: 'RBAC', href: '/rbac' },
            { label: 'Role Permissions' },
          ]}
          actions={!isOrgMode ? <UserSwitcher /> : undefined}
        />

        {/* Role Selector */}
        <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden mb-6">
          <CardContent className="p-5">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Role</label>
                <Select value={selectedRoleId} onValueChange={setSelectedRoleId} disabled={isSavingLocal || saving || loading}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                    <div className="flex items-center gap-2">
                      {loading && <Loader2 className="h-4 w-4 animate-spin text-indigo-500 shrink-0" />}
                      <SelectValue placeholder="Choose a role to configure..." />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl max-h-60">
                    {roles.map(role => (
                      <SelectItem key={role.id} value={String(role.id)} className="rounded-lg">
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
                  <Button variant="outline" onClick={selectAll} disabled={isInteractionDisabled} size="sm" className="h-9 rounded-lg text-[10px] font-bold uppercase tracking-wider gap-1.5 border-slate-200">
                    <CheckSquare className="h-3.5 w-3.5" /> Select All
                  </Button>
                  <Button variant="outline" onClick={deselectAll} disabled={isInteractionDisabled} size="sm" className="h-9 rounded-lg text-[10px] font-bold uppercase tracking-wider gap-1.5 border-slate-200">
                    Deselect All
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Permission Grid Matrix */}
        {!selectedRoleId ? (
          <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
            <CardContent className="p-16 text-center">
              <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                <Link2 className="h-8 w-8 text-slate-200" />
              </div>
              <h3 className="text-lg font-black text-slate-400 mb-1">Select a Role</h3>
              <p className="text-xs text-slate-400">Choose a role above to configure its dynamic capabilities</p>
            </CardContent>
          </Card>
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
                      {loading ? (
                        renderSkeletons()
                      ) : (
                        parentMenus.map(parent => {
                          const pid = parent.id;
                          const children = childrenByParent[pid] || [];
                          const parentPerm = permissionMatrix[Number(pid)] || { canView: false, canCreate: false, canEdit: false, canDelete: false };

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
                                    onCheckedChange={(checked) => handleToggle(Number(pid), 'canView', Boolean(checked))}
                                    disabled={isInteractionDisabled}
                                  />
                                </TableCell>
                                <TableCell className="px-4 py-3 text-center">
                                  <Checkbox
                                    checked={Boolean(parentPerm.canCreate)}
                                    onCheckedChange={(checked) => handleToggle(Number(pid), 'canCreate', Boolean(checked))}
                                    disabled={isInteractionDisabled}
                                  />
                                </TableCell>
                                <TableCell className="px-4 py-3 text-center">
                                  <Checkbox
                                    checked={Boolean(parentPerm.canEdit)}
                                    onCheckedChange={(checked) => handleToggle(Number(pid), 'canEdit', Boolean(checked))}
                                    disabled={isInteractionDisabled}
                                  />
                                </TableCell>
                                <TableCell className="px-4 py-3 text-center">
                                  <Checkbox
                                    checked={Boolean(parentPerm.canDelete)}
                                    onCheckedChange={(checked) => handleToggle(Number(pid), 'canDelete', Boolean(checked))}
                                    disabled={isInteractionDisabled}
                                  />
                                </TableCell>
                              </TableRow>

                              {/* Child Menus */}
                              {children.map(child => {
                                const cid = child.id;
                                const childPerm = permissionMatrix[Number(cid)] || { canView: false, canCreate: false, canEdit: false, canDelete: false };

                                return (
                                  <TableRow key={cid} className="hover:bg-slate-50/30 border-slate-50">
                                    <TableCell className="px-12 py-2.5 text-slate-650 text-xs">
                                      <span className="text-slate-300 mr-2">└─</span>
                                      {child.title}
                                    </TableCell>
                                    <TableCell className="px-4 py-2.5 text-center">
                                      <Checkbox
                                        checked={Boolean(childPerm.canView)}
                                        onCheckedChange={(checked) => handleToggle(Number(cid), 'canView', Boolean(checked))}
                                        disabled={isInteractionDisabled}
                                      />
                                    </TableCell>
                                    <TableCell className="px-4 py-2.5 text-center">
                                      <Checkbox
                                        checked={Boolean(childPerm.canCreate)}
                                        onCheckedChange={(checked) => handleToggle(Number(cid), 'canCreate', Boolean(checked))}
                                        disabled={isInteractionDisabled}
                                      />
                                    </TableCell>
                                    <TableCell className="px-4 py-2.5 text-center">
                                      <Checkbox
                                        checked={Boolean(childPerm.canEdit)}
                                        onCheckedChange={(checked) => handleToggle(Number(cid), 'canEdit', Boolean(checked))}
                                        disabled={isInteractionDisabled}
                                      />
                                    </TableCell>
                                    <TableCell className="px-4 py-2.5 text-center">
                                      <Checkbox
                                        checked={Boolean(childPerm.canDelete)}
                                        onCheckedChange={(checked) => handleToggle(Number(cid), 'canDelete', Boolean(checked))}
                                        disabled={isInteractionDisabled}
                                      />
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </React.Fragment>
                          );
                        })
                      )}
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
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-655 flex items-center justify-center text-white shadow-sm">
                      <Shield className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{selectedRole?.name}</p>
                      <p className="text-[10px] text-slate-400">Configure role rights mapping</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleSave}
                    disabled={!computedHasChanges || loading || saving || isSavingLocal}
                    className="rounded-xl font-bold text-xs uppercase tracking-wider gap-2 shadow-lg transition-all bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    {(saving || isSavingLocal) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {(saving || isSavingLocal) ? 'Synchronizing...' : computedHasChanges ? 'Apply Matrix' : 'No Alterations'}
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

export default RolePermissionMapping;

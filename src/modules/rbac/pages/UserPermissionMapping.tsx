import React, { useState, useEffect } from 'react';
import { useRBACStore } from '../store/useRBACStore';
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
  UserCog, Save, Shield, Key, Layers, Loader2, Users, Info, CheckSquare
} from 'lucide-react';

export const UserPermissionMapping: React.FC = () => {
  const { showToast } = useToast();

  const {
    users, fetchUsers,
    roles, fetchRoles,
    menus, fetchMenus,
    userPermissions, fetchUserPermissions,
    assignUserPermission,
    loading, saving
  } = useRBACStore();

  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [mappedPermissions, setMappedPermissions] = useState<Record<number | string, any>>({});
  const [originalPermissions, setOriginalPermissions] = useState<Record<number | string, any>>({});
  const [isSavingLocal, setIsSavingLocal] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchMenus();
  }, [fetchUsers, fetchRoles, fetchMenus]);

  // Sync user overrides when userId changes
  useEffect(() => {
    if (selectedUserId) {
      fetchUserPermissions(selectedUserId);
    } else {
      setMappedPermissions({});
      setOriginalPermissions({});
    }
  }, [selectedUserId, fetchUserPermissions]);

  // Load userPermissions into local state map
  useEffect(() => {
    if (selectedUserId && userPermissions) {
      // Ensure the userPermissions belong to the currently selected user to avoid stale mapping
      const firstPerm = userPermissions[0] as any;
      const isCorrectUser = userPermissions.length === 0 || String(firstPerm?.userId) === String(selectedUserId);
      if (!isCorrectUser) return;

      const map: Record<number | string, any> = {};
      userPermissions.forEach(p => {
        const item = p as any;
        map[p.menuId] = {
          id: item.id ?? p.menuId,
          menuId: p.menuId,
          canView: Boolean(p.canView),
          canCreate: Boolean(p.canCreate),
          canEdit: Boolean(p.canEdit),
          canDelete: Boolean(p.canDelete),
        };
      });
      setMappedPermissions(JSON.parse(JSON.stringify(map)));
      setOriginalPermissions(JSON.parse(JSON.stringify(map)));
    }
  }, [selectedUserId, userPermissions]);

  const handleToggle = (menuId: number | string, field: 'canView' | 'canCreate' | 'canEdit' | 'canDelete', checked: boolean) => {
    setMappedPermissions(prev => {
      const existing = prev[menuId] || {
        menuId,
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
      };

      const updated = {
        ...existing,
        [field]: checked,
      };

      // Auto-enable view if override create/edit/delete checked
      if ((field === 'canCreate' || field === 'canEdit' || field === 'canDelete') && checked) {
        updated.canView = true;
      }

      // Auto-disable create/edit/delete if view unchecked
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
    const orig = originalPermissions[menuId] || { canView: false, canCreate: false, canEdit: false, canDelete: false };
    const curr = mappedPermissions[menuId] || { canView: false, canCreate: false, canEdit: false, canDelete: false };
    return (
      Boolean(orig.canView) !== Boolean(curr.canView) ||
      Boolean(orig.canCreate) !== Boolean(curr.canCreate) ||
      Boolean(orig.canEdit) !== Boolean(curr.canEdit) ||
      Boolean(orig.canDelete) !== Boolean(curr.canDelete)
    );
  };

  const computedHasChanges = menus.some(menu => isRowChanged(menu.id));

  const handleSave = async () => {
    if (!selectedUserId || isSavingLocal) return;

    // Filter down to only changed menu items
    const changedMenus = menus.filter(menu => isRowChanged(menu.id));
    if (changedMenus.length === 0) {
      showToast('info', 'No changes to apply');
      return;
    }

    setIsSavingLocal(true);
    try {
      // Loop only changed menus and save each permission override record
      const promises = changedMenus.map(async (menu) => {
        const mId = menu.id;
        const current = mappedPermissions[mId] || {
          canView: false,
          canCreate: false,
          canEdit: false,
          canDelete: false,
        };

        const payload = {
          userId: selectedUserId,
          menuId: mId,
          canView: Boolean(current.canView),
          canCreate: Boolean(current.canCreate),
          canEdit: Boolean(current.canEdit),
          canDelete: Boolean(current.canDelete),
        };

        await assignUserPermission(payload);
      });

      await Promise.all(promises);
      showToast('success', 'User permission overrides saved successfully');
      
      // Reload permissions from server to align original state
      await fetchUserPermissions(selectedUserId);
    } catch (err) {
      showToast('error', 'Failed to save user permission overrides');
    } finally {
      setIsSavingLocal(false);
    }
  };

  const selectAll = () => {
    const map: Record<number | string, any> = {};
    menus.forEach(menu => {
      const existing = mappedPermissions[menu.id] || {};
      map[menu.id] = {
        ...existing,
        menuId: menu.id,
        canView: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
      };
    });
    setMappedPermissions(map);
  };

  const deselectAll = () => {
    const map: Record<number | string, any> = {};
    menus.forEach(menu => {
      const existing = mappedPermissions[menu.id] || {};
      map[menu.id] = {
        ...existing,
        menuId: menu.id,
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
      };
    });
    setMappedPermissions(map);
  };

  const selectedUser = users.find(u => String(u.id) === selectedUserId);
  const selectedRole = selectedUser ? roles.find(r => String(r.id) === selectedUser.roleId) : null;

  // Group child menus by parent menu
  const parentMenus = menus.filter(m => m.parentId === null).sort((a, b) => a.sortOrder - b.sortOrder);
  const childrenByParent: Record<number | string, typeof menus> = {};
  menus.filter(m => m.parentId !== null).forEach(m => {
    const pid = m.parentId!;
    if (!childrenByParent[pid]) childrenByParent[pid] = [];
    childrenByParent[pid].push(m);
  });
  Object.keys(childrenByParent).forEach(pid => {
    childrenByParent[pid].sort((a, b) => a.sortOrder - b.sortOrder);
  });

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#F8FAFC]">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-450/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <PageHeader
          tag="Direct Overrides"
          title="User"
          highlight="Permission Override"
          subtitle="Define unique dynamic permissions directly on accounts, overriding their roles"
          breadcrumbs={[
            { label: 'RBAC', href: '/rbac' },
            { label: 'User Overrides' },
          ]}
          actions={<UserSwitcher />}
        />

        {/* User Selector */}
        <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden mb-6">
          <CardContent className="p-5">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select User</label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                    <SelectValue placeholder="Choose a user to configure overrides..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl max-h-60">
                    {users.map(user => (
                      <SelectItem key={user.id} value={String(user.id)} className="rounded-lg">
                        <div className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 text-rose-500" />
                          <span>{user.name}</span>
                          <Badge variant="secondary" className="text-[8px] ml-1">{user.roleName || 'No Role'}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedUserId && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={selectAll} size="sm" className="h-9 rounded-lg text-[10px] font-bold uppercase tracking-wider gap-1.5 border-slate-200">
                    <CheckSquare className="h-3.5 w-3.5" /> Override All
                  </Button>
                  <Button variant="outline" onClick={deselectAll} size="sm" className="h-9 rounded-lg text-[10px] font-bold uppercase tracking-wider gap-1.5 border-slate-200">
                    Clear Overrides
                  </Button>
                </div>
              )}
            </div>

            {selectedUser && (
              <div className="mt-4 p-3 bg-blue-50/50 rounded-xl flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-blue-700 leading-relaxed">
                  <strong>{selectedUser.name}</strong> currently has the <strong>{selectedRole?.name || selectedUser.roleName || 'No Role'}</strong> role.
                  Toggle specific checkboxes below to define explicit overrides. Checking overrides directly modifies the user's dynamic access.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Matrix View */}
        {!selectedUserId ? (
          <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
            <CardContent className="p-16 text-center">
              <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                <UserCog className="h-8 w-8 text-slate-200" />
              </div>
              <h3 className="text-lg font-black text-slate-400 mb-1">Select a User</h3>
              <p className="text-xs text-slate-400">Choose a user account above to configure direct overrides</p>
            </CardContent>
          </Card>
        ) : loading ? (
          <div className="flex flex-col justify-center items-center py-20 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading overrides...</span>
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
                        const pid = parent.id;
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
                              const cid = child.id;
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
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-rose-500 to-pink-650 flex items-center justify-center text-white shadow-sm">
                      <UserCog className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{selectedUser?.name}</p>
                      <p className="text-[10px] text-slate-400">Configure direct user overrides</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleSave}
                    disabled={!computedHasChanges || saving || isSavingLocal}
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

export default UserPermissionMapping;

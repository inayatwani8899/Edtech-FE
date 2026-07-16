import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenuStore } from '@/store/menuStore';
import { useToast } from '../hooks';
import { PageHeader } from '../components/PageHeader';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { UserSwitcher } from '../components/UserSwitcher';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { usePagePermissions } from '@/store/permissionStore';
import {
  Plus, Search, Edit, Trash2, Key, ChevronDown, ChevronRight, Layers, ArrowRight, Star, Loader2
} from 'lucide-react';

const PermissionsList: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const { menus, fetchMenus, deleteMenu, loading } = useMenuStore();
  const { canCreate, canEdit, canDelete } = usePagePermissions();

  const [query, setQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [expandedParents, setExpandedParents] = useState<Set<string | number>>(new Set());

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  // Filter based on search query
  const filtered = menus.filter(menu => 
    menu.title.toLowerCase().includes(query.toLowerCase()) ||
    menu.url.toLowerCase().includes(query.toLowerCase())
  );

  // Group menus by parent
  const parentMenus = filtered.filter(m => m.parentId === null).sort((a, b) => a.sortOrder - b.sortOrder);
  const childrenByParent: Record<number | string, typeof menus> = {};
  
  filtered.filter(m => m.parentId !== null).forEach(m => {
    const pid = m.parentId!;
    if (!childrenByParent[pid]) childrenByParent[pid] = [];
    childrenByParent[pid].push(m);
  });

  // Orphans whose parents might have been filtered out
  const orphanMenus = filtered.filter(m => 
    m.parentId !== null && 
    !parentMenus.some(p => p.id === m.parentId)
  );

  const toggleParent = (id: string | number) => {
    const next = new Set(expandedParents);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedParents(next);
  };

  const isExpanded = (id: string | number) =>
    expandedParents.size === 0 ? true : expandedParents.has(id);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMenu(deleteId);
      showToast('success', 'Menu option deleted successfully');
      setDeleteId(null);
    } catch (err) {
      showToast('error', 'Failed to delete menu option');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#F8FAFC]">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-400/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <PageHeader
          tag="Application Architecture"
          title="Menu"
          highlight="Registry"
          subtitle="Manage the system sidebar options, route endpoints, and dynamic icons"
          breadcrumbs={[
            { label: 'RBAC', href: '/rbac' },
            { label: 'Menu Registry' },
          ]}
          actions={
            <div className="flex items-center gap-3">
              <UserSwitcher />
              {canCreate && (
                <Button
                  onClick={() => navigate('/rbac/permissions/add')}
                  className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 rounded-lg h-9 px-4 transition-all hover:scale-105 active:scale-95 group"
                >
                  <Plus className="h-3.5 w-3.5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="text-[10px] font-bold uppercase tracking-wide">Add Menu Option</span>
                </Button>
              )}
            </div>
          }
        />

        <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
          <CardHeader className="p-3 border-b border-slate-50">
            <div className="relative group w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
              <Input
                placeholder="Search menus or routes..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="h-9 pl-9 bg-white border border-slate-200 rounded-lg font-medium text-xs text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition-all w-full"
              />
            </div>
          </CardHeader>

          <CardContent className="p-4">
            {loading && menus.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-20 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading dynamic menus...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                  <Key className="h-8 w-8 text-slate-200" />
                </div>
                <h3 className="text-lg font-black text-slate-400 mb-1">No Menu Registry Matches</h3>
                <p className="text-xs text-slate-400">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Render Parent Menus */}
                {parentMenus.map(parent => {
                  const pid = parent.id;
                  const children = childrenByParent[pid] || [];
                  const isExp = isExpanded(pid);

                  return (
                    <div key={pid} className="border border-slate-100/80 rounded-2xl overflow-hidden bg-white shadow-sm">
                      {/* Parent Header */}
                      <div className="flex items-center justify-between px-4 py-3 hover:bg-slate-50/50 transition-colors">
                        <button
                          onClick={() => toggleParent(pid)}
                          className="flex items-center gap-3 flex-1 text-left"
                        >
                          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
                            <Layers className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                              {parent.title}
                              <Badge variant="outline" className="text-[8px] font-bold py-0 border-slate-200 text-slate-400">
                                Order {parent.sortOrder}
                              </Badge>
                            </p>
                            <p className="text-[10px] text-slate-400 truncate max-w-xs">{parent.url || 'No redirect URL'}</p>
                          </div>
                        </button>

                        <div className="flex items-center gap-2 ml-4">
                          {canEdit && (
                            <Button
                              variant="ghost" size="icon"
                              onClick={() => navigate(`/rbac/permissions/edit/${pid}`)}
                              className="h-7 w-7 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:text-indigo-650 hover:bg-indigo-50/50"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              variant="ghost" size="icon"
                              onClick={() => setDeleteId(pid)}
                              className="h-7 w-7 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:text-rose-650 hover:bg-rose-50/50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <button
                            onClick={() => toggleParent(pid)}
                            className="h-7 w-7 flex items-center justify-center text-slate-450 hover:text-slate-700"
                          >
                            {isExp ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Children Options */}
                      {isExp && children.length > 0 && (
                        <div className="border-t border-slate-50 divide-y divide-slate-50 bg-slate-50/10">
                          {children.map(child => (
                            <div key={child.id} className="flex items-center justify-between px-6 py-2.5 hover:bg-slate-50/30 transition-colors group">
                              <div className="flex items-center gap-2">
                                <span className="text-slate-300 font-bold text-xs">└─</span>
                                <div>
                                  <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    {child.title}
                                    <Badge variant="outline" className="text-[8px] font-bold py-0 border-slate-200 text-slate-400">
                                      Order {child.sortOrder}
                                    </Badge>
                                  </p>
                                  <p className="text-[10px] text-slate-450 font-mono">{child.url}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 opacity-100 group-hover:opacity-100 transition-opacity">
                                {canEdit && (
                                  <Button
                                    variant="ghost" size="icon"
                                    onClick={() => navigate(`/rbac/permissions/edit/${child.id}`)}
                                    className="h-6 w-6 rounded-md bg-transparent hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-all"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                )}
                                {canDelete && (
                                  <Button
                                    variant="ghost" size="icon"
                                    onClick={() => setDeleteId(child.id)}
                                    className="h-6 w-6 rounded-md bg-transparent hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Render Orphans */}
                {orphanMenus.length > 0 && (
                  <div className="border border-amber-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                    <div className="flex items-center justify-between px-4 py-3 bg-amber-50/20">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-sm">
                          <Star className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-amber-800">Unlinked Submenus</p>
                          <p className="text-[10px] text-amber-500">Child options whose parent menu has been filtered or deleted</p>
                        </div>
                      </div>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {orphanMenus.map(child => (
                        <div key={child.id} className="flex items-center justify-between px-6 py-2.5 hover:bg-slate-50/30 transition-colors group">
                          <div>
                            <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              {child.title}
                              <Badge variant="outline" className="text-[8px] font-bold py-0 border-slate-200 text-slate-400">
                                Order {child.sortOrder}
                              </Badge>
                            </p>
                            <p className="text-[10px] text-slate-450 font-mono">{child.url}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {canEdit && (
                              <Button
                                variant="ghost" size="icon"
                                onClick={() => navigate(`/rbac/permissions/edit/${child.id}`)}
                                className="h-6 w-6 rounded-md bg-transparent hover:bg-indigo-50 text-slate-400 hover:text-indigo-600"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            )}
                            {canDelete && (
                              <Button
                                variant="ghost" size="icon"
                                onClick={() => setDeleteId(child.id)}
                                className="h-6 w-6 rounded-md bg-transparent hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <ConfirmDialog
          open={!!deleteId}
          onOpenChange={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Delete Menu Option"
          description="This will permanently delete this menu option and remove it from all role/user licenses. This action cannot be undone."
          confirmText="Delete Option"
          variant="danger"
        />
      </div>
    </div>
  );
};

export default PermissionsList;

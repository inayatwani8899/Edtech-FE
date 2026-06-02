// ============================================================
// UserSwitcher — Floating pill to switch simulated persona
// ============================================================
import React, { useState } from 'react';
import { useRBACStore } from '../store/useRBACStore';
import { Users, ChevronDown, Check, Shield, Eye, Crown } from 'lucide-react';

const roleIcon: Record<string, React.ReactNode> = {
    'Super Admin': <Crown className="h-3.5 w-3.5 text-amber-500" />,
    'Admin': <Shield className="h-3.5 w-3.5 text-indigo-500" />,
    'Viewer': <Eye className="h-3.5 w-3.5 text-emerald-500" />,
};

const roleColor: Record<string, string> = {
    'Super Admin': 'from-amber-500 to-orange-600',
    'Admin': 'from-indigo-500 to-purple-600',
    'Viewer': 'from-emerald-500 to-teal-600',
};

export const UserSwitcher: React.FC = () => {
    const [open, setOpen] = useState(false);
    const simulatedUsers = useRBACStore(s => s.simulatedUsers);
    const currentSimUser = useRBACStore(s => s.currentSimUser);
    const switchSimUser = useRBACStore(s => s.switchSimUser);

    if (!currentSimUser) return null;

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2.5 bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-xl px-3.5 py-2 shadow-lg shadow-slate-900/5 hover:shadow-xl hover:border-slate-300 transition-all duration-300 group"
            >
                <div className={`h-7 w-7 rounded-lg bg-gradient-to-br ${roleColor[currentSimUser.roleName] || 'from-slate-500 to-slate-600'} flex items-center justify-center text-white text-[10px] font-black shadow-sm`}>
                    {currentSimUser.name.charAt(0)}
                </div>
                <div className="text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none mb-0.5">Active Persona</p>
                    <p className="text-xs font-bold text-slate-800 leading-none">{currentSimUser.name}</p>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-2xl shadow-2xl shadow-slate-900/10 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <Users className="h-3.5 w-3.5 text-slate-400" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Switch Persona</span>
                            </div>
                        </div>
                        <div className="p-2">
                            {simulatedUsers.map(user => {
                                const isActive = user.id === currentSimUser.id;
                                return (
                                    <button
                                        key={user.id}
                                        onClick={() => { switchSimUser(user.id); setOpen(false); }}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive
                                                ? 'bg-gradient-to-r from-primary/5 to-indigo-500/5 border border-primary/20'
                                                : 'hover:bg-slate-50 border border-transparent'
                                            }`}
                                    >
                                        <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${roleColor[user.roleName] || 'from-slate-500 to-slate-600'} flex items-center justify-center text-white text-xs font-black shadow-sm`}>
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-xs font-bold text-slate-800">{user.name}</p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                {roleIcon[user.roleName]}
                                                <span className="text-[10px] font-semibold text-slate-500">{user.roleName}</span>
                                            </div>
                                        </div>
                                        {isActive && (
                                            <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center">
                                                <Check className="h-3 w-3 text-white" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
                            <p className="text-[9px] font-medium text-slate-400 text-center">
                                Switching persona changes visible permissions across the RBAC module
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

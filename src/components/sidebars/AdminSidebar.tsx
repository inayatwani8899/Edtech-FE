import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import {
    LayoutDashboard,
    Users,
    ClipboardList,
    Briefcase,
    Layers,
    Settings,
    HelpCircle,
    LogOut,
    Shield,
    BookOpen,
    BarChart3,
    Users2,
    Cog,
    Book,
    Sun,
    Moon,
    Menu,
    ChevronLeft,
    ChevronRight,
    Brain,
    PanelLeft,
    Lock,
    Key,
    UserCog,
    UserCheck,
    User,
    Building,
    GraduationCap,
    Circle
} from "lucide-react";
import Swal from 'sweetalert2';
import { usePermissionStore } from "../../store/permissionStore";
import { iconMap } from "../../utils/iconMapper";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarSkeleton } from "../layout/sidebar/SidebarSkeleton";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    useSidebar,
} from "@/components/ui/sidebar";
import { useAuthStore } from "../../store/useAuthStore";
import { cn } from "@/lib/utils";

// No hardcoded menus anymore. Driven by Permission Store.

export function AdminSidebar() {
    const { state, toggleSidebar, setOpen, isMobile, setOpenMobile } = useSidebar();
    const isCollapsed = state === "collapsed";
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;
    const { user, logout } = useAuthStore();
    const permissions = usePermissionStore((s) => s.permissions);
    const permissionsLoading = usePermissionStore((s) => s.loading);

    // Filter only items with canView === true
    let viewablePerms = permissions.filter(p => p.canView);

    // Ensure Questions is present for Admin / SuperAdmin
    const hasQuestionsPerm = viewablePerms.some(p => p.url === "/manage/questions");
    if (!hasQuestionsPerm && (user?.role === "Admin" || user?.role === "SuperAdmin")) {
        viewablePerms = [
            ...viewablePerms,
            {
                menuId: 9999,
                title: "Questions",
                url: "/manage/questions",
                icon: "BookOpen",
                color: "text-rose-500",
                sortOrder: 6,
                parentId: null,
                canView: true,
                canCreate: true,
                canEdit: true,
                canDelete: true,
            }
        ];
    }

    // Separate parent and child items
    const parentItems = viewablePerms
        .filter(p => p.parentId === null)
        .sort((a, b) => a.sortOrder - b.sortOrder);

    const childItems = viewablePerms.filter(p => p.parentId !== null);

    // Group child items by parentId
    const childrenByParent: Record<number, typeof permissions> = {};
    childItems.forEach(child => {
        if (child.parentId !== null) {
            if (!childrenByParent[child.parentId]) {
                childrenByParent[child.parentId] = [];
            }
            childrenByParent[child.parentId].push(child);
        }
    });

    // Sort child items by sortOrder
    Object.keys(childrenByParent).forEach(pid => {
        childrenByParent[Number(pid)].sort((a, b) => a.sortOrder - b.sortOrder);
    });

    const flowItems = parentItems.filter(p => !p.url.startsWith('/rbac'));
    const accessControlItems = parentItems.filter(p => p.url.startsWith('/rbac'));

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && window.innerWidth < 1024) {
                setOpen(false);
            } else if (window.innerWidth >= 1024) {
                setOpen(true);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [setOpen]);

    useEffect(() => {
        if (isMobile) {
            setOpenMobile(false);
        }
    }, [location.pathname, isMobile, setOpenMobile]);


    const [theme, setTheme] = useState<"dark" | "light">(() => {
        try {
            const raw = localStorage.getItem("adminSidebarTheme");
            return raw === "light" ? "light" : "dark";
        } catch {
            return "dark";
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem("adminSidebarCollapsed", JSON.stringify(isCollapsed));
        } catch (e) {
            void e;
        }
    }, [isCollapsed]);

    useEffect(() => {
        try {
            localStorage.setItem("adminSidebarTheme", theme);
        } catch (e) {
            void e;
        }
    }, [theme]);

    const isActive = (path: string) => currentPath === path || currentPath.startsWith(`${path}/`);

    const handleLogout = () => {
        Swal.fire({
            title: 'Sign Out?',
            text: 'Are you sure you want to end your executive session?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Yes, sign out',
            cancelButtonText: 'Cancel',
            background: theme === 'dark' ? '#1e293b' : '#fff',
            color: theme === 'dark' ? '#fff' : '#000',
        }).then((result) => {
            if (result.isConfirmed) {
                const redirectUrl = logout();
                navigate(redirectUrl);
            }
        });
    };


    return (
        <Sidebar collapsible="icon" className="transition-all duration-300 border-none">
            <SidebarContent
                className={cn(
                    "flex flex-col h-full transition-colors duration-200 overflow-hidden",
                    theme === "dark" ? "bg-[#0b0d11] text-slate-100" : "bg-white text-slate-900 shadow-sm"
                )}
            >
                {/* Fixed Header - Slimmed Down */}
                <div className={cn(
                    "flex px-3.5 py-3 transition-all duration-300",
                    isCollapsed ? "justify-center" : "justify-between items-center"
                )}>

                    <div className="flex items-center gap-2.5 min-w-0">
                        {/* Scaled Logo Container */}
                        <div className={cn(
                            "flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-[10px] border transition-all duration-300",
                            theme === "dark"
                                ? "bg-white/5 border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                                : "bg-slate-50 border-slate-200 shadow-sm shadow-blue-500/5"
                        )}>
                            <Brain className="h-5 w-5 text-indigo-500 stroke-[1.8]" />
                        </div>

                        {!isCollapsed && (
                            <div className="flex flex-col min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
                                <div className="flex items-baseline font-black tracking-tight text-[18px] leading-[1.1] logo-serif">
                                    <span className={cn(
                                        theme === "dark" ? "text-white" : "text-slate-900"
                                    )}>Cognify</span>
                                    <span className="text-blue-500 ml-0.5 italic">IQ</span>
                                </div>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <div className="h-1 w-1 flex-shrink-0 rounded-full bg-[#10b981] opacity-70" />
                                    <span className="text-[7.5px] font-bold tracking-[0.2em] text-slate-500 uppercase whitespace-nowrap">
                                        Executive Interface
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {!isCollapsed && (
                        <button
                            onClick={() => toggleSidebar()}
                            className={cn(
                                "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[9px] border transition-all hover:bg-white/10 group",
                                theme === "dark" ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200 hover:bg-slate-100 shadow-sm"
                            )}
                            title="Collapse"
                        >
                            <PanelLeft className="h-4 w-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                        </button>
                    )}
                </div>

                {/* Navigation Menu Area - Ultra Compact */}
                <div className="flex-1 flex flex-col min-h-0 pt-0 px-0 overflow-hidden">
                    {permissionsLoading ? (
                        <SidebarSkeleton isCollapsed={isCollapsed} theme={theme} />
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key="admin-sidebar-menu"
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                transition={{ duration: 0.25 }}
                                className="flex-1 flex flex-col min-h-0 overflow-y-auto scrollbar-none"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {/* Navigation Section */}
                                <SidebarGroup className="py-1 flex-none">


                        {!isCollapsed && (
                            <div className="px-4 mb-4 flex items-center gap-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 whitespace-nowrap">
                                    Cognify Flow
                                </span>
                                <div className={cn(
                                    "h-[1px] w-full",
                                    theme === "dark" ? "bg-slate-800/50" : "bg-slate-100"
                                )} />
                            </div>
                        )}
                        <SidebarGroupContent>
                            <SidebarMenu className="space-y-0.5 px-1 py-0">
                                {flowItems.map((item) => {
                                    const Icon = iconMap[item.icon] ?? Circle;
                                    const children = childrenByParent[item.menuId];
                                    return (
                                        <React.Fragment key={item.menuId}>
                                            <SidebarMenuItem>
                                                <SidebarMenuButton asChild isActive={isActive(item.url)} className={`transition-all duration-200 rounded-lg ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-50"} group h-8`}>
                                                    <NavLink to={item.url} title={item.title} className={`flex items-center gap-3 px-3 py-1.5 ${isCollapsed ? "justify-center" : ""} w-full`}>
                                                        <Icon className={`h-4.5 w-4.5 ${isActive(item.url) ? (item.color || "text-indigo-500") : theme === "dark" ? "text-slate-300" : "text-slate-500"} group-hover:scale-105 transition-transform duration-200`} />
                                                        <span className={`${isCollapsed ? "hidden" : "text-sm font-medium"}`}>{item.title}</span>
                                                    </NavLink>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                            
                                            {!isCollapsed && children && children.map((child) => {
                                                const ChildIcon = iconMap[child.icon] ?? Circle;
                                                return (
                                                    <SidebarMenuItem key={child.menuId} className="pl-4 mt-0.5">
                                                        <SidebarMenuButton asChild isActive={isActive(child.url)} className={`transition-all duration-200 rounded-lg ${theme === "dark" ? "hover:bg-slate-800/60" : "hover:bg-slate-50/60"} group h-7`}>
                                                            <NavLink to={child.url} title={child.title} className="flex items-center gap-2.5 px-3 py-1 w-full">
                                                                <ChildIcon className={`h-3.5 w-3.5 ${isActive(child.url) ? (child.color || "text-indigo-500") : theme === "dark" ? "text-slate-400" : "text-slate-400"} group-hover:scale-105 transition-transform duration-200`} />
                                                                <span className="text-xs font-normal opacity-90">{child.title}</span>
                                                            </NavLink>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuItem>
                                                );
                                            })}
                                        </React.Fragment>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>

                    </SidebarGroup>

                    {/* Access Control Section */}
                    {accessControlItems.length > 0 && (
                        <SidebarGroup>
                            {!isCollapsed && (
                                <div className="px-4 mb-4 mt-2 flex items-center gap-4">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 whitespace-nowrap">
                                        Access Control
                                    </span>
                                    <div className={cn(
                                        "h-[1px] w-full",
                                        theme === "dark" ? "bg-slate-800/50" : "bg-slate-100"
                                    )} />
                                </div>
                            )}
                            <SidebarGroupContent>
                                <SidebarMenu className="space-y-0.5 px-1 py-0">
                                    {accessControlItems.map((item) => {
                                        const Icon = iconMap[item.icon] ?? Circle;
                                        const children = childrenByParent[item.menuId];
                                        return (
                                            <React.Fragment key={item.menuId}>
                                                <SidebarMenuItem>
                                                    <SidebarMenuButton asChild isActive={isActive(item.url)} className={`transition-all duration-200 rounded-lg ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-50"} group h-8`}>
                                                        <NavLink to={item.url} title={item.title} className={`flex items-center gap-3 px-3 py-1 ${isCollapsed ? "justify-center" : ""} w-full`}>
                                                            <Icon className={`h-4.5 w-4.5 ${isActive(item.url) ? (item.color || "text-indigo-500") : theme === "dark" ? "text-slate-300" : "text-slate-500"} group-hover:scale-105 transition-transform duration-200`} />
                                                            <span className={`${isCollapsed ? "hidden" : "text-sm font-medium"}`}>{item.title}</span>
                                                        </NavLink>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>

                                                {!isCollapsed && children && children.map((child) => {
                                                    const ChildIcon = iconMap[child.icon] ?? Circle;
                                                    return (
                                                        <SidebarMenuItem key={child.menuId} className="pl-4 mt-0.5">
                                                            <SidebarMenuButton asChild isActive={isActive(child.url)} className={`transition-all duration-200 rounded-lg ${theme === "dark" ? "hover:bg-slate-800/60" : "hover:bg-slate-50/60"} group h-7`}>
                                                                <NavLink to={child.url} title={child.title} className="flex items-center gap-2.5 px-3 py-1 w-full">
                                                                    <ChildIcon className={`h-3.5 w-3.5 ${isActive(child.url) ? (child.color || "text-indigo-500") : theme === "dark" ? "text-slate-400" : "text-slate-400"} group-hover:scale-105 transition-transform duration-200`} />
                                                                    <span className="text-xs font-normal opacity-90">{child.title}</span>
                                                                </NavLink>
                                                            </SidebarMenuButton>
                                                        </SidebarMenuItem>
                                                    );
                                                })}
                                            </React.Fragment>
                                        );
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    )}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>



                {/* Footer Section - REVERTED TO PREVIOUS FOOTER STYLE */}
                <div className={`px-3 py-3 border-t ${theme === "dark" ? "border-slate-700" : "border-slate-100"}`}>
                    <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-2 ${isCollapsed ? "justify-center w-full" : ""}`}>
                            <div className={cn(
                                "h-8 w-8 rounded-lg flex items-center justify-center font-bold text-white flex-shrink-0",
                                "bg-gradient-to-br from-indigo-500 to-purple-600"
                            )}>
                                {user?.name?.charAt(0) || <Shield className="h-4 w-4" />}
                            </div>
                            {!isCollapsed && (
                                <div className="text-xs">
                                    <div className="font-medium">{user?.name || "Super Admin"}</div>
                                    <div className={`${theme === "dark" ? "text-slate-300" : "text-muted-foreground"} text-[11px]`}>
                                        {user?.role === "Admin" || user?.role === "SuperAdmin" ? "SUPER ADMIN" : (user?.role?.toUpperCase() || "SUPER ADMIN")}
                                    </div>
                                </div>
                            )}
                        </div>

                        {!isCollapsed && (
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setTheme((s) => (s === "dark" ? "light" : "dark"))}
                                    className={`p-1 rounded-md transition-colors ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}
                                    title="Toggle Theme"
                                >
                                    {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-400" />}
                                </button>
                                <button
                                    onClick={() => navigate("/profile")}
                                    title="Super Admin Profile"
                                    className={`p-1 rounded-md transition-colors ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}
                                >
                                    <User className="h-4 w-4" />
                                </button>
                                <button onClick={handleLogout} title="Sign out" className={`p-1 rounded-md transition-colors ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}>
                                    <LogOut className="h-4 w-4 text-red-500" />
                                </button>
                            </div>
                        )}
                        {isCollapsed && (
                            <div className="flex flex-col gap-2 mt-4">
                                <button onClick={handleLogout} title="Sign out" className="p-1 rounded-md hover:bg-slate-800 transition-colors">
                                    <LogOut className="h-4 w-4 text-red-500" />
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </SidebarContent>
        </Sidebar>
    );
}
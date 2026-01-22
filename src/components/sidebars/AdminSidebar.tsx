import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
} from "lucide-react";
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

// Define navigation items specific to the Admin role
const adminMenuItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, color: "text-red-600" },
    { title: "User Management", url: "/manage/users", icon: Users, color: "text-blue-600" },
    { title: "Counselor Management", url: "/manage/counselors", icon: Users2, color: "text-yellow-600" },
    { title: "Student Management", url: "/manage/students", icon: Users, color: "text-blue-600" },
    { title: "Test Management", url: "/manage/tests", icon: ClipboardList, color: "text-green-600" },
    { title: "Test Configuration Management", url: "/manage/configurations", icon: Cog, color: "text-green-600" },
    { title: "AI Question Generation", url: "/ai-generation", icon: BookOpen, color: "text-yellow-600" },
    { title: "Categories Management", url: "/manage/categories", icon: Book, color: "text-indigo-600" },
];

export function AdminSidebar() {
    const { state, toggleSidebar } = useSidebar();
    const isCollapsed = state === "collapsed";
    const location = useLocation();
    const currentPath = location.pathname;
    const { user } = useAuthStore();

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
        } catch { }
    }, [isCollapsed]);

    useEffect(() => {
        try {
            localStorage.setItem("adminSidebarTheme", theme);
        } catch { }
    }, [theme]);

    const isActive = (path: string) => currentPath === path || currentPath.startsWith(`${path}/`);

    return (
        <Sidebar collapsible="icon" className="transition-all duration-300 border-none">
            <SidebarContent
                className={cn(
                    "flex flex-col h-full transition-colors duration-200 overflow-hidden",
                    theme === "dark" ? "bg-[#0c0f14] text-slate-100" : "bg-white text-slate-900 shadow-sm"
                )}
            >
                {/* Redesigned Header Part - Robust Layout */}
                <div className={cn(
                    "flex flex-col px-4 py-8",
                    isCollapsed ? "items-center" : "items-stretch"
                )}>
                    <div className={cn(
                        "flex items-center w-full min-w-0",
                        isCollapsed ? "justify-center" : "justify-between gap-3"
                    )}>
                        <div className="flex items-center gap-3 overflow-hidden min-w-0">
                            <div className={cn(
                                "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border transition-all duration-300",
                                theme === "dark" ? "bg-white/5 border-white/10 shadow-inner" : "bg-slate-50 border-slate-200 shadow-sm"
                            )}>
                                <Brain className="h-7 w-7 text-indigo-500 stroke-[1.5]" />
                            </div>

                            {!isCollapsed && (
                                <div className="flex flex-col min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
                                    <div className="flex items-baseline font-black tracking-tighter text-xl leading-none">
                                        <span className={cn(
                                            theme === "dark" ? "text-white" : "text-slate-950"
                                        )}>EDTECH</span>
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">NEURAL</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
                                        <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase truncate">
                                            Executive Interface
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {!isCollapsed && (
                            <div className="flex items-center gap-1 flex-shrink-0">
                                <button
                                    onClick={() => setTheme((s) => (s === "dark" ? "light" : "dark"))}
                                    className={cn(
                                        "flex h-9 w-9 items-center justify-center rounded-xl border transition-all hover:scale-105",
                                        theme === "dark" ? "border-white/10 bg-white/5 hover:bg-white/10" : "border-slate-200 bg-slate-50 hover:bg-slate-100 shadow-sm"
                                    )}
                                    title={theme === "dark" ? "Light Mode" : "Dark Mode"}
                                >
                                    {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
                                </button>
                                <button
                                    onClick={() => toggleSidebar()}
                                    className={cn(
                                        "flex h-9 w-9 items-center justify-center rounded-xl border transition-all hover:scale-105 group",
                                        theme === "dark" ? "border-white/10 bg-white/5 hover:bg-white/10" : "border-slate-200 bg-slate-50 hover:bg-slate-100 shadow-sm"
                                    )}
                                    title="Collapse"
                                >
                                    <PanelLeft className="h-4.5 w-4.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <SidebarGroup className="flex-1 overflow-auto pt-0">
                    {!isCollapsed && (
                        <div className="px-5 mb-5 flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500/80 whitespace-nowrap">
                                Neural Flow
                            </span>
                            <div className={cn(
                                "h-[1px] w-full",
                                theme === "dark" ? "bg-slate-800" : "bg-slate-100"
                            )} />
                        </div>
                    )}
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1 px-1 py-2">
                            {adminMenuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={isActive(item.url)} className={`transition-all duration-200 rounded-lg ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-50"} group`}>
                                        <NavLink to={item.url} title={item.title} className={`flex items-center gap-3 px-3 py-2.5 ${isCollapsed ? "justify-center" : ""} w-full`}>
                                            <item.icon className={`h-5 w-5 ${isActive(item.url) ? item.color : theme === "dark" ? "text-slate-300" : "text-slate-500"} group-hover:scale-110 transition-transform duration-200`} />
                                            <span className={`${isCollapsed ? "hidden" : "text-sm font-medium"}`}>{item.title}</span>
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <div className={`px-3 py-3 border-t ${theme === "dark" ? "border-white/5 bg-white/0" : "border-slate-100 bg-slate-50/30"}`}>
                    <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center w-full" : ""}`}>
                            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                <Shield className="h-4 w-4 text-indigo-500" />
                            </div>
                            <div className={`${isCollapsed ? "hidden" : "text-xs flex flex-col"}`}>
                                <div className={cn(
                                    "font-bold truncate max-w-[120px]",
                                    theme === "dark" ? "text-slate-200" : "text-slate-900"
                                )}>{user?.name || "Admin User"}</div>
                                <div className="text-slate-500 text-[10px] font-black uppercase tracking-wider">{user?.role || "Administrator"}</div>
                            </div>
                        </div>

                        {!isCollapsed && (
                            <button onClick={() => { }} title="Sign out" className={cn(
                                "p-1.5 rounded-lg transition-colors duration-200",
                                theme === "dark" ? "hover:bg-red-500/10 hover:text-red-400" : "hover:bg-red-50 hover:text-red-600"
                            )}>
                                <LogOut className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
            </SidebarContent>
        </Sidebar>
    );
}
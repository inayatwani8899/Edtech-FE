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
                    theme === "dark" ? "bg-[#0b0d11] text-slate-100" : "bg-white text-slate-900 shadow-sm"
                )}
            >
                {/* Fixed Header - Exact Match to Target Image */}
                <div className={cn(
                    "flex px-4 py-7 transition-all duration-300",
                    isCollapsed ? "justify-center" : "justify-between items-center"
                )}>
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Logo Container with Smooth Squircle feel */}
                        <div className={cn(
                            "flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-[14px] border transition-all duration-300",
                            theme === "dark"
                                ? "bg-white/5 border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                                : "bg-slate-50 border-slate-200 shadow-sm shadow-blue-500/5"
                        )}>
                            <Brain className="h-6 w-6 text-indigo-500 stroke-[1.8]" />
                        </div>

                        {!isCollapsed && (
                            <div className="flex flex-col min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
                                <div className="flex items-baseline font-black tracking-tighter text-[19px] leading-[1.1]">
                                    <span className={cn(
                                        theme === "dark" ? "text-white" : "text-slate-900"
                                    )}>EDTECH</span>
                                    <span className="text-blue-500">NEURAL</span>
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#10b981] opacity-70" />
                                    <span className="text-[9px] font-bold tracking-[0.25em] text-slate-500 uppercase whitespace-nowrap">
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
                                "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[12px] border transition-all hover:bg-white/10 group",
                                theme === "dark" ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200 hover:bg-slate-100 shadow-sm"
                            )}
                            title="Collapse"
                        >
                            <PanelLeft className="h-5 w-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                        </button>
                    )}
                </div>

                {/* Navigation Section - REVERTED TO PREVIOUS BODY STYLE */}
                <SidebarGroup className="flex-1">
                    {!isCollapsed && (
                        <div className="px-4 mb-4 flex items-center gap-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 whitespace-nowrap">
                                Neural Flow
                            </span>
                            <div className={cn(
                                "h-[1px] w-full",
                                theme === "dark" ? "bg-slate-800/50" : "bg-slate-100"
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
                                    <div className="font-medium">{user?.name || "Admin"}</div>
                                    <div className={`${theme === "dark" ? "text-slate-300" : "text-muted-foreground"} text-[11px]`}>{user?.role?.toUpperCase() || "ADMIN"}</div>
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
                                    {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
                                </button>
                                <button onClick={() => { }} title="Sign out" className={`p-1 rounded-md ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}>
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </SidebarContent>
        </Sidebar>
    );
}
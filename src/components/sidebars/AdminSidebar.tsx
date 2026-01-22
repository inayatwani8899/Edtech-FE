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
        } catch {}
    }, [isCollapsed]);

    useEffect(() => {
        try {
            localStorage.setItem("adminSidebarTheme", theme);
        } catch {}
    }, [theme]);

    const isActive = (path: string) => currentPath === path || currentPath.startsWith(`${path}/`);

    return (
        <Sidebar collapsible="icon" className="transition-all duration-300">
            <SidebarContent
                className={`flex flex-col h-full transition-colors duration-200 ${
                    theme === "dark" ? "bg-slate-900 text-slate-100" : "bg-white text-slate-700 shadow-sm"
                }`}
            >
                <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
                            <Menu className="h-5 w-5" />
                        </div>
                        <div className={`${isCollapsed ? "hidden" : "flex flex-col"}`}>
                            <span className="text-sm font-semibold">PathGrad</span>
                            <span className="text-[11px] text-sidebar-foreground/60">Admin Portal</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            title={theme === "dark" ? "Switch to light" : "Switch to dark"}
                            onClick={() => setTheme((s) => (s === "dark" ? "light" : "dark"))}
                            className={`p-1 rounded-md transition-colors ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}
                        >
                            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </button>

                        <button
                            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                            onClick={() => toggleSidebar()}
                            className={`p-1 rounded-md transition-transform ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}
                        >
                            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <SidebarGroup className="flex-1 overflow-auto">
                    <SidebarGroupLabel className={`font-bold text-xs uppercase tracking-wider px-3 py-2 ${isCollapsed ? "hidden" : theme === "dark" ? "text-slate-300" : "text-sidebar-foreground/70"}`}>
                        Navigation
                    </SidebarGroupLabel>
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

                <div className={`px-3 py-3 border-t ${theme === "dark" ? "border-slate-700" : "border-slate-100"}`}>
                    <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-2 ${isCollapsed ? "justify-center w-full" : ""}`}>
                            <Shield className="h-4 w-4 text-rose-500" />
                            <div className={`${isCollapsed ? "hidden" : "text-xs"}`}>
                                <div className="font-medium">{user?.name || "Admin"}</div>
                                <div className={`${theme === "dark" ? "text-slate-300" : "text-muted-foreground"} text-[11px]`}>{user?.role?.toUpperCase() || "ADMIN"}</div>
                            </div>
                        </div>

                        <div>
                            <button onClick={() => {}} title="Sign out" className={`p-1 rounded-md ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}>
                                <LogOut className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </SidebarContent>
        </Sidebar>
    );
}
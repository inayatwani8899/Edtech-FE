import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    UserSquare2,
    GraduationCap,
    School,
    FileText,
    Settings,
    LogOut,
    Brain,
    PanelLeft,
    Sun,
    Moon,
    User,
    Calendar,
    MessageSquare,
    ClipboardCheck
} from "lucide-react";
import Swal from 'sweetalert2';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    useSidebar,
} from "@/components/ui/sidebar";
import { useAuthStore } from "../../store/useAuthStore";
import { cn } from "@/lib/utils";

const schoolMenuItems = [
    { title: "Dashboard", url: "/school/dashboard", icon: LayoutDashboard, color: "text-blue-500" },
    { title: "Manage Students", url: "/school/students", icon: GraduationCap, color: "text-indigo-500" },
    { title: "Manage Staff", url: "/school/staff", icon: UserSquare2, color: "text-emerald-500" },
    { title: "Academic Calendar", url: "/school/calendar", icon: Calendar, color: "text-amber-500" },
    { title: "Assessments", url: "/school/assessments", icon: ClipboardCheck, color: "text-purple-500" },
    { title: "Reports & Analytics", url: "/school/reports", icon: FileText, color: "text-rose-500" },
];

const communicationItems = [
    { title: "Messages", url: "/school/messages", icon: MessageSquare, color: "text-sky-500" },
    { title: "School Profile", url: "/school/profile", icon: School, color: "text-orange-500" },
    { title: "Settings", url: "/school/settings", icon: Settings, color: "text-slate-500" },
];

export function SchoolSidebar() {
    const { state, toggleSidebar } = useSidebar();
    const isCollapsed = state === "collapsed";
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;
    const { user, logout } = useAuthStore();

    const [theme, setTheme] = useState<"dark" | "light">(() => {
        try {
            const raw = localStorage.getItem("schoolSidebarTheme");
            return raw === "light" ? "light" : "dark";
        } catch {
            return "dark";
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem("schoolSidebarTheme", theme);
        } catch { }
    }, [theme]);

    const isActive = (path: string) => currentPath === path || currentPath.startsWith(`${path}/`);

    const handleLogout = () => {
        Swal.fire({
            title: 'Sign Out?',
            text: 'Are you sure you want to log out of the school portal?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3b82f6',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Yes, sign out',
            cancelButtonText: 'Cancel',
            background: theme === 'dark' ? '#1e293b' : '#fff',
            color: theme === 'dark' ? '#fff' : '#000',
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
                navigate("/login");
            }
        });
    };

    return (
        <Sidebar collapsible="icon" className="transition-all duration-300 border-none">
            <SidebarContent
                className={cn(
                    "flex flex-col h-full transition-colors duration-200 overflow-hidden",
                    theme === "dark" ? "bg-[#0f172a] text-slate-100" : "bg-white text-slate-900 shadow-sm"
                )}
            >
                <div className={cn(
                    "flex px-3.5 py-4 transition-all duration-300",
                    isCollapsed ? "justify-center" : "justify-between items-center"
                )}>
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className={cn(
                            "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border transition-all duration-300",
                            theme === "dark"
                                ? "bg-blue-500/10 border-blue-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                                : "bg-blue-50 border-blue-100 shadow-sm"
                        )}>
                            <School className="h-5 w-5 text-blue-500" />
                        </div>

                        {!isCollapsed && (
                            <div className="flex flex-col min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
                                <div className="flex items-baseline font-bold tracking-tight text-lg leading-tight">
                                    <span className={cn(
                                        theme === "dark" ? "text-white" : "text-slate-900"
                                    )}>School</span>
                                    <span className="text-blue-500 ml-1">Portal</span>
                                </div>
                                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                                    Administration
                                </span>
                            </div>
                        )}
                    </div>

                    {!isCollapsed && (
                        <button
                            onClick={() => toggleSidebar()}
                            className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-lg border transition-all hover:bg-slate-100 dark:hover:bg-slate-800",
                                theme === "dark" ? "border-slate-800" : "border-slate-200 shadow-sm"
                            )}
                        >
                            <PanelLeft className="h-4 w-4 text-slate-400" />
                        </button>
                    )}
                </div>

                <div className="flex-1 flex flex-col min-h-0 pt-2 px-2 overflow-y-auto">
                    <SidebarGroup>
                        {!isCollapsed && (
                            <div className="px-3 mb-2 flex items-center">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    Management
                                </span>
                            </div>
                        )}
                        <SidebarGroupContent>
                            <SidebarMenu className="space-y-1">
                                {schoolMenuItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild isActive={isActive(item.url)} className={cn(
                                                "transition-all duration-200 rounded-lg group h-10",
                                                theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-100"
                                            )}>
                                                <NavLink to={item.url} title={item.title} className={cn(
                                                    "flex items-center gap-3 px-3 w-full",
                                                    isCollapsed && "justify-center"
                                                )}>
                                                    <Icon className={cn(
                                                        "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                                                        isActive(item.url) ? item.color : "text-slate-400"
                                                    )} />
                                                    {!isCollapsed && <span className="text-sm font-medium">{item.title}</span>}
                                                </NavLink>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup className="mt-4">
                        {!isCollapsed && (
                            <div className="px-3 mb-2 flex items-center">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    Organization
                                </span>
                            </div>
                        )}
                        <SidebarGroupContent>
                            <SidebarMenu className="space-y-1">
                                {communicationItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild isActive={isActive(item.url)} className={cn(
                                                "transition-all duration-200 rounded-lg group h-10",
                                                theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-100"
                                            )}>
                                                <NavLink to={item.url} title={item.title} className={cn(
                                                    "flex items-center gap-3 px-3 w-full",
                                                    isCollapsed && "justify-center"
                                                )}>
                                                    <Icon className={cn(
                                                        "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                                                        isActive(item.url) ? item.color : "text-slate-400"
                                                    )} />
                                                    {!isCollapsed && <span className="text-sm font-medium">{item.title}</span>}
                                                </NavLink>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </div>

                <div className={cn(
                    "p-4 border-t",
                    theme === "dark" ? "border-slate-800" : "border-slate-100"
                )}>
                    <div className={cn(
                        "flex items-center justify-between",
                        isCollapsed && "flex-col gap-4"
                    )}>
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
                                {user?.name?.charAt(0) || "S"}
                            </div>
                            {!isCollapsed && (
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-semibold truncate">{user?.name || "School Admin"}</span>
                                    <span className="text-[11px] text-slate-500 uppercase font-black">School</span>
                                </div>
                            )}
                        </div>

                        {!isCollapsed && (
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setTheme((s) => (s === "dark" ? "light" : "dark"))}
                                    className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    title="Toggle Theme"
                                >
                                    {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-400" />}
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                    title="Sign out"
                                >
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

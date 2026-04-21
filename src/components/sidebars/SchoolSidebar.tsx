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
    ClipboardCheck,
    Shield,
    Wallet,
    Bell,
    Layers
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
    { title: "Class Sections", url: "/school/classes", icon: Layers, color: "text-orange-500" },
    { title: "Academic Calendar", url: "/school/calendar", icon: Calendar, color: "text-amber-500" },
    { title: "Assessments", url: "/school/assessments", icon: ClipboardCheck, color: "text-purple-500" },
    { title: "Reports & Analytics", url: "/school/reports", icon: FileText, color: "text-rose-500" },
];

const organizationItems = [
    { title: "Financials", url: "/school/finance", icon: Wallet, color: "text-cyan-500" },
    { title: "Announcements", url: "/school/announcements", icon: Bell, color: "text-yellow-500" },
    { title: "Messages", url: "/school/messages", icon: MessageSquare, color: "text-sky-500" },
    { title: "School Profile", url: "/school/profile", icon: School, color: "text-indigo-500" },
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
            text: 'Are you sure you want to end your school administrative session?',
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
                    theme === "dark" ? "bg-[#0b0d11] text-slate-100" : "bg-white text-slate-900 shadow-sm"
                )}
            >
                {/* Fixed Header - CognifyIQ Branding */}
                <div className={cn(
                    "flex px-3.5 py-3 transition-all duration-300",
                    isCollapsed ? "justify-center" : "justify-between items-center"
                )}>
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className={cn(
                            "flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-[10px] border transition-all duration-300",
                            theme === "dark"
                                ? "bg-white/5 border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                                : "bg-slate-50 border-slate-200 shadow-sm shadow-blue-500/5"
                        )}>
                            <Brain className="h-5 w-5 text-blue-500 stroke-[1.8]" />
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
                                    <div className="h-1 w-1 flex-shrink-0 rounded-full bg-blue-500 opacity-70" />
                                    <span className="text-[7.5px] font-bold tracking-[0.2em] text-slate-500 uppercase whitespace-nowrap">
                                        Organization Portal
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
                            <PanelLeft className="h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                        </button>
                    )}
                </div>

                <div 
                    className="flex-1 flex flex-col min-h-0 pt-0 px-0 overflow-y-auto scrollbar-none"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <SidebarGroup className="py-1 flex-none">
                        {!isCollapsed && (
                            <div className="px-4 mb-4 flex items-center gap-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 whitespace-nowrap">
                                    Management Flow
                                </span>
                                <div className={cn(
                                    "h-[1px] w-full",
                                    theme === "dark" ? "bg-slate-800/50" : "bg-slate-100"
                                )} />
                            </div>
                        )}
                        <SidebarGroupContent>
                            <SidebarMenu className="space-y-0.5 px-1 py-0">
                                {schoolMenuItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild isActive={isActive(item.url)} className={cn(
                                                "transition-all duration-200 rounded-lg group h-8",
                                                theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-50"
                                            )}>
                                                <NavLink to={item.url} title={item.title} className={cn(
                                                    "flex items-center gap-3 px-3 py-1.5 w-full",
                                                    isCollapsed && "justify-center"
                                                )}>
                                                    <Icon className={cn(
                                                        "h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-105",
                                                        isActive(item.url) ? item.color : theme === "dark" ? "text-slate-300" : "text-slate-500"
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

                    <SidebarGroup className="mt-2">
                        {!isCollapsed && (
                            <div className="px-4 mb-4 flex items-center gap-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 whitespace-nowrap">
                                    Organization
                                </span>
                                <div className={cn(
                                    "h-[1px] w-full",
                                    theme === "dark" ? "bg-slate-800/50" : "bg-slate-100"
                                )} />
                            </div>
                        )}
                        <SidebarGroupContent>
                            <SidebarMenu className="space-y-0.5 px-1 py-0">
                                {organizationItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild isActive={isActive(item.url)} className={cn(
                                                "transition-all duration-200 rounded-lg group h-8",
                                                theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-50"
                                            )}>
                                                <NavLink to={item.url} title={item.title} className={cn(
                                                    "flex items-center gap-3 px-3 py-1.5 w-full",
                                                    isCollapsed && "justify-center"
                                                )}>
                                                    <Icon className={cn(
                                                        "h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-105",
                                                        isActive(item.url) ? item.color : theme === "dark" ? "text-slate-300" : "text-slate-500"
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

                {/* Footer Section */}
                <div className={cn(
                    "px-3 py-3 border-t",
                    theme === "dark" ? "border-slate-700" : "border-slate-100"
                )}>
                    <div className="flex items-center justify-between">
                        <div className={cn(
                            "flex items-center gap-2",
                            isCollapsed && "justify-center w-full"
                        )}>
                            <div className={cn(
                                "h-8 w-8 rounded-lg flex items-center justify-center font-bold text-white flex-shrink-0",
                                "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/20"
                            )}>
                                {user?.name?.charAt(0) || <Shield className="h-4 w-4" />}
                            </div>
                            {!isCollapsed && (
                                <div className="text-xs">
                                    <div className="font-medium truncate max-w-[100px]">{user?.name || "School Admin"}</div>
                                    <div className={cn(
                                        "text-[11px] uppercase font-bold",
                                        theme === "dark" ? "text-slate-400" : "text-slate-500"
                                    )}>{user?.role || "SCHOOL"}</div>
                                </div>
                            )}
                        </div>

                        {!isCollapsed && (
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setTheme((s) => (s === "dark" ? "light" : "dark"))}
                                    className={cn(
                                        "p-1 rounded-md transition-colors",
                                        theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-50"
                                    )}
                                    title="Toggle Theme"
                                >
                                    {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-blue-400" />}
                                </button>
                                <button
                                    onClick={() => navigate("/school/profile")}
                                    title="Organization Profile"
                                    className={cn(
                                        "p-1 rounded-md transition-colors",
                                        theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-50"
                                    )}
                                >
                                    <User className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={handleLogout}
                                    title="Sign out"
                                    className={cn(
                                        "p-1 rounded-md transition-colors",
                                        theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-50"
                                    )}
                                >
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

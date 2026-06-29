import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Calendar,
    MessageSquare,
    Brain,
    FileText,
    BookOpen,
    HelpCircle,
    LogOut,
    Shield,
    Sun,
    Moon,
    PanelLeft,
    Search,
    UserCircle,
    Settings,
    Clock,
    TrendingUp,
    User
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

// Define navigation items for the Counselor role
const counselorMenuItems = [
    { title: "Dashboard", url: "/counselor/dashboard", icon: LayoutDashboard, color: "text-emerald-500" },
    { title: "My Students", url: "/counselor/students", icon: Users, color: "text-sky-500" },
    { title: "Appointments", url: "/counselor/appointments", icon: Calendar, color: "text-indigo-500" },
    { title: "Assessments", url: "/counselor/assessments", icon: Brain, color: "text-purple-500" },
    { title: "Messages", url: "/counselor/messages", icon: MessageSquare, color: "text-teal-500" },
    { title: "Reports", url: "/counselor/reports", icon: FileText, color: "text-blue-500" },
    { title: "Resources", url: "/counselor/resources", icon: BookOpen, color: "text-amber-500" },
    { title: "Search", url: "/counselor/search", icon: Search, color: "text-slate-500" },
];

export function CounselorSidebar() {
    const { state, toggleSidebar } = useSidebar();
    const isCollapsed = state === "collapsed";
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;
    const { user, logout } = useAuthStore();

    const [theme, setTheme] = useState<"dark" | "light">(() => {
        try {
            const raw = localStorage.getItem("counselorSidebarTheme");
            return raw === "light" ? "light" : "dark";
        } catch {
            return "dark";
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem("counselorSidebarCollapsed", JSON.stringify(isCollapsed));
        } catch { }
    }, [isCollapsed]);

    useEffect(() => {
        try {
            localStorage.setItem("counselorSidebarTheme", theme);
        } catch { }
    }, [theme]);

    const isActive = (path: string) => currentPath === path || currentPath.startsWith(`${path}/`);

    const handleLogout = () => {
        Swal.fire({
            title: 'Sign Out?',
            text: 'Are you sure you want to end your professional session?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Yes, sign out',
            cancelButtonText: 'Cancel',
            background: theme === 'dark' ? '#0b0e14' : '#fff',
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
            <CustomStyles />
            <SidebarContent
                className={cn(
                    "flex flex-col h-full transition-colors duration-200 overflow-hidden",
                    theme === "dark"
                        ? "bg-[#0b0e14] text-slate-100 shadow-[inset_-1px_0_0_rgba(255,255,255,0.05)]"
                        : "bg-white text-slate-900 shadow-xl border-r border-slate-100"
                )}
            >
                {/* Header Section */}
                <div className={cn(
                    "flex px-4 py-6 transition-all duration-300",
                    isCollapsed ? "flex-col items-center gap-6" : "justify-between items-center"
                )}>
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Professional Logo Container */}
                        <div className={cn(
                            "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border transition-all duration-300 shadow-lg",
                            theme === "dark"
                                ? "bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/5 hover:bg-emerald-500/20"
                                : "bg-emerald-50/50 border-emerald-100 shadow-emerald-500/5 hover:bg-emerald-100/50"
                        )}>
                            <Shield className="h-5 w-5 text-emerald-500 stroke-[2]" />
                        </div>

                        {!isCollapsed && (
                            <div className="flex flex-col min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
                                <div className="flex items-baseline font-black tracking-tight text-[18px] leading-[1.1] logo-serif">
                                    <span className={theme === "dark" ? "text-white" : "text-emerald-950"}>Cognify</span>
                                    <span className="text-emerald-500 ml-0.5 font-extrabold uppercase tracking-tighter italic">IQ</span>
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500 shadow-glow shadow-emerald-500/50 animate-pulse" />
                                    <span className="text-[9px] font-black tracking-[0.25em] text-emerald-600/70 uppercase whitespace-nowrap">
                                        Counselor Hub
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => toggleSidebar()}
                        className={cn(
                            "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border transition-all hover:scale-105 active:scale-95 group shadow-sm",
                            theme === "dark"
                                ? "bg-white/5 border-white/10 hover:bg-white/10"
                                : "bg-slate-50 border-slate-200 hover:bg-emerald-50 hover:border-emerald-100"
                        )}
                        title={isCollapsed ? "Expand" : "Collapse"}
                    >
                        <PanelLeft className={cn(
                            "h-4 w-4 text-slate-400 group-hover:text-emerald-500 transition-transform duration-300",
                            isCollapsed && "rotate-180"
                        )} />
                    </button>
                </div>

                {/* Navigation Menu */}
                <SidebarGroup className="flex-1 overflow-y-auto custom-scrollbar pt-2 px-0">
                    {!isCollapsed && (
                        <div className="px-6 mb-4 flex items-center justify-between gap-4 overflow-hidden">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600/40 whitespace-nowrap">
                                Operations
                            </span>
                            <div className={cn(
                                "h-[1px] w-full",
                                theme === "dark" ? "bg-white/5" : "bg-emerald-50"
                            )} />
                        </div>
                    )}
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1.5 px-3">
                            {counselorMenuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive(item.url)}
                                        className={cn(
                                            "transition-all duration-300 rounded-xl h-11 border border-transparent",
                                            theme === "dark"
                                                ? "hover:bg-emerald-500/5 hover:border-emerald-500/10"
                                                : "hover:bg-emerald-50 hover:border-emerald-100 shadow-sm hover:shadow-emerald-500/5",
                                            isActive(item.url) && (
                                                theme === "dark"
                                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/5"
                                                    : "bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-500/25 active:bg-emerald-600"
                                            )
                                        )}
                                    >
                                        <NavLink
                                            to={item.url}
                                            title={item.title}
                                            className={cn(
                                                "flex items-center gap-3.5 w-full",
                                                isCollapsed ? "justify-center" : "px-3"
                                            )}
                                        >
                                            <item.icon className={cn(
                                                "h-5 w-5 transition-all duration-500",
                                                isActive(item.url)
                                                    ? (theme === "dark" ? item.color : "text-white")
                                                    : (theme === "dark" ? "text-slate-400" : "text-slate-500"),
                                                "group-hover:scale-110 active:scale-95"
                                            )} />
                                            {!isCollapsed && (
                                                <span className={cn(
                                                    "text-[13px] font-semibold tracking-wide",
                                                    isActive(item.url) ? "opacity-100" : "opacity-80"
                                                )}>
                                                    {item.title}
                                                </span>
                                            )}
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Performance Monitoring (Mini) */}
                {!isCollapsed && (
                    <div className="px-5 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
                        <div className={cn(
                            "rounded-2xl p-4 border overflow-hidden relative group",
                            theme === "dark"
                                ? "bg-emerald-500/5 border-emerald-500/10"
                                : "bg-gradient-to-br from-emerald-50 to-sky-50 border-emerald-100 shadow-inner"
                        )}>
                            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full transform translate-x-4 -translate-y-4 group-hover:scale-150 transition-transform duration-700" />
                            <div className="flex items-center gap-3 mb-2.5">
                                <Clock className="h-4 w-4 text-emerald-500 shrink-0" />
                                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600/70">Week Performance</span>
                            </div>
                            <div className="flex items-end gap-2 mb-1.5">
                                <span className="text-2xl font-black text-emerald-600 tracking-tighter">92%</span>
                                <span className="text-[10px] font-bold text-emerald-500/70 pb-1">+4.2%</span>
                            </div>
                            <div className="w-full bg-slate-200/50 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full w-[92%] shadow-glow-sm shadow-emerald-500 animate-pulse-slow" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer User Area */}
                <div className={cn(
                    "p-3 mx-2 mb-2 rounded-[22px] transition-all duration-300",
                    theme === "dark" ? "bg-white/5 border border-white/5" : "bg-slate-50 border border-slate-200 shadow-sm"
                )}>
                    <div className={cn(
                        "flex items-center gap-3",
                        isCollapsed ? "justify-center" : "px-1 justify-between"
                    )}>
                        <div className="flex items-center gap-3 min-w-0">
                            <div className={cn(
                                "h-11 w-11 rounded-[16px] flex items-center justify-center font-black text-white flex-shrink-0 shadow-lg transform transition-transform hover:scale-105 active:scale-95",
                                "bg-gradient-to-br from-emerald-400 via-emerald-500 to-indigo-600 shadow-emerald-500/20 ring-2 ring-white/10"
                            )}>
                                {user?.firstName?.charAt(0) || user?.name?.charAt(0) || <UserCircle className="h-6 w-6" />}
                            </div>
                            {!isCollapsed && (
                                <div className="flex flex-col min-w-0 pr-2">
                                    <span className="font-bold text-[13px] leading-tight truncate tracking-tight">{user?.name || user?.firstName || "Counselor"}</span>
                                    <span className={cn(
                                        "text-[9px] font-black tracking-[0.15em] uppercase mt-0.5",
                                        theme === "dark" ? "text-emerald-400/80" : "text-emerald-600/80"
                                    )}>
                                        Verified Professional
                                    </span>
                                </div>
                            )}
                        </div>

                        {!isCollapsed && (
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setTheme((s) => (s === "dark" ? "light" : "dark"))}
                                    className={cn(
                                        "p-2 rounded-xl transition-all hover:scale-110 active:scale-90",
                                        theme === "dark" ? "hover:bg-white/10" : "hover:bg-white shadow-sm"
                                    )}
                                    title="Toggle Visual Mode"
                                >
                                    {theme === "dark" ? <Sun className="h-4 w-4 text-emerald-400 shadow-emerald-400" /> : <Moon className="h-4 w-4 text-emerald-600" />}
                                </button>
                                <button
                                    onClick={() => navigate("/profile")}
                                    title="Profile Settings"
                                    className={cn(
                                        "p-2 rounded-xl transition-all hover:scale-110 active:scale-90",
                                        theme === "dark" ? "hover:bg-white/10" : "hover:bg-white shadow-sm"
                                    )}
                                >
                                    <User className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className={cn(
                                        "p-2 rounded-xl transition-all hover:scale-110 active:scale-90 GROUP",
                                        theme === "dark" ? "hover:bg-white/10" : "hover:bg-white shadow-sm"
                                    )}
                                    title="Terminal Session"
                                >
                                    <LogOut className="h-4 w-4 text-red-400" />
                                </button>
                            </div>
                        )}
                        {isCollapsed && (
                            <div className="flex flex-col gap-3 mt-4 items-center">
                                <button onClick={handleLogout} title="Sign out" className="p-2 rounded-xl hover:bg-white/10 transition-all text-red-500">
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </SidebarContent>
        </Sidebar>
    );
}

// Custom CSS for scrollbar and glow - normally this would be in index.css but keeping it here for simplicity
const CustomStyles = () => (
    <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.1); border-radius: 10px; }
        .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .shadow-glow-sm { box-shadow: 0 0 10px -2px var(--tw-shadow-color); }
    `}} />
);

export default CounselorSidebar;

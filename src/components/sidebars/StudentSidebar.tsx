import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Briefcase,
    Layers,
    Settings,
    HelpCircle,
    LogOut,
    Shield,
    BookOpen,
    BarChart3,
    Cog,
    Book,
    Sun,
    Moon,
    Menu,
    ChevronLeft,
    ChevronRight,
    Brain,
    PanelLeft,
    Target,
    Award,
    Calendar,
    TrendingUp,
    MessageCircle,
    User
} from "lucide-react";
import Swal from 'sweetalert2';

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

// Define navigation items specific to the Student role
const studentMenuItems = [
    { title: "Dashboard", url: "/student/dashboard", icon: LayoutDashboard, color: "text-red-600" },
    { title: "Assessments", url: "/tests", icon: Brain, color: "text-blue-600" },
    { title: "Performance", url: "/results", icon: BarChart3, color: "text-yellow-600" },
    { title: "Learning Path", url: "/learning", icon: BookOpen, color: "text-green-600" },
    { title: "Career Guidance", url: "/career", icon: Target, color: "text-indigo-600" },
    { title: "Progress Tracker", url: "/progress", icon: TrendingUp, color: "text-blue-600" },
    { title: "Scholarships", url: "/scholarships", icon: Award, color: "text-green-600" },
    { title: "My Schedule", url: "/schedule", icon: Calendar, color: "text-amber-600" },
    { title: "Messages", url: "/messages", icon: MessageCircle, color: "text-teal-600" },
];

export function StudentSidebar() {
    const { state, toggleSidebar } = useSidebar();
    const isCollapsed = state === "collapsed";
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;
    const { user, logout } = useAuthStore();

    const [theme, setTheme] = useState<"dark" | "light">(() => {
        try {
            const raw = localStorage.getItem("studentSidebarTheme");
            return raw === "light" ? "light" : "dark";
        } catch {
            return "dark";
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem("studentSidebarCollapsed", JSON.stringify(isCollapsed));
        } catch { }
    }, [isCollapsed]);

    useEffect(() => {
        try {
            localStorage.setItem("studentSidebarTheme", theme);
        } catch { }
    }, [theme]);

    const isActive = (path: string) => currentPath === path || currentPath.startsWith(`${path}/`);

    const handleLogout = () => {
        Swal.fire({
            title: 'Sign Out?',
            text: 'Are you sure you want to end your session?',
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
                {/* Fixed Header - Scaled Down */}
                {/* Slimmed Header */}
                <div className={cn(
                    "flex px-3.5 py-3 transition-all duration-300",
                    isCollapsed ? "flex-col items-center gap-4" : "justify-between items-center"
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
                                        Student Interface
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => toggleSidebar()}
                        className={cn(
                            "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[9px] border transition-all hover:bg-white/10 group",
                            theme === "dark" ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200 hover:bg-slate-100 shadow-sm"
                        )}
                        title={isCollapsed ? "Expand" : "Collapse"}
                    >
                        <PanelLeft className={cn(
                            "h-4 w-4 text-slate-400 group-hover:text-indigo-400 transition-transform duration-300",
                            isCollapsed && "rotate-180"
                        )} />
                    </button>
                </div>

                {/* Navigation Menu Area - Ultra Compact */}
                <div className="flex-1 flex flex-col min-h-0 pt-0 px-0 overflow-hidden">
                    <SidebarGroup className="flex-none py-1">


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
                            {studentMenuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={isActive(item.url)} className={`transition-all duration-200 rounded-lg ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-50"} group h-9`}>
                                        <NavLink to={item.url} title={item.title} className={`flex items-center gap-3 px-3 py-1.5 ${isCollapsed ? "justify-center" : ""} w-full`}>
                                            <item.icon className={`h-5 w-5 ${isActive(item.url) ? item.color : theme === "dark" ? "text-slate-300" : "text-slate-500"} group-hover:scale-105 transition-transform duration-200`} />
                                            <span className={`${isCollapsed ? "hidden" : "text-sm font-medium"}`}>{item.title}</span>
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>

                </SidebarGroup>
                </div>


                {/* Footer Section */}
                <div className={`px-3 py-3 border-t ${theme === "dark" ? "border-slate-700" : "border-slate-100"}`}>
                    <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-2 ${isCollapsed ? "justify-center w-full" : ""}`}>
                            <div className={cn(
                                "h-8 w-8 rounded-lg flex items-center justify-center font-bold text-white flex-shrink-0",
                                "bg-gradient-to-br from-indigo-500 to-purple-600"
                            )}>
                                {user?.name?.charAt(0) || user?.firstName?.charAt(0) || <Shield className="h-4 w-4" />}
                            </div>
                            {!isCollapsed && (
                                <div className="text-xs">
                                    <div className="font-medium">{user?.name || user?.firstName || "Student"}</div>
                                    <div className={`${theme === "dark" ? "text-slate-300" : "text-muted-foreground"} text-[11px]`}>{user?.role?.toUpperCase() || "STUDENT"}</div>
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
                                <button
                                    onClick={() => navigate("/profile")}
                                    title="Profile Settings"
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
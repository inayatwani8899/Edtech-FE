
import { NavLink, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    BookOpen,
    BarChart3,
    User,
    Award,
    Calendar,
    Target,
    TrendingUp,
    Brain,
    MessageCircle,
    Settings,
    HelpCircle,
    LogOut,
    PanelLeft
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
    SidebarHeader,
    useSidebar,
} from "@/components/ui/sidebar";

const studentMenuItems = [
    {
        title: "Dashboard",
        url: "/student/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Tests",
        url: "/tests",
        icon: Brain,
    },
    {
        title: "My Results",
        url: "/results",
        icon: BarChart3,
    },
    {
        title: "Learning Path",
        url: "/learning",
        icon: BookOpen,
    },
    {
        title: "Career Guidance",
        url: "/career",
        icon: Target,
    },
    {
        title: "Progress Tracking",
        url: "/progress",
        icon: TrendingUp,
    },
    {
        title: "Scholarships",
        url: "/scholarships",
        icon: Award,
    },
    {
        title: "Schedule",
        url: "/schedule",
        icon: Calendar,
    },
    {
        title: "Messages",
        url: "/messages",
        icon: MessageCircle,
    }
];

export function StudentSidebar() {
    const { toggleSidebar } = useSidebar();
    const location = useLocation();
    const currentPath = location.pathname;

    const isActive = (path: string) => {
        return currentPath === path || currentPath.startsWith(`${path}/`);
    };

    return (
        <Sidebar className="w-[270px] border-r border-white/5 shadow-2xl overflow-hidden ring-1 ring-white/5">
            <SidebarHeader className="bg-[#0a0c10] border-b border-white/5 p-4 h-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center relative group overflow-hidden">
                            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-40 group-hover:opacity-100 transition-opacity"></div>
                            <Brain className="h-5 w-5 text-primary relative z-10" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-xs font-black tracking-tight text-white leading-none">
                                EDTECH<span className="text-primary">NEURAL</span>
                            </h1>
                            <p className="text-[7px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1 flex items-center gap-1">
                                <span className="h-1 w-1 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.3)]"></span>
                                Interface
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={toggleSidebar}
                        className="h-9 w-9 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-white/5 transition-all active:scale-95"
                    >
                        <div className="h-3.5 w-3.5 border-[1.5px] border-current rounded-sm relative flex items-center px-[1px]">
                            <div className="w-[1px] h-[70%] bg-current rounded-full"></div>
                        </div>
                    </button>
                </div>
            </SidebarHeader>

            <SidebarContent
                className="bg-[#0a0c10] px-2 space-y-0 scrollbar-none py-1 overflow-y-auto overflow-x-hidden"
                style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
            >
                <style>{`
                    .scrollbar-none::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                <SidebarGroup>
                    <div className="flex items-center gap-3 px-3 mb-2 mt-4">
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10 whitespace-nowrap">Neural Flow</span>
                        <div className="h-[0.5px] w-full bg-white/5"></div>
                    </div>

                    <SidebarGroupContent>
                        <SidebarMenu className="gap-0.5">
                            {studentMenuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive(item.url)}
                                        className={`
                                            h-9 rounded-lg transition-all duration-300 group
                                            ${isActive(item.url)
                                                ? "bg-gradient-to-r from-white/[0.08] to-white/[0.02] text-white shadow-sm ring-1 ring-white/10"
                                                : "text-white/30 hover:bg-white/[0.03] hover:text-white/60"}
                                        `}
                                    >
                                        <NavLink
                                            to={item.url}
                                            className="flex items-center gap-3.5 px-3.5 w-full relative"
                                        >
                                            <item.icon
                                                className={`h-4 w-4 transition-all duration-300 
                                                    ${isActive(item.url) ? 'text-primary' : 'text-white/20 group-hover:text-white/40'}`}
                                            />
                                            <span className="text-[10px] font-black uppercase tracking-[0.15em]">{item.title}</span>
                                            {item.title === "Schedule" && (
                                                <div className="absolute right-4 h-1 w-1 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
                                            )}
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-auto pb-4">
                    <SidebarMenu className="gap-0.5">
                        <SidebarMenuItem>
                            <SidebarMenuButton className="h-9 rounded-lg text-white/20 hover:text-white hover:bg-white/[0.02] px-5 transition-all duration-300 group">
                                <Settings className="h-4 w-4 text-white/10 group-hover:text-white/30 mr-3" />
                                <span className="text-[9px] font-bold uppercase tracking-[0.15em]">Settings</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton className="h-9 rounded-lg text-white/20 hover:text-white hover:bg-white/[0.02] px-5 transition-all duration-300 group">
                                <HelpCircle className="h-4 w-4 text-white/10 group-hover:text-white/30 mr-3" />
                                <span className="text-[9px] font-bold uppercase tracking-[0.15em]">Support</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem className="mt-2">
                            <SidebarMenuButton className="h-9 rounded-lg text-white/10 hover:text-rose-400 hover:bg-rose-500/[0.02] px-5 transition-all duration-300 group">
                                <LogOut className="h-4 w-4 text-white/5 group-hover:text-rose-400/40 mr-3" />
                                <span className="text-[9px] font-bold uppercase tracking-[0.15em]">Sign Out</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
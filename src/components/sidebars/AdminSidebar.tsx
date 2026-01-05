import { NavLink, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users, // For managing users
    ClipboardList, // For managing tests/quizzes
    Briefcase, // For managing assignments
    Layers, // For tenant management
    Settings,
    HelpCircle,
    LogOut,
    Shield, // Admin-specific icon
    BookOpen,
    BarChart3,
    Users2,
    Cog,
    Book
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
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        color: "text-red-600" // Use a distinct color for admin links
    },
    {
        title: "User Management",
        url: "/manage/users",
        icon: Users,
        color: "text-blue-600"
    },
    {
        title: "Counselor Management",
        url: "/manage/counselors",
        icon: Users2,
        color: "text-yellow-600"
    },
    {
        title: "Student Management",
        url: "/manage/students",
        icon: Users,
        color: "text-blue-600"
    },
    {
        title: "Test Management",
        url: "/manage/tests",
        icon: ClipboardList,
        color: "text-green-600"
    },
    {
        title: "Test Configuration Management",
        url: "/manage/configurations",
        icon: Cog,
        color: "text-green-600"
    },
    {
        title: "AI Question Generation",
        url: "/ai-generation",
        icon: BookOpen,
        color: "text-yellow-600"
    },
    {
        title: "Categories Management",
        url: "/manage/categories",
        icon: Book,
        color: "text-indigo-600"
    },
    // {
    //     title: "Tenant Management",
    //     url: "/manage/tenants",
    //     icon: Layers,
    //     color: "text-pink-600"
    // },
    // {
    //     title: "Reports & Analytics",
    //     url: "/analytics",
    //     icon: BarChart3,
    //     color: "text-cyan-600"
    // }
];

export function AdminSidebar() {
    // You can remove `state` if the sidebar is not collapsible, but keeping it
    // allows the UI logic to remain consistent if you make it collapsible later.
    const { state } = useSidebar();
    const location = useLocation();
    const currentPath = location.pathname;
    const { user } = useAuthStore(); // Use auth to display tenant info

    // Function to determine active state, supporting nested routes (e.g., /manage/users/new)
    const isActive = (path: string) => {
        return currentPath === path || currentPath.startsWith(`${path}/`);
    };

    return (
        <Sidebar className="w-64">
            <SidebarContent className="bg-sidebar">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-sidebar-foreground/70 font-bold text-xs uppercase tracking-wider px-3 py-2">
                        Admin Portal
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {adminMenuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive(item.url)}
                                        className="
                                            transition-all duration-200 hover:bg-sidebar-accent group
                                        "
                                    >
                                        <NavLink
                                            to={item.url}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full"
                                        >
                                            <item.icon
                                                className={`h-5 w-5 ${isActive(item.url) ? item.color : 'text-sidebar-foreground/70'} 
                                                    group-hover:scale-110 transition-transform duration-200`}
                                            />
                                            <span className="text-sm font-medium">{item.title}</span>
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Quick Actions and System/Tenant Info Section */}
                {/* <SidebarGroup className="mt-auto">
                    <SidebarGroupLabel className="text-sidebar-foreground/70 font-semibold text-xs uppercase tracking-wider px-3 py-2">
                        System & Account
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <div className="px-3 py-1 text-xs text-muted-foreground/80 border-b pb-2 mb-2">
                            <Shield className="h-3 w-3 inline-block mr-1 text-red-500" />
                            Role: {user?.role?.toUpperCase() || 'ADMIN'}
                            <br />
                            
                        </div>
                        <SidebarMenu className="space-y-1">
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <NavLink to="/settings" className="text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent">
                                        <Settings className="h-4 w-4" />
                                        <span className="text-sm">Global Settings</span>
                                    </NavLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <NavLink to="/support" className="text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent">
                                        <HelpCircle className="h-4 w-4" />
                                        <span className="text-sm">Help & Docs</span>
                                    </NavLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    // Use a direct button for logout action
                                    onClick={() => {}}
                                    className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="text-sm">Sign Out</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup> */}
            </SidebarContent>
        </Sidebar>
    );
}
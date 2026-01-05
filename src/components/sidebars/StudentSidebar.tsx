// import { NavLink, useLocation } from "react-router-dom";
// import { 
//   LayoutDashboard, 
//   BookOpen, 
//   BarChart3, 
//   User, 
//   Award, 
//   Calendar,
//   Target,
//   TrendingUp,
//   Brain,
//   MessageCircle,
//   Settings,
//   HelpCircle,
//   LogOut
// } from "lucide-react";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
//   useSidebar,
// } from "@/components/ui/sidebar";

// const studentMenuItems = [
//   {
//     title: "Dashboard",
//     url: "/dashboard",
//     icon: LayoutDashboard,
//     color: "text-primary"
//   },
//   {
//     title: "Take Tests",
//     url: "/tests",
//     icon: Brain,
//     color: "text-secondary"
//   },
//   {
//     title: "My Results",
//     url: "/results",
//     icon: BarChart3,
//     color: "text-accent"
//   },
//   {
//     title: "Learning Path",
//     url: "/learning",
//     icon: BookOpen,
//     color: "text-warning"
//   },
//   {
//     title: "Career Guidance",
//     url: "/career",
//     icon: Target,
//     color: "text-success"
//   },
//   {
//     title: "Progress Tracking",
//     url: "/progress",
//     icon: TrendingUp,
//     color: "text-primary"
//   },
//   {
//     title: "Scholarships",
//     url: "/scholarships",
//     icon: Award,
//     color: "text-secondary"
//   },
//   {
//     title: "Schedule",
//     url: "/schedule",
//     icon: Calendar,
//     color: "text-accent"
//   },
//   {
//     title: "Messages",
//     url: "/messages",
//     icon: MessageCircle,
//     color: "text-warning"
//   },
//   {
//     title: "Profile",
//     url: "/profile",
//     icon: User,
//     color: "text-success"
//   }
// ];

// export function StudentSidebar() {
//   const { state } = useSidebar();
//   const location = useLocation();
//   const currentPath = location.pathname;

//   const isActive = (path: string) => currentPath === path || currentPath.startsWith(path);

//   return (
//     <Sidebar className={state === "collapsed" ? "w-16" : "w-64"} collapsible="icon">
//       <SidebarContent className="bg-sidebar">
//         <SidebarGroup>
//           <SidebarGroupLabel className="text-sidebar-foreground/70 font-semibold text-xs uppercase tracking-wider px-3 py-2">
//             Student Portal
//           </SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu className="space-y-1">
//               {studentMenuItems.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton 
//                     asChild 
//                     isActive={isActive(item.url)}
//                     className={`
//                       transition-all duration-200 hover:bg-sidebar-accent group
//                       ${isActive(item.url) 
//                         ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm' 
//                         : 'text-sidebar-foreground hover:text-sidebar-accent-foreground'
//                       }
//                     `}
//                   >
//                     <NavLink to={item.url} className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
//                       <item.icon 
//                         className={`h-5 w-5 ${isActive(item.url) ? item.color : 'text-sidebar-foreground/70'} 
//                           group-hover:scale-110 transition-transform duration-200`} 
//                       />
//                       {state !== "collapsed" && (
//                         <span className="text-sm font-medium">{item.title}</span>
//                       )}
//                     </NavLink>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         {/* Quick Actions Section */}
//         {state !== "collapsed" && (
//           <SidebarGroup className="mt-auto">
//             <SidebarGroupLabel className="text-sidebar-foreground/70 font-semibold text-xs uppercase tracking-wider px-3 py-2">
//               Quick Actions
//             </SidebarGroupLabel>
//             <SidebarGroupContent>
//               <SidebarMenu className="space-y-1">
//                 <SidebarMenuItem>
//                   <SidebarMenuButton className="text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent">
//                     <Settings className="h-4 w-4" />
//                     <span className="text-sm">Settings</span>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//                 <SidebarMenuItem>
//                   <SidebarMenuButton className="text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent">
//                     <HelpCircle className="h-4 w-4" />
//                     <span className="text-sm">Help & Support</span>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//                 <SidebarMenuItem>
//                   <SidebarMenuButton className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10">
//                     <LogOut className="h-4 w-4" />
//                     <span className="text-sm">Sign Out</span>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               </SidebarMenu>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         )}
//       </SidebarContent>
//     </Sidebar>
//   );
// }
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
  LogOut
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

const studentMenuItems = [
  {
    title: "Dashboard",
    url: "/student/dashboard",
    icon: LayoutDashboard,
    color: "text-primary"
  },
  {
    title: "Tests",
    url: "/tests",
    icon: Brain,
    color: "text-secondary"
  },
  {
    title: "My Results",
    url: "/results",
    icon: BarChart3,
    color: "text-accent"
  },
  // {
  //   title: "Learning Path",
  //   url: "/learning",
  //   icon: BookOpen,
  //   color: "text-warning"
  // },
  // {
  //   title: "Career Guidance",
  //   url: "/career",
  //   icon: Target,
  //   color: "text-success"
  // },
  // {
  //   title: "Progress Tracking",
  //   url: "/progress",
  //   icon: TrendingUp,
  //   color: "text-primary"
  // },
  // {
  //   title: "Scholarships",
  //   url: "/scholarships",
  //   icon: Award,
  //   color: "text-secondary"
  // },
  // {
  //   title: "Schedule",
  //   url: "/schedule",
  //   icon: Calendar,
  //   color: "text-accent"
  // },
  // {
  //   title: "Messages",
  //   url: "/messages",
  //   icon: MessageCircle,
  //   color: "text-warning"
  // },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
    color: "text-success"
  }
];

export function StudentSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  return (
    // Set the width to a fixed size and remove collapsible prop.
    // The `state` variable will still exist but won't be used for sizing.
    <Sidebar className="w-64">
      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-bold text-xs uppercase tracking-wider px-3 py-2">
            PathGrad
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {studentMenuItems.map((item) => (
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

        {/* Quick Actions Section */}
        {/* <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-semibold text-xs uppercase tracking-wider px-3 py-2">
            Quick Actions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent">
                  <Settings className="h-4 w-4" />
                  <span className="text-sm">Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent">
                  <HelpCircle className="h-4 w-4" />
                  <span className="text-sm">Help & Support</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10">
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
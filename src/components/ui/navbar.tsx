import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "../../store/useAuthStore";
import {
  Brain,
  User,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-4">
            {isAuthenticated && <SidebarTrigger className="md:hidden" />}
            <Link
              to={
                !isAuthenticated ? '/' :
                  user?.role === 'Admin' || user?.role === 'SuperAdmin' ? '/dashboard' :
                    (user?.role?.toLowerCase().includes('counsel') || user?.role?.toLowerCase() === 'professional') ? '/counselor/dashboard' :
                      (user?.role?.toLowerCase() === 'school' || user?.role?.toLowerCase() === 'organization' || user?.role?.toLowerCase() === 'organizationadmin') ? '/school/dashboard' :
                        '/student/dashboard'
              }
              className="flex items-center gap-2.5 min-w-0 group"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-500/20 border border-white/10 group-hover:scale-105 transition-transform">
                <Brain className="h-4.5 w-4.5 text-white stroke-[2]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline font-black tracking-tight text-[16px] leading-tight">
                  <span className="text-slate-900">Cognify</span>
                  <span className="text-indigo-600 italic ml-0.5">IQ</span>
                </div>
                <span className="text-[7.5px] font-bold tracking-[0.2em] text-slate-400 uppercase whitespace-nowrap">
                  {(user?.role === 'School' || user?.role === 'OrganizationAdmin') ? 'Institution Hub' : 'Student Hub'}
                </span>
              </div>
            </Link>
          </div>

          {/* User Menu - Static Avatar Only (Options moved to Sidebar) */}
          <div className="flex items-center space-x-3">
            {isAuthenticated && (
              <Button variant="ghost" size="icon" className="relative h-8 w-8 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
              </Button>
            )}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 border-2 border-indigo-100 hover:border-indigo-200 transition-all bg-white shadow-sm overflow-hidden group">
                    <Avatar className="h-full w-full">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-indigo-600 text-white text-[10px] font-bold">
                        {user?.firstName?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl border-slate-100 p-2 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-3 p-2 px-3 mb-2 bg-slate-50 rounded-lg">
                    <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                        {user?.firstName?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || "S"}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.name || "School Portal"}
                      </span>
                      <span className="text-[10px] text-slate-500 truncate lowercase">{user?.email}</span>
                    </div>
                  </div>
                  <DropdownMenuItem onClick={() => navigate((user?.role === 'School' || user?.role === 'OrganizationAdmin') ? "/school/profile" : "/profile")} className="rounded-lg gap-2 cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 py-2">
                    <User className="h-4 w-4" />
                    <span className="text-xs font-medium">Profile Settings</span>
                  </DropdownMenuItem>
                  {(user?.role !== 'School' && user?.role !== 'OrganizationAdmin') && (
                    <DropdownMenuItem onClick={() => navigate("/results")} className="rounded-lg gap-2 cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 py-2">
                      <Settings className="h-4 w-4" />
                      <span className="text-xs font-medium">My Performance</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="my-2 bg-slate-100" />
                  <DropdownMenuItem onClick={logout} className="rounded-lg gap-2 cursor-pointer focus:bg-red-50 focus:text-red-600 py-2 text-red-500">
                    <LogOut className="h-4 w-4" />
                    <span className="text-xs font-medium">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (

              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  onClick={(e) => {
                    localStorage.removeItem("testId");
                    localStorage.removeItem("testFlowActive");
                    navigate("/get-started");
                  }}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
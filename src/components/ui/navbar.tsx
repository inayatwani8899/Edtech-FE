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
                  user?.role === 'Admin' ? '/dashboard' :
                    (user?.role?.toLowerCase().includes('counsel') || user?.role?.toLowerCase() === 'professional') ? '/counselor/dashboard' :
                      '/student/dashboard'
              }
              className="flex items-center space-x-2"
            >
              {/* <Brain className="h-6 w-6 text-primary" /> */}
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">

              </span>
            </Link>
          </div>

          {/* User Menu - Static Avatar Only (Options moved to Sidebar) */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative h-8 w-8 rounded-full border-2 border-primary/10 p-0.5">
                <Avatar className="h-full w-full">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                    {user?.firstName?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
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
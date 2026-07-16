import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { StudentSidebar } from "../sidebars/StudentSidebar";
import { useAuthStore } from "../../store/useAuthStore";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../ui/navbar";
import { ChevronRight, Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { usePermissionStore, matchPermission } from "@/store/permissionStore";

const StudentPermissionGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuthStore();
  const permissions = usePermissionStore((s) => s.permissions);
  const loading = usePermissionStore((s) => s.loading);
  const loaded = usePermissionStore((s) => s.loaded);
  const fetchMenus = usePermissionStore((s) => s.fetchMenus);

  useEffect(() => {
    const roleId = user?.roleId || localStorage.getItem("roleId");
    if (roleId && !loaded) {
      fetchMenus(roleId);
    }
  }, [fetchMenus, user?.roleId, loaded]);

  // Bypass checking for base student dashboard/profile/settings route
  if (
    location.pathname === "/student/dashboard" ||
    location.pathname === "/profile" ||
    location.pathname === "/settings"
  ) {
    return <>{children}</>;
  }

  // SuperAdmin bypass
  if (user?.role === "SuperAdmin") {
    return <>{children}</>;
  }

  if (loading && !loaded) {
    return (
      <div className="flex flex-col items-center justify-center py-20 w-full">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-2" />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Verifying Student Permissions...</span>
      </div>
    );
  }

  const match = matchPermission(location.pathname, permissions);

  if (loaded && (!match || !match.canView)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export const StudentLayout = () => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user || (user.role !== "Student" && user.role !== "SuperAdmin")) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50 dark:bg-[#0b0d11]">
        <StudentSidebar />
        
        <VisibleSidebarRail />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header - Mobile Only */}
          <div className="md:hidden">
            <Navbar />
          </div>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-4 md:p-8">
            <StudentPermissionGuard>
              <Outlet />
            </StudentPermissionGuard>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

function VisibleSidebarRail() {
  try {
    const { state, toggleSidebar, isMobile } = useSidebar();

    if (isMobile || state !== "collapsed") return null;

    return (
      <button
        onClick={() => toggleSidebar()}
        aria-label="Open sidebar"
        title="Open sidebar"
        className="fixed left-1 top-1/2 z-50 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-r-xl bg-white border border-slate-200 shadow-xl hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 transition-all duration-200"
      >
        <ChevronRight className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
      </button>
    );
  } catch {
    return null;
  }
}

import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { StudentSidebar } from "../sidebars/StudentSidebar";
import { useAuthStore } from "../../store/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";
import { Navbar } from "../ui/navbar";
import { ChevronRight } from "lucide-react";

export const StudentLayout = () => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user || user.role !== "Student") {
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
            <Outlet /> {/* 👈 This renders the nested route content */}
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

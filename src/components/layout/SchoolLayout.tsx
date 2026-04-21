import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { SchoolSidebar } from "../sidebars/SchoolSidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";

export const SchoolLayout = () => {
    const { user, isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium animate-pulse">Loading School Portal...</p>
                </div>
            </div>
        );
    }

    const isSchool = user?.roleId === 4 || 
                     user?.roleId === 3 ||
                     user?.role?.toLowerCase() === "school" || 
                     user?.role?.toLowerCase() === "organization";

    if (!isAuthenticated || !isSchool) {
        return <Navigate to="/login" replace />;
    }

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-slate-50 dark:bg-[#0b0d11]">
                <SchoolSidebar />
                
                <VisibleSidebarRail />

                <div className="flex-1 flex flex-col">
                    <main className="flex-1 overflow-auto p-4 md:p-8">
                        <Outlet />
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
                <ChevronRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </button>
        );
    } catch {
        return null;
    }
}

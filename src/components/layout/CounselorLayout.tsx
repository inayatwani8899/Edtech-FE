import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { CounselorSidebar } from "@/components/sidebars/CounselorSidebar";
import { Navbar } from "../ui/navbar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";

export const CounselorLayout = () => {
    const { user, isAuthenticated, isLoading } = useAuthStore();

    // 1. Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-emerald-700 font-medium animate-pulse text-lg">Loading Professional Panel...</p>
                </div>
            </div>
        );
    }

    // 2. Auth + Role check
    const isCounselor = user?.roleId === 2 ||
        user?.role?.toLowerCase() === "counselor" ||
        user?.role?.toLowerCase() === "counsellor" ||
        user?.role?.toLowerCase() === "professional";

    if (!isAuthenticated || !isCounselor) {
        return <Navigate to="/login" replace />;
    }

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-slate-50/50">
                {/* Sidebar */}
                <CounselorSidebar />

                {/* Visible rail button: appears when sidebar is collapsed and toggles it open */}
                <VisibleSidebarRail />

                {/* Content area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Navbar */}
                    <Navbar />

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
                        <div className="max-w-[1600px] mx-auto">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
};

// Small component rendered inside the provider so it can access sidebar context.
function VisibleSidebarRail() {
    try {
        const { state, toggleSidebar, isMobile } = useSidebar();

        if (isMobile || state !== "collapsed") return null;

        return (
            <button
                onClick={() => toggleSidebar()}
                aria-label="Open sidebar"
                title="Open sidebar"
                className="fixed left-1 top-1/2 z-50 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-r-xl bg-white border border-slate-200 shadow-lg hover:bg-emerald-50 hover:border-emerald-200 transition-all group"
            >
                <ChevronRight className="h-5 w-5 text-emerald-600 transition-transform group-hover:translate-x-0.5" />
            </button>
        );
    } catch {
        return null;
    }
}

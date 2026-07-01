import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { SchoolSidebar } from "../sidebars/SchoolSidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { ChevronRight, Menu, Brain } from "lucide-react";
import Swal from "sweetalert2";

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
                     user?.role?.toLowerCase() === "organization" ||
                     user?.role?.toLowerCase() === "organizationadmin";

    if (!isAuthenticated || !isSchool) {
        return <Navigate to="/login" replace />;
    }

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-slate-50 dark:bg-[#0b0d11]">
                <SchoolSidebar />
                
                <VisibleSidebarRail />

                <div className="flex-1 flex flex-col min-w-0">
                    {/* Mobile Header */}
                    <MobileHeader />

                    <main className="flex-1 overflow-auto p-4 md:p-8">
                        <Outlet />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
};

// Responsive Mobile Header component for School module
function MobileHeader() {
    try {
        const { setOpenMobile, isMobile } = useSidebar();
        const { logout } = useAuthStore();
        const navigate = useNavigate();

        if (!isMobile) return null;

        return (
            <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-800 dark:bg-[#0b0d11]/95 shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setOpenMobile(true)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-850 dark:bg-slate-900/50 dark:hover:bg-slate-800/80 transition-colors shadow-sm"
                        aria-label="Open navigation menu"
                    >
                        <Menu className="h-4.5 w-4.5 text-slate-700 dark:text-slate-200" />
                    </button>
                    
                    <div className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-blue-500" />
                        <span className="font-black text-slate-900 dark:text-white text-base">
                            Cognify<span className="text-blue-500 italic">IQ</span>
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => {
                        Swal.fire({
                            title: 'Sign Out?',
                            text: 'Are you sure you want to end your administrative session?',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3b82f6',
                            cancelButtonColor: '#94a3b8',
                            confirmButtonText: 'Yes, sign out',
                            cancelButtonText: 'Cancel'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                const redirectUrl = logout();
                                navigate(redirectUrl);
                            }
                        });
                    }}
                    className="text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-red-500 transition-colors"
                >
                    Sign Out
                </button>
            </header>
        );
    } catch {
        return null;
    }
}

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

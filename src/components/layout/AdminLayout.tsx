// import { Outlet, Navigate } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContext";
// import { AdminSidebar } from "../sidebars/AdminSidebar"; // Import the Admin-specific sidebar
// import { Navbar } from "../ui/navbar";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

// export const AdminLayout = () => {
//   const { user, isAuthenticated, isLoading } = useAuth();

//   // 1. Loading Check
//   if (isLoading) {
//     return <div className="min-h-screen flex items-center justify-center">Loading Admin Panel...</div>;
//   }

//   // 2. Authentication and Role Check
//   // Redirects if not logged in OR if the user is not an 'admin'
//   if (!isAuthenticated || user?.role !== 'admin') {
//     // Note: You could redirect unauthorized users to their own dashboard or a 403 page
//     return <Navigate to="/login" replace />;
//   }

//   return (
//     <SidebarProvider>
//       <div className="min-h-screen flex w-full">

//         {/* Admin Sidebar - Always visible on desktop */}
//         <AdminSidebar />

//         <div className="flex-1 flex flex-col">

//           {/* Header/Navbar Area
//           <header className="h-14 flex items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
//             <div className="flex items-center gap-4">
//             //   {/* Mobile Sidebar Trigger */}
//               {/* <SidebarTrigger className="md:hidden" />  */}
//               {/* <h1 className="text-lg font-bold text-primary">
//                 Administrator Panel 🛡️
//               </h1> */}
//             {/* </div> */}

//             {/* The existing Navbar component can handle the User Menu/Dropdown */}

//           {/* </header> */} 
//   <Navbar /> 
//           {/* Main Content Area */}
//           <main className="flex-1 overflow-auto bg-muted/20 p-4 md:p-6">
//             <Outlet />
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// };
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore"; // ✅ using zustand
import { AdminSidebar } from "../sidebars/AdminSidebar";
import { Navbar } from "../ui/navbar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { ChevronRight, Menu, Brain } from "lucide-react";
import Swal from "sweetalert2";

export const AdminLayout = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  // 1. Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Super Admin Panel...
      </div>
    );
  }

  // 2. Auth + Role check
  if (!isAuthenticated || (user?.role !== "Admin" && user?.role !== "SuperAdmin")) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Visible rail button: appears when sidebar is collapsed and toggles it open */}
        <VisibleSidebarRail />

        {/* Content area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          <MobileHeader />

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-muted/20 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

// Responsive Mobile Header component
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
            <Brain className="h-5 w-5 text-indigo-500" />
            <span className="font-black text-slate-900 dark:text-white text-base">
              Cognify<span className="text-blue-500 italic">IQ</span>
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            Swal.fire({
              title: 'Sign Out?',
              text: 'Are you sure you want to end your session?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#4f46e5',
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
        className="fixed left-1 top-1/2 z-50 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-r-md bg-white border border-slate-200 shadow-md hover:bg-white/95 dark:bg-slate-800 dark:border-slate-700"
      >
        <ChevronRight className="h-5 w-5 text-slate-700 dark:text-slate-100" />
      </button>
    );
  } catch {
    return null;
  }
}

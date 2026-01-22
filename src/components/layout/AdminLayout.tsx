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
import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore"; // ✅ using zustand
import { AdminSidebar } from "../sidebars/AdminSidebar";
import { Navbar } from "../ui/navbar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";

export const AdminLayout = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  // 1. Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Admin Panel...
      </div>
    );
  }

  // 2. Auth + Role check
  if (!isAuthenticated || user?.role !== "Admin") {
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
        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <Navbar />

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-muted/20 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

// Small component rendered inside the provider so it can access sidebar context.
function VisibleSidebarRail() {
  try {
    const { state, toggleSidebar } = useSidebar();

    if (state !== "collapsed") return null;

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

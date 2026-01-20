// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { StudentSidebar } from "../sidebars/StudentSidebar";
// import { useAuth } from "@/contexts/AuthContext";
// import { Navigate } from "react-router-dom";
// import { Navbar } from "../ui/navbar";

// interface StudentLayoutProps {
//     children: React.ReactNode;
// }

// export const StudentLayout = ({ children }: StudentLayoutProps) => {
//     const { user, isAuthenticated } = useAuth();

//     if (!isAuthenticated || !user || user.role !== 'student') {
//         return <Navigate to="/login" replace />;
//     }

//     return (
//         <SidebarProvider>
//             <div className="min-h-screen flex w-full">
//                 <StudentSidebar />
//                 <div className="flex-1 flex flex-col">
//                     {/* Header */}
//                     {/* <header className="h-14 flex items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4"> */}
//                         {/* <div className="flex items-center gap-4">
//               <SidebarTrigger />
//               <h1 className="text-lg font-semibold text-foreground">
//                 Student Dashboard
//               </h1>
//             </div>

//             <div className="flex items-center gap-3">
//               <span className="text-sm text-muted-foreground">
//                 Welcome, {user.firstName}
//               </span>
//               <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
//                 <span className="text-sm font-medium text-primary">
//                   {user.firstName?.charAt(0)?.toUpperCase()}
//                 </span>
//               </div>
//             </div> */}
//                         <Navbar />
//                     {/* </header> */}

//                     {/* Main Content */}
//                     <main className="flex-1 overflow-auto">
//                         {children}
//                     </main>
//                 </div>
//             </div>
//         </SidebarProvider>
//     );
// };
import { SidebarProvider } from "@/components/ui/sidebar";
import { StudentSidebar } from "../sidebars/StudentSidebar";
import { useAuthStore } from "../../store/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";
import { Navbar } from "../ui/navbar";

export const StudentLayout = () => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user || user.role !== "Student") {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <StudentSidebar />
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Navbar />

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <Outlet /> {/* 👈 This renders the nested route content */}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

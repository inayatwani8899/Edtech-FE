
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
          {/* <Navbar /> */}

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <Outlet /> {/* 👈 This renders the nested route content */}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

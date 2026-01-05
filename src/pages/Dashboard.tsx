// import { useAuth } from "@/contexts/AuthContext";
// import { StudentDashboard } from "./dashboards/StudentDashboard";
// import { AdminDashboard } from "./dashboards/AdminDashboard";
// import { CounselorDashboard } from "./dashboards/CounselorDashboard";
// import { ProfessionalDashboard } from "./dashboards/ProfessionalDashboard";
// import { StudentLayout } from "@/components/layout/StudentLayout";
// import { AdminLayout } from "@/components/layout/AdminLayout";

// export const Dashboard = () => {
//   const { user } = useAuth();

//   // if (!user) {
//     return <div>Loading...</div>;
//   }
// debugger
//   // Render different dashboards based on user role
//   switch (user.role) {
//     case 'student':
//       return <StudentLayout />;
//     case 'admin':
//       return <AdminLayout />;
//     case 'counselor':
//       return <CounselorDashboard />;
//     case 'professional':
//       return <ProfessionalDashboard />;
//     default:
//       return <StudentLayout />;
//   }
// };
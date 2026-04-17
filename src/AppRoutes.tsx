import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Landing } from "@/pages/Landing";
import { Login } from "@/pages/auth/Login";
// import { Dashboard } from "@/pages/Dashboard";
import { ManageTests } from "./pages/admin/tests/Tests";
import { Profile } from "@/pages/Profile";
import { Settings } from "@/pages/Settings";
import { Results } from "@/pages/student/Results";
import { Manage } from "@/pages/Manage";
import { TestDetail } from "@/pages/student/TestDetail";
import NotFound from "./pages/NotFound";
import RoleSelection from "./pages/auth/RoleSelection";
import StudentRegister from "./pages/auth/register/StudentRegister";
import CounsellorRegister from "./pages/auth/register/CounsellorRegister";
import SchoolRegister from "./pages/auth/register/SchoolRegister";
import { StudentLayout } from "./components/layout/StudentLayout";
import { StudentDashboard } from "./pages/student/StudentDashboard";
import { AdminLayout } from "./components/layout/AdminLayout";
import { AdminDashboard } from "./pages/dashboards/AdminDashboard";
import { CounselorLayout } from "./components/layout/CounselorLayout";
import { CounselorDashboard } from "./pages/dashboards/CounselorDashboard";
import { Tests } from "./pages/student/Tests";
import Students from "./pages/admin/students/Students";
import StudentForm from "./pages/admin/students/StudentForm";
import StudentView from "./pages/admin/students/StudentView";
import CreateTestPage from "./pages/admin/CreateTest";
import { useAuthStore } from "./store/useAuthStore";
import Users from "./pages/admin/users/Users";
import UserForm from "./pages/admin/users/UserForm";
import { ConfigurableTestForm } from "./pages/admin/tests/ConfigurableTestForm";
import { AIQuestionGeneration } from "./pages/admin/tests/AIQuestionGeneration";
import { Loader2 } from "lucide-react";
import Counselors from "./pages/admin/counselors/Counselors";
import ActiveCounselors from "./pages/public/ActiveCounselors";
import CounselorForm from "./pages/admin/counselors/CounselorForm";
import StudentProfile from "./pages/student/StudentProfile";
import { TestConfigurationsList } from "./pages/admin/test-configuration/TestConfigurationsList";
import { TestConfigurationForm } from "./pages/admin/test-configuration/TestConfigurationForm";
import { CategoryForm } from "./pages/admin/categories/CategoryForm";
import { CategoriesList } from "./pages/admin/categories/CategoriesList";
import { LearningPath } from "./pages/student/LearningPath";
import { CareerGuidance } from "./pages/student/CareerGuidance";
import { ProgressTracking } from "./pages/student/ProgressTracking";
import { Scholarships } from "./pages/student/Scholarships";
import { Schedule } from "./pages/student/Schedule";
import { Messages } from "./pages/student/Messages";
import { PublicLayout } from "./components/layout/PublicLayout";
import PublicAbout from "./pages/public/PublicAbout";
import PublicPricing from "./pages/public/PublicPricing";
import PublicAssessments from "./pages/public/PublicAssessments";
import PublicPrivacy from "./pages/public/PublicPrivacy";
import PublicTerms from "./pages/public/PublicTerms";

// 🔐 RBAC Module Pages
import RBACDashboard from "./modules/rbac/pages/RBACDashboard";
import RolesList from "./modules/rbac/pages/RolesList";
import RoleForm from "./modules/rbac/pages/RoleForm";
import RoleDetail from "./modules/rbac/pages/RoleDetail";
import PermissionsList from "./modules/rbac/pages/PermissionsList";
import PermissionForm from "./modules/rbac/pages/PermissionForm";
import RBACUsersList from "./modules/rbac/pages/RBACUsersList";
import RBACUserForm from "./modules/rbac/pages/RBACUserForm";
import RBACUserDetail from "./modules/rbac/pages/RBACUserDetail";
import RolePermissionMapping from "./modules/rbac/pages/RolePermissionMapping";
import UserPermissionMapping from "./modules/rbac/pages/UserPermissionMapping";

// 🔒 Protected Route
interface ProtectedRouteProps {
    children: React.ReactNode;
    role?: "Admin" | "Student" | "School" | "Counselor" | "Professional";
}

const isCounselorRole = (user: any) => {
    if (!user) return false;
    const roleId = Number(user.roleId);
    if (roleId === 2) return true;
    const roleName = (user.role || "").toLowerCase();
    return roleName.includes("counselor") || roleName.includes("counsellor") || roleName === "professional";
};

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
    const { user, isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (role && (
        (role === "Student" && user?.role !== "Student") ||
        (role === "Admin" && user?.role !== "Admin") ||
        (role === "School" && user?.role !== "School") ||
        (role === "Counselor" && !isCounselorRole(user))
    )) {
        let redirectPath = "/student/dashboard";
        if (user?.role === "Admin") redirectPath = "/dashboard";
        else if (isCounselorRole(user)) redirectPath = "/counselor/dashboard";

        return (
            <Navigate
                to={redirectPath}
                replace
            />
        );
    }

    return <>{children}</>;
};

//Public Route
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
                <span className="text-lg">Logging In...</span>
            </div>
        );
    }

    if (isAuthenticated) {
        let redirectPath = "/student/dashboard";
        if (user?.role === "Admin") redirectPath = "/dashboard";
        else if (isCounselorRole(user)) redirectPath = "/counselor/dashboard";

        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/get-started" element={<PublicRoute><RoleSelection /></PublicRoute>} />
            <Route path="/register/student" element={<StudentRegister />} />
            <Route path="/register/counsellor" element={<CounsellorRegister />} />
            <Route path="/register/school" element={<SchoolRegister />} />

            {/* Public Themed Layout for subpages */}
            <Route element={<PublicLayout />}>
                <Route path="/about" element={<PublicAbout />} />
                <Route path="/pricing" element={<PublicPricing />} />
                <Route path="/assessments" element={<PublicAssessments />} />
                <Route path="/counselors" element={<ActiveCounselors />} />
                <Route path="/privacy" element={<PublicPrivacy />} />
                <Route path="/terms" element={<PublicTerms />} />
            </Route>


            {/* Admin Routes */}
            <Route
                element={
                    <ProtectedRoute role="Admin">
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/dashboard" element={<AdminDashboard />} />

                {/* 🔐 Access Control Mapping (Prioritized) */}
                <Route path="/rbac/role-permissions" element={<RolePermissionMapping />} />
                <Route path="/rbac/user-permissions" element={<UserPermissionMapping />} />

                <Route path="/manage/users" element={<Users />} />
                <Route path="/counselors/add" element={<CounselorForm />} />
                <Route path="/counselors/edit/:id" element={<CounselorForm />} />
                <Route path="/manage/counselors" element={<Counselors />} />
                <Route path="/manage/tests" element={<ManageTests />} />
                <Route path="/manage/students" element={<Students />} />
                <Route path="/students/add" element={<StudentForm />} />
                <Route path="/students/edit/:id" element={<StudentForm />} />
                <Route path="/students/view/:id" element={<StudentView />} />
                <Route path="/ai-generation" element={<AIQuestionGeneration />} />
                <Route path="/create-test" element={<ConfigurableTestForm />} />
                <Route path="/edit-test/:id" element={<ConfigurableTestForm />} />
                <Route path="/users/add" element={<UserForm />} />
                <Route path="/users/edit/:id" element={<UserForm />} />
                <Route path="/manage/categories" element={<CategoriesList />} />
                <Route path="/manage/categories/add" element={<CategoryForm />} />
                <Route path="/manage/categories/edit/:id" element={<CategoryForm />} />
                <Route path="/manage/configurations" element={<TestConfigurationsList />} />
                <Route path="/manage/configurations/add" element={<TestConfigurationForm />} />
                <Route path="/manage/configurations/edit/:id" element={<TestConfigurationForm />} />

                {/* 🔐 Role-Based Access Control (RBAC) Routes */}
                <Route path="/rbac" element={<RBACDashboard />} />

                {/* Role Management */}
                <Route path="/rbac/roles" element={<RolesList />} />
                <Route path="/rbac/roles/add" element={<RoleForm />} />
                <Route path="/rbac/roles/edit/:id" element={<RoleForm />} />
                <Route path="/rbac/roles/view/:id" element={<RoleDetail />} />

                {/* Permission Management */}
                <Route path="/rbac/permissions" element={<PermissionsList />} />
                <Route path="/rbac/permissions/add" element={<PermissionForm />} />
                <Route path="/rbac/permissions/edit/:id" element={<PermissionForm />} />

                {/* RBAC User Management */}
                <Route path="/rbac/users" element={<RBACUsersList />} />
                <Route path="/rbac/users/add" element={<RBACUserForm />} />
                <Route path="/rbac/users/edit/:id" element={<RBACUserForm />} />
                <Route path="/rbac/users/view/:id" element={<RBACUserDetail />} />

            </Route>

            {/* Student Routes */}
            <Route
                element={
                    <ProtectedRoute role="Student">
                        <StudentLayout />
                    </ProtectedRoute>
                }
            >

                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/tests" element={<Tests />} />
                <Route path="/results" element={<Results />} />
                <Route path="/learning" element={<LearningPath />} />
                <Route path="/career" element={<CareerGuidance />} />
                <Route path="/progress" element={<ProgressTracking />} />
                <Route path="/scholarships" element={<Scholarships />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/profile" element={<StudentProfile />} />
                <Route path="/settings" element={<Settings />} />
                {/* <Route path="/manage" element={<Manage />} /> */}
            </Route>
            <Route path="/test/:id" element={<TestDetail />} />

            {/* Counselor Routes */}
            <Route
                element={
                    <ProtectedRoute role="Counselor">
                        <CounselorLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/counselor/dashboard" element={<CounselorDashboard />} />
                <Route path="/counselor/students" element={<div className="p-4">My Students Page (Coming Soon)</div>} />
                <Route path="/counselor/appointments" element={<div className="p-4">Appointments Calendar (Coming Soon)</div>} />
                <Route path="/counselor/assessments" element={<div className="p-4">Student Assessments (Coming Soon)</div>} />
                <Route path="/counselor/messages" element={<div className="p-4">Message Center (Coming Soon)</div>} />
                <Route path="/counselor/reports" element={<div className="p-4">Reports Generator (Coming Soon)</div>} />
                <Route path="/counselor/resources" element={<div className="p-4">Counseling Resources (Coming Soon)</div>} />
                <Route path="/counselor/search" element={<div className="p-4">Search Students (Coming Soon)</div>} />
            </Route>

            {/* Global Catch-all 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;

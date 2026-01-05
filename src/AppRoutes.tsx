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
// 🔒 Protected Route
interface ProtectedRouteProps {
    children: React.ReactNode;
    role?: "Admin" | "Student" | "School" | "Counselor";
}

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

    if (role && user?.role !== role) {
        return (
            <Navigate
                to={user?.role === "Admin" ? "/dashboard" : "/student/dashboard"}
                replace
            />
        );
    }

    return <>{children}</>;
};

//Public Route
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
                <span className="text-lg">Logging In...</span>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<Layout />}>
                <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register/student" element={<StudentRegister />} />
                <Route path="/register/counsellor" element={<CounsellorRegister />} />
                <Route path="/register/school" element={<SchoolRegister />} />
                <Route path="/get-started" element={<PublicRoute><RoleSelection /></PublicRoute>} />
                <Route path="*" element={<NotFound />} />
                <Route path="counselors" element={<ActiveCounselors />} />
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
                <Route path="*" element={<NotFound />} />
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
                <Route path="/test/:id" element={<TestDetail />} />
                <Route path="/results" element={<Results />} />
                <Route path="/profile" element={<StudentProfile />} />
                <Route path="/settings" element={<Settings />} />
                {/* <Route path="/manage" element={<Manage />} /> */}
                <Route path="*" element={<NotFound />} />
            </Route>

            {/* Catch-all 404 */}

        </Routes>
    );
};

export default AppRoutes;

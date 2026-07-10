import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Landing } from "@/pages/Landing";
import { Login } from "@/pages/auth/Login";
import { StudentLayout } from "./components/layout/StudentLayout";
import { AdminLayout } from "./components/layout/AdminLayout";
import { CounselorLayout } from "./components/layout/CounselorLayout";
import { SchoolLayout } from "./components/layout/SchoolLayout";
import { PublicLayout } from "./components/layout/PublicLayout";
import { useAuthStore } from "./store/useAuthStore";
import { Loader2 } from "lucide-react";
import { lazy, Suspense } from "react";

// Lazy imports for pages
const ManageTests = lazy(() => import("./pages/admin/tests/Tests").then(m => ({ default: m.ManageTests })));
const Profile = lazy(() => import("@/pages/Profile").then(m => ({ default: m.Profile })));
const Settings = lazy(() => import("@/pages/Settings").then(m => ({ default: m.Settings })));
const Results = lazy(() => import("@/pages/student/Results").then(m => ({ default: m.Results })));
const Manage = lazy(() => import("@/pages/Manage").then(m => ({ default: m.Manage })));
const TestDetail = lazy(() => import("@/pages/student/TestDetail").then(m => ({ default: m.TestDetail })));
const NotFound = lazy(() => import("./pages/NotFound"));
const RoleSelection = lazy(() => import("./pages/auth/RoleSelection"));
const StudentRegister = lazy(() => import("./pages/auth/register/StudentRegister"));
const CounsellorRegister = lazy(() => import("./pages/auth/register/CounsellorRegister"));
const SchoolRegister = lazy(() => import("./pages/auth/register/SchoolRegister"));
const StudentDashboard = lazy(() => import("./pages/student/StudentDashboard").then(m => ({ default: m.StudentDashboard })));
const AdminDashboard = lazy(() => import("./pages/dashboards/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const CounselorDashboard = lazy(() => import("./pages/dashboards/CounselorDashboard").then(m => ({ default: m.CounselorDashboard })));
const Tests = lazy(() => import("./pages/student/Tests").then(m => ({ default: m.Tests })));
const Students = lazy(() => import("./pages/admin/students/Students"));
const StudentForm = lazy(() => import("./pages/admin/students/StudentForm"));
const StudentView = lazy(() => import("./pages/admin/students/StudentView"));
const SchoolDashboard = lazy(() => import("./pages/dashboards/SchoolDashboard").then(m => ({ default: m.SchoolDashboard })));
const SchoolStudents = lazy(() => import("./pages/school/SchoolStudents").then(m => ({ default: m.SchoolStudents })));
const SchoolStaff = lazy(() => import("./pages/school/SchoolStaff").then(m => ({ default: m.SchoolStaff })));
const SchoolProfile = lazy(() => import("./pages/school/SchoolProfile").then(m => ({ default: m.SchoolProfile })));
const SchoolSettings = lazy(() => import("./pages/school/SchoolSettings").then(m => ({ default: m.SchoolSettings })));
const CreateTestPage = lazy(() => import("./pages/admin/CreateTest"));
const Users = lazy(() => import("./pages/admin/users/Users"));
const UserForm = lazy(() => import("./pages/admin/users/UserForm"));
const ConfigurableTestForm = lazy(() => import("./pages/admin/tests/ConfigurableTestForm").then(m => ({ default: m.ConfigurableTestForm })));
const AIQuestionGeneration = lazy(() => import("./pages/admin/tests/AIQuestionGeneration").then(m => ({ default: m.AIQuestionGeneration })));
const Counselors = lazy(() => import("./pages/admin/counselors/Counselors"));
const ActiveCounselors = lazy(() => import("./pages/public/ActiveCounselors"));
const CounselorForm = lazy(() => import("./pages/admin/counselors/CounselorForm"));
const StudentProfile = lazy(() => import("./pages/student/StudentProfile"));
const Organizations = lazy(() => import("./pages/admin/organizations/Organizations"));
const OrganizationForm = lazy(() => import("./pages/admin/organizations/OrganizationForm"));
const OrganizationView = lazy(() => import("./pages/admin/organizations/OrganizationView"));
const TestConfigurationsList = lazy(() => import("./pages/admin/test-configuration/TestConfigurationsList").then(m => ({ default: m.TestConfigurationsList })));
const TestConfigurationForm = lazy(() => import("./pages/admin/test-configuration/TestConfigurationForm").then(m => ({ default: m.TestConfigurationForm })));
const CategoryForm = lazy(() => import("./pages/admin/categories/CategoryForm").then(m => ({ default: m.CategoryForm })));
const CategoriesList = lazy(() => import("./pages/admin/categories/CategoriesList").then(m => ({ default: m.CategoriesList })));
const LearningPath = lazy(() => import("./pages/student/LearningPath").then(m => ({ default: m.LearningPath })));
const CareerGuidance = lazy(() => import("./pages/student/CareerGuidance").then(m => ({ default: m.CareerGuidance })));
const ProgressTracking = lazy(() => import("./pages/student/ProgressTracking").then(m => ({ default: m.ProgressTracking })));
const Scholarships = lazy(() => import("./pages/student/Scholarships").then(m => ({ default: m.Scholarships })));
const Schedule = lazy(() => import("./pages/student/Schedule").then(m => ({ default: m.Schedule })));
const Messages = lazy(() => import("./pages/student/Messages").then(m => ({ default: m.Messages })));
const PublicAbout = lazy(() => import("./pages/public/PublicAbout"));
const PublicPricing = lazy(() => import("./pages/public/PublicPricing"));
const PublicAssessments = lazy(() => import("./pages/public/PublicAssessments"));
const PublicPrivacy = lazy(() => import("./pages/public/PublicPrivacy"));
const PublicTerms = lazy(() => import("./pages/public/PublicTerms"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword").then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword").then(m => ({ default: m.ResetPassword })));
const GradesList = lazy(() => import("./pages/admin/grades/GradesList").then(m => ({ default: m.GradesList })));
const GradeForm = lazy(() => import("./pages/admin/grades/GradeForm").then(m => ({ default: m.GradeForm })));
const QuestionBankList = lazy(() => import("./pages/admin/question-bank/QuestionBankList").then(m => ({ default: m.QuestionBankList })));
const QuestionsList = lazy(() => import("./pages/admin/questions/QuestionsList").then(m => ({ default: m.QuestionsList })));
const QuestionForm = lazy(() => import("./pages/admin/questions/QuestionForm").then(m => ({ default: m.QuestionForm })));

// 🔐 RBAC Module Pages
const RBACDashboard = lazy(() => import("./modules/rbac/pages/RBACDashboard"));
const RolesList = lazy(() => import("./modules/rbac/pages/RolesList"));
const RoleForm = lazy(() => import("./modules/rbac/pages/RoleForm"));
const RoleDetail = lazy(() => import("./modules/rbac/pages/RoleDetail"));
const PermissionsList = lazy(() => import("./modules/rbac/pages/PermissionsList"));
const PermissionForm = lazy(() => import("./modules/rbac/pages/PermissionForm"));
const RBACUsersList = lazy(() => import("./modules/rbac/pages/RBACUsersList"));
const RBACUserForm = lazy(() => import("./modules/rbac/pages/RBACUserForm"));
const RBACUserDetail = lazy(() => import("./modules/rbac/pages/RBACUserDetail"));
const RolePermissionMapping = lazy(() => import("./modules/rbac/pages/RolePermissionMapping"));
const UserPermissionMapping = lazy(() => import("./modules/rbac/pages/UserPermissionMapping"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const OrganizationPermissionMapping = lazy(() => import("./modules/rbac/pages/OrganizationPermissionMapping"));


// 🔒 Protected Route
interface ProtectedRouteProps {
    children: React.ReactNode;
    role?: "Admin" | "Student" | "School" | "Counselor" | "Professional";
}

const isCounselorRole = (user: { role?: string } | null | undefined) => {
    if (!user) return false;
    const roleName = (user.role || "").toLowerCase();
    return roleName.includes("counselor") || roleName.includes("counsellor") || roleName === "professional";
};

const isSchoolRole = (user: { role?: string } | null | undefined) => {
    if (!user) return false;
    const roleName = (user.role || "").toLowerCase();
    return roleName === "school" || roleName === "organization" || roleName === "organizationadmin";
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
        const logoutRedirect = localStorage.getItem("logoutRedirectUrl");
        if (logoutRedirect) {
            localStorage.removeItem("logoutRedirectUrl");
            return <Navigate to={logoutRedirect} replace />;
        }
        return <Navigate to="/login" replace />;
    }

    if (role && (
        (role === "Student" && user?.role !== "Student" && user?.role !== "SuperAdmin") ||
        (role === "Admin" && user?.role !== "Admin" && user?.role !== "SuperAdmin") ||
        (role === "School" && !isSchoolRole(user) && user?.role !== "SuperAdmin") ||
        (role === "Counselor" && !isCounselorRole(user) && user?.role !== "SuperAdmin")
    )) {
        let redirectPath = "/student/dashboard";
        if (user?.role === "Admin" || (user?.role as string) === "SuperAdmin") redirectPath = "/dashboard";
        else if (isSchoolRole(user)) redirectPath = "/school/dashboard";
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
    const { tenantName } = useParams<{ tenantName?: string }>();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
                <span className="text-lg">Logging In...</span>
            </div>
        );
    }

    if (isAuthenticated) {
        const storedTenant = localStorage.getItem("tenantName");
        const isCorrectTenant = storedTenant && storedTenant === tenantName;
        const isSuperAdmin = user?.role === "Admin" || user?.role === "SuperAdmin";

        if (!tenantName || (isCorrectTenant && !isSuperAdmin)) {
            let redirectPath = "/student/dashboard";
            if (user?.role === "Admin" || user?.role === "SuperAdmin") redirectPath = "/dashboard";
            else if (isSchoolRole(user)) redirectPath = "/school/dashboard";
            else if (isCounselorRole(user)) redirectPath = "/counselor/dashboard";

            return <Navigate to={redirectPath} replace />;
        }
    }

    return <>{children}</>;
};

const RouteLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0c10]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
);

const AppRoutes = () => {
    return (
        <Suspense fallback={<RouteLoader />}>
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/login/:tenantName" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/get-started" element={<PublicRoute><RoleSelection /></PublicRoute>} />
            <Route path="/register/student" element={<StudentRegister />} />
            <Route path="/register/counsellor" element={<CounsellorRegister />} />
            <Route path="/register/school" element={<SchoolRegister />} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
            <Route path="/unauthorized" element={<Unauthorized />} />


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
                <Route path="/rbac/organization-permissions" element={<OrganizationPermissionMapping />} />

                <Route path="/manage/users" element={<Users />} />
                <Route path="/counselors/add" element={<CounselorForm />} />
                <Route path="/counselors/edit/:id" element={<CounselorForm />} />
                <Route path="/manage/counselors" element={<Counselors />} />
                <Route path="/manage/tests" element={<ManageTests />} />
                <Route path="/manage/students" element={<Students />} />
                <Route path="/manage/organizations" element={<Organizations />} />
                <Route path="/organizations/add" element={<OrganizationForm />} />
                <Route path="/organizations/edit/:id" element={<OrganizationForm />} />
                <Route path="/organizations/view/:id" element={<OrganizationView />} />
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
                <Route path="/manage/categories/view/:id" element={<CategoryForm />} />
                <Route path="/manage/configurations" element={<TestConfigurationsList />} />
                <Route path="/manage/configurations/add" element={<TestConfigurationForm />} />
                <Route path="/manage/configurations/edit/:id" element={<TestConfigurationForm />} />
                <Route path="/manage/grades" element={<GradesList />} />
                <Route path="/manage/grades/add" element={<GradeForm />} />
                <Route path="/manage/grades/edit/:id" element={<GradeForm />} />
                <Route path="/manage/grades/view/:id" element={<GradeForm />} />
                <Route path="/manage/question-bank" element={<QuestionBankList />} />
                <Route path="/manage/questions" element={<QuestionsList />} />
                <Route path="/manage/questions/add" element={<QuestionForm />} />
                <Route path="/manage/questions/edit/:id" element={<QuestionForm />} />
                <Route path="/manage/questions/view/:id" element={<QuestionForm />} />

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

            {/* Counselor Routes (Temporarily commented out)
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
            */}

            {/* School/Organization Routes */}
            <Route
                element={
                    <ProtectedRoute role="School">
                        <SchoolLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/school/dashboard" element={<SchoolDashboard />} />
                <Route path="/organization/dashboard" element={<SchoolDashboard />} />
                <Route path="/school/role-permissions" element={<RolePermissionMapping />} />
                <Route path="/school/students" element={<SchoolStudents />} />
                <Route path="/school/students/add" element={<StudentForm />} />
                <Route path="/school/students/edit/:id" element={<StudentForm />} />
                <Route path="/school/students/view/:id" element={<StudentView />} />
                <Route path="/school/staff" element={<SchoolStaff />} />
                {/* <Route path="/school/calendar" element={<div className="p-8"><h2 className="text-2xl font-bold">Academic Calendar</h2><p className="text-slate-500 mt-2">Schedule and view important school events.</p></div>} /> */}
                {/* <Route path="/school/assessments" element={<div className="p-8"><h2 className="text-2xl font-bold">Assessments</h2><p className="text-slate-500 mt-2">Track and manage student assessments.</p></div>} /> */}
                {/* <Route path="/school/reports" element={<div className="p-8"><h2 className="text-2xl font-bold">Reports & Analytics</h2><p className="text-slate-500 mt-2">Generate detailed performance reports.</p></div>} /> */}
                {/* <Route path="/school/messages" element={<div className="p-8"><h2 className="text-2xl font-bold">Message Center</h2><p className="text-slate-500 mt-2">Internal communication platform.</p></div>} /> */}
                <Route path="/school/profile" element={<SchoolProfile />} />
                <Route path="/school/settings" element={<SchoolSettings />} />
            </Route>

            {/* Global Catch-all 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
    );
};

export default AppRoutes;

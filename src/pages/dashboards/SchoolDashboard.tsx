import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "../../store/useAuthStore";
import api from "../../api/axios";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
    Users,
    GraduationCap,
    Calendar,
    ArrowUpRight,
    CheckCircle2,
    AlertTriangle,
    Plus,
    Activity,
    FileText,
    Layers,
    TrendingUp,
    RefreshCw,
    Bell,
    ArrowRight,
    Clock,
    BookOpen,
    School,
    Zap
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";

interface DashboardSummary {
    totalStudents: number;
    totalTests: number;
    totalReports: number;
    totalGrades: number;
}

export const SchoolDashboard = () => {
    const { user, tenantData } = useAuthStore();
    const navigate = useNavigate();
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [recentStudents, setRecentStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [greeting, setGreeting] = useState("");

    // Local state to make widgets fully interactive
    const [announcementsList, setAnnouncementsList] = useState([
        {
            title: "Term 1 Cognitive Aptitude Exam Schedule Published",
            date: "June 15, 2026",
            priority: "High",
            category: "Exams"
        },
        {
            title: "New Student Orientation Program Launching",
            date: "June 18, 2026",
            priority: "Medium",
            category: "Admissions"
        },
        {
            title: "Parent-Teacher Advisory Meeting Schedule",
            date: "June 20, 2026",
            priority: "Low",
            category: "Events"
        }
    ]);

    const [assessmentsList] = useState([
        {
            name: "Cognitive Aptitude Assessment",
            grade: "10th Grade",
            date: "June 25, 2026",
            status: "Scheduled"
        },
        {
            name: "Emotional Intelligence Survey",
            grade: "11th Grade",
            date: "June 28, 2026",
            status: "Draft"
        },
        {
            name: "Core STEM Evaluation",
            grade: "12th Grade",
            date: "July 02, 2026",
            status: "Scheduled"
        }
    ]);

    const [activitiesList] = useState([
        {
            icon: <GraduationCap className="h-4 w-4" />,
            title: "Adil Shah registered under 12th Grade",
            time: "10m ago",
            user: "Registrar Office"
        },
        {
            icon: <BookOpen className="h-4 w-4" />,
            title: "Mid-Term Aptitude Evaluation scheduled",
            time: "1h ago",
            user: "Principal"
        },
        {
            icon: <FileText className="h-4 w-4" />,
            title: "Performance Analytics Report generated",
            time: "3h ago",
            user: "System"
        },
        {
            icon: <Users className="h-4 w-4" />,
            title: "Dr. Robert Wilson added to Faculty Registry",
            time: "1d ago",
            user: "HR Admin"
        },
        {
            icon: <Bell className="h-4 w-4" />,
            title: "Academic Term Schedule broadcasted",
            time: "2d ago",
            user: "Coordinator"
        }
    ]);

    const getOrganizationId = () => {
        const orgIdFromStorage = localStorage.getItem("organizationId");
        if (orgIdFromStorage) return orgIdFromStorage;

        const authTenantData = useAuthStore.getState().tenantData;
        if (authTenantData?.id) return String(authTenantData.id);

        const authUser = useAuthStore.getState().user as any;
        if (authUser?.organizationId) return String(authUser.organizationId);
        if (authUser?.tenantId) return String(authUser.tenantId);

        try {
            const orgData = localStorage.getItem("organizationData");
            if (orgData) {
                const org = JSON.parse(orgData);
                if (org?.id) return String(org.id);
            }
        } catch { }

        return null;
    };

    const fetchAllData = async () => {
        setLoading(true);
        setError(null);
        try {
            const orgId = getOrganizationId();

            // Parallel execution of dashboard statistics, recent students registry, and organization profile
            const summaryPromise = api.get("/Organization/dashboard-summary");
            const studentsPromise = api.get("/Organization/students", {
                params: {
                    pageNumber: 1,
                    pageSize: 5,
                    sortBy: "createddate",
                    sortDirection: "desc"
                }
            });
            const profilePromise = orgId ? api.get(`/Organization/${orgId}`) : Promise.resolve(null);

            const [summaryRes, studentsRes, profileRes] = await Promise.all([
                summaryPromise,
                studentsPromise,
                profilePromise
            ]);

            if (summaryRes.data && summaryRes.data.success) {
                setSummary(summaryRes.data.data);
            } else {
                throw new Error("Failed to load dashboard summary stats.");
            }

            if (studentsRes.data && studentsRes.data.success) {
                const sData = studentsRes.data.data?.students;
                let list: any[] = [];
                if (Array.isArray(sData)) {
                    list = sData;
                } else if (sData && Array.isArray(sData.items)) {
                    list = sData.items;
                }
                setRecentStudents(list);
            }

            if (profileRes && profileRes.data && profileRes.data.success) {
                setProfile(profileRes.data.data);
            }
        } catch (err: any) {
            console.error("Dashboard fetch error:", err);
            setError(err?.response?.data?.message || err?.message || "Failed to load dashboard information.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning");
        else if (hour < 18) setGreeting("Good Afternoon");
        else setGreeting("Good Evening");

        fetchAllData();
    }, []);

    const currentDate = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const adminName = user?.firstName
        ? `${user.firstName} ${user.lastName || ""}`
        : (user?.name || "Organization Admin");

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse p-1.5">
                {/* Welcome Banner Skeleton */}
                <div className="bg-slate-200 dark:bg-slate-800 h-28 rounded-2xl w-full" />

                {/* 6 Statistics Cards Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white dark:bg-[#0f1117] border border-slate-200/60 dark:border-slate-800 rounded-2xl p-4 h-32 flex flex-col justify-between">
                            <div className="flex justify-between items-center">
                                <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
                                <div className="h-4 w-10 bg-slate-200 dark:bg-slate-800 rounded" />
                            </div>
                            <div className="space-y-1.5">
                                <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                                <div className="h-6 w-12 bg-slate-250 dark:bg-slate-750 rounded" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions Skeleton */}
                <div className="bg-white dark:bg-[#0f1117] border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 h-24 w-full" />

                {/* Bottom Widgets Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="lg:col-span-2 bg-white dark:bg-[#0f1117] border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 h-80 w-full" />
                    <div className="bg-white dark:bg-[#0f1117] border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 h-80 w-full" />
                </div>
            </div>
        );
    }

    if (error || !summary) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center px-4 p-1.5 animate-in fade-in duration-500">
                <div className="max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-elegant bg-white dark:bg-[#0f1117] rounded-3xl p-8 text-center flex flex-col items-center">
                    <div className="h-14 w-14 rounded-2xl bg-rose-50 dark:bg-rose-955/20 flex items-center justify-center mb-4 border border-rose-100 dark:border-rose-900/30 text-rose-500">
                        <AlertTriangle className="h-7 w-7" />
                    </div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">Unable to load dashboard details.</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mb-6 max-w-xs leading-relaxed">
                        Please check your network connection or session token and try again.
                    </p>
                    <Button
                        onClick={fetchAllData}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold h-9.5 px-6 rounded-xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
                    >
                        Retry Connection
                    </Button>
                </div>
            </div>
        );
    }

    const metricCards = [
        {
            label: "Total Students",
            count: summary.totalStudents,
            emptyMessage: "No Students Available",
            icon: <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
            gradientClass: "bg-gradient-to-br from-blue-500/5 via-transparent to-transparent",
            iconBgClass: "bg-blue-50 dark:bg-blue-950/20 border-blue-100/30 dark:border-blue-900/30",
            link: "/school/students",
        },
        {
            label: "Total Staff",
            count: 4, // matching dummy registry size
            emptyMessage: "No Staff Added",
            icon: <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-450" />,
            gradientClass: "bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent",
            iconBgClass: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100/30 dark:border-emerald-900/30",
            link: "/school/staff",
        },
        {
            label: "Total Assessments",
            count: summary.totalTests,
            emptyMessage: "No Assessments Available",
            icon: <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
            gradientClass: "bg-gradient-to-br from-purple-500/5 via-transparent to-transparent",
            iconBgClass: "bg-purple-50 dark:bg-purple-950/20 border-purple-100/30 dark:border-purple-900/30",
            link: "/school/students",
        },
        {
            label: "Reports Generated",
            count: summary.totalReports,
            emptyMessage: "No Reports Generated",
            icon: <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />,
            gradientClass: "bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent",
            iconBgClass: "bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100/30 dark:border-indigo-900/30",
            link: "/school/students",
        },
        {
            label: "Total Grades",
            count: summary.totalGrades,
            emptyMessage: "No Grades Available",
            icon: <Layers className="h-5 w-5 text-amber-600 dark:text-amber-500" />,
            gradientClass: "bg-gradient-to-br from-amber-500/5 via-transparent to-transparent",
            iconBgClass: "bg-amber-50 dark:bg-amber-950/20 border-amber-100/30 dark:border-amber-900/30",
            link: "/school/profile",
        },
        {
            label: "Upcoming Events",
            count: 2,
            emptyMessage: "No Upcoming Events",
            icon: <Calendar className="h-5 w-5 text-rose-600 dark:text-rose-450" />,
            gradientClass: "bg-gradient-to-br from-rose-500/5 via-transparent to-transparent",
            iconBgClass: "bg-rose-50 dark:bg-rose-950/20 border-rose-100/30 dark:border-rose-900/30",
            link: "#",
        }
    ];

    const quickActions = [
        {
            title: "Register Student",
            icon: <Plus className="h-4 w-4 mr-2 text-indigo-500 shrink-0" />,
            onClick: () => navigate("/school/students/add")
        },
        {
            title: "Manage Students",
            icon: <GraduationCap className="h-4 w-4 mr-2 text-blue-500 shrink-0" />,
            onClick: () => navigate("/school/students")
        },
        {
            title: "Manage Staff",
            icon: <Users className="h-4 w-4 mr-2 text-emerald-500 shrink-0" />,
            onClick: () => navigate("/school/staff")
        },
        {
            title: "Create Assessment",
            icon: <BookOpen className="h-4 w-4 mr-2 text-purple-500 shrink-0" />,
            onClick: () => {
                toast.info("Assessments can be created and assigned directly inside student profiles.", { duration: 4000 });
                navigate("/school/students");
            }
        },
        {
            title: "View Reports",
            icon: <TrendingUp className="h-4 w-4 mr-2 text-indigo-500 shrink-0" />,
            onClick: () => {
                toast.info("Student-specific reports are accessible via the Student registry detail page.", { duration: 4000 });
                navigate("/school/students");
            }
        },
        {
            title: "Academic Calendar",
            icon: <Calendar className="h-4 w-4 mr-2 text-rose-500 shrink-0" />,
            onClick: () => {
                toast.info("Academic calendar management screen is scheduled in the upcoming module update.", { duration: 4000 });
            }
        },
        {
            title: "School Profile",
            icon: <School className="h-4 w-4 mr-2 text-amber-500 shrink-0" />,
            onClick: () => navigate("/school/profile")
        },
        {
            title: "Announcements",
            icon: <Bell className="h-4 w-4 mr-2 text-cyan-500 shrink-0" />,
            onClick: () => {
                toast.info("Broadcast announcements controls will be available in the next revision.", { duration: 4000 });
            }
        }
    ];

    return (
        <div className="min-h-screen w-full bg-[#F8FAFC] relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none z-0" />
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>

            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 space-y-5 animate-in fade-in duration-500">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <div className="h-px w-6 bg-primary/40"></div>
                            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-primary">Organization Console</span>
                        </div>
                        {/* <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2 mb-0.5">
                            Organization <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Dashboard</span>
                        </h1> */}
                        {/* <p className="text-xs font-medium text-slate-500 max-w-2xl">
                            Centralized workspace for student metrics, evaluations, and staff management.
                        </p> */}
                    </div>
                </div>

                {/* 1. Welcome Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white relative overflow-hidden shadow-md border border-slate-800">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <School className="h-32 w-32" />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                        <div>
                            <h1 className="text-xl md:text-2xl font-black tracking-tight leading-tight">
                                {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">{adminName}</span>
                            </h1>
                            <p className="text-xs text-slate-355 font-medium mt-1 max-w-xl">
                                Manage students, assessments, staff, reports, and organizational activities from one centralized workspace.
                            </p>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3">
                                <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">
                                    {currentDate}
                                </span>
                                <span className="text-[10px] text-slate-650">•</span>
                                <span className="text-[10px] text-slate-300 font-bold">
                                    {profile?.instituteName || tenantData?.instituteName || "Cogveel Technologies"}
                                </span>
                                <span className="text-[10px] text-slate-655">•</span>
                                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                                    Academic Session: 2025 - 2026
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2.5">
                            <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-sm">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <div className="text-left">
                                    <span className="text-[8px] font-bold text-white/40 block uppercase tracking-wider leading-none">Status</span>
                                    <span className="text-[10px] font-extrabold text-white">
                                        {profile?.status || (profile?.isActive ? "Active" : "Inactive") || "Active"}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-sm">
                                <Zap className="h-3.5 w-3.5 text-amber-400" />
                                <div className="text-left">
                                    <span className="text-[8px] font-bold text-white/40 block uppercase tracking-wider leading-none">Type</span>
                                    <span className="text-[10px] font-extrabold text-white">
                                        {profile?.organizationType || "Academy"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Dynamic Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    {metricCards.map((card, i) => {
                        const cardContent = (
                            <div className={cn(
                                "bg-white dark:bg-[#0f1117] border border-slate-200/60 dark:border-slate-850 rounded-2xl p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant relative overflow-hidden h-full flex flex-col justify-between",
                                card.gradientClass
                            )}>
                                <div>
                                    <div className="flex items-start justify-between">
                                        <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border", card.iconBgClass)}>
                                            {card.icon}
                                        </div>
                                        <Badge variant="outline" className="text-[8px] font-black uppercase tracking-wider border-slate-150 dark:border-slate-800 text-slate-400 bg-white/50 dark:bg-white/5 px-2 py-0.5">
                                            LIVE
                                        </Badge>
                                    </div>
                                    <div className="mt-3">
                                        <span className="text-[9px] font-black text-slate-450 dark:text-slate-550 uppercase tracking-wider block">
                                            {card.label}
                                        </span>
                                        {card.count === 0 ? (
                                            <div className="mt-1.5 min-h-[36px] flex flex-col justify-center">
                                                <span className="text-xs font-semibold text-slate-400 dark:text-slate-550 italic leading-snug">
                                                    {card.emptyMessage}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="min-h-[36px] flex items-baseline gap-1 mt-1.5">
                                                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                                                    {card.count.toLocaleString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );

                        if (card.link === "#") {
                            return <div key={i} className="block">{cardContent}</div>;
                        }

                        return (
                            <Link key={i} to={card.link} className="block group">
                                {cardContent}
                            </Link>
                        );
                    })}
                </div>

                {/* 3. Quick Actions Section */}
                <div className="bg-white dark:bg-[#0f1117] border border-slate-200/60 dark:border-slate-850 rounded-2xl p-4 shadow-sm space-y-3">
                    <div>
                        <h2 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Quick Actions</h2>
                        <p className="text-[10px] text-slate-500 font-medium">Administrative shortcuts and workspace tasks</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {quickActions.map((action, i) => (
                            <Button
                                key={i}
                                variant="outline"
                                onClick={action.onClick}
                                className="w-full justify-start text-left h-10 px-3 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-extrabold text-[10px] tracking-wider uppercase transition-all"
                            >
                                {action.icon}
                                {action.title}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* 4. Bottom Grid Widgets */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* Left Area (2 columns): Recent Registrations & Recent Activities */}
                    <div className="lg:col-span-2 space-y-5">

                        {/* Widget: Recent Student Registrations */}
                        <div className="bg-white dark:bg-[#0f1117] border border-slate-200/60 dark:border-slate-850 rounded-2xl p-4 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Recent Student Registrations</h2>
                                    <p className="text-[10px] text-slate-500 font-medium">Latest student enrollments registered dynamically</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={() => navigate("/school/students")}
                                    className="text-blue-500 hover:text-blue-650 font-black text-[10px] hover:bg-blue-50 dark:hover:bg-blue-950/20 h-8 px-2.5 rounded-lg transition-all"
                                >
                                    View All
                                    <ArrowRight className="h-3 w-3 ml-1" />
                                </Button>
                            </div>

                            {recentStudents.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/20 dark:bg-white/1">
                                    <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 mb-2">
                                        <GraduationCap className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider mb-0.5">No Students Available</h3>
                                    <p className="text-[10px] text-slate-500 font-medium max-w-[240px] leading-snug mb-3">
                                        This organization has not onboarded any students yet. Reports and metrics will update once students are registered.
                                    </p>
                                    <Button
                                        onClick={() => navigate("/school/students/add")}
                                        className="bg-blue-600 hover:bg-blue-500 text-white text-[9px] font-black h-8 px-4 rounded-xl transition-all shadow-md shadow-blue-500/20"
                                    >
                                        Register Student
                                    </Button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-slate-150 dark:border-slate-800 hover:bg-transparent">
                                                <TableHead className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Student Name</TableHead>
                                                <TableHead className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Grade</TableHead>
                                                <TableHead className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Registration Date</TableHead>
                                                <TableHead className="text-[9px] font-black uppercase text-slate-450 tracking-wider text-right">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {recentStudents.slice(0, 5).map((student: any) => (
                                                <TableRow key={student.studentId || student.userId || student.id} className="border-slate-150 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all">
                                                    <TableCell className="py-2.5">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-black uppercase border border-indigo-150/20">
                                                                {student.firstName ? student.firstName[0] : ""}
                                                                {student.lastName ? student.lastName[0] : ""}
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-black text-slate-850 dark:text-slate-200 leading-none">
                                                                    {student.firstName} {student.lastName}
                                                                </p>
                                                                <p className="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                                                                    {student.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-2.5">
                                                        <span className="text-[10px] font-extrabold text-slate-650 dark:text-slate-350">
                                                            {student.gradeName || "10th"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="py-2.5">
                                                        <span className="text-[10px] font-extrabold text-slate-500">
                                                            {student.createdDate ? new Date(student.createdDate).toLocaleDateString("en-US", {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric"
                                                            }) : "N/A"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="py-2.5 text-right">
                                                        <Badge className={cn(
                                                            "border-none text-[8px] font-black uppercase px-1.5 py-0.2 rounded",
                                                            student.isActive !== false ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                                                        )}>
                                                            {student.isActive !== false ? "Active" : "Inactive"}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>

                        {/* Widget: Recent Activities */}
                        <div className="bg-white dark:bg-[#0f1117] border border-slate-200/60 dark:border-slate-850 rounded-2xl p-4 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Recent Activities</h2>
                                    <p className="text-[10px] text-slate-500 font-medium">Real-time action log of administrative events</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={fetchAllData}
                                    className="text-primary font-bold text-[10px] hover:bg-primary/5 h-8 px-2.5 rounded-lg transition-all animate-in"
                                >
                                    <RefreshCw className="h-3 w-3 mr-1" />
                                    Refresh
                                </Button>
                            </div>

                            {activitiesList.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/20 dark:bg-white/1">
                                    <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-1">
                                        <Activity className="h-4 w-4" />
                                    </div>
                                    <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider mb-0.5">No Activities Found</h3>
                                    <p className="text-[10px] text-slate-500 font-medium max-w-[200px] leading-snug">No events registered.</p>
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {activitiesList.map((act, i) => (
                                        <div key={i} className="flex items-start justify-between p-3 border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/30 dark:hover:bg-white/5 rounded-xl transition-all gap-3">
                                            <div className="flex gap-2.5">
                                                <div className="p-1.5 rounded-lg shrink-0 mt-0.5 bg-blue-50 dark:bg-blue-950/20 text-blue-500 border border-blue-100/30 dark:border-blue-900/20">
                                                    {act.icon}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-extrabold text-slate-850 dark:text-slate-200 leading-snug">{act.title}</p>
                                                    <p className="text-[10px] text-slate-500 font-medium mt-0.5 leading-snug">Initiated by {act.user}</p>
                                                </div>
                                            </div>
                                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mt-0.5">{act.time}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right Area (1 column): Upcoming Assessments & Announcements Widgets */}
                    <div className="space-y-5">

                        {/* Widget: Upcoming Assessments */}
                        <div className="bg-white dark:bg-[#0f1117] border border-slate-200/60 dark:border-slate-850 rounded-2xl p-4 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Upcoming Assessments</h2>
                                    <p className="text-[10px] text-slate-500 font-medium">Scheduled assessments for students</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={() => navigate("/school/students")}
                                    className="text-blue-500 hover:text-blue-650 font-black text-[10px] h-8 px-2 rounded-lg"
                                >
                                    Assign
                                </Button>
                            </div>

                            {assessmentsList.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/20 dark:bg-white/1">
                                    <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-1">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider mb-0.5">No Assessments Available</h3>
                                    <p className="text-[10px] text-slate-500 font-medium max-w-[200px] leading-snug">
                                        This student has not attempted any assessments yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {assessmentsList.map((assess, i) => (
                                        <div key={i} className="p-3 border border-slate-100 dark:border-slate-800/85 rounded-xl hover:bg-slate-50/30 dark:hover:bg-white/5 transition-all space-y-2">
                                            <div className="flex justify-between items-start">
                                                <div className="min-w-0">
                                                    <p className="text-xs font-extrabold text-slate-850 dark:text-slate-200 truncate">{assess.name}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{assess.grade}</p>
                                                </div>
                                                <Badge className={cn("border-none text-[8px] font-black uppercase px-1.5 py-0.2 rounded shrink-0",
                                                    assess.status === 'Scheduled' ? 'bg-indigo-500 text-white' : 'bg-slate-500 text-white'
                                                )}>
                                                    {assess.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[9px] font-extrabold text-slate-450 dark:text-slate-550">
                                                <Clock className="h-3 w-3 text-slate-400" />
                                                <span>{assess.date}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Widget: Announcements */}
                        <div className="bg-white dark:bg-[#0f1117] border border-slate-200/60 dark:border-slate-850 rounded-2xl p-4 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Announcements</h2>
                                    <p className="text-[10px] text-slate-500 font-medium">Broadcast messages and publications</p>
                                </div>
                                {announcementsList.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setAnnouncementsList([]);
                                            toast.success("Announcements cleared.");
                                        }}
                                        className="text-rose-500 hover:text-rose-650 font-black text-[10px] h-8 px-2 rounded-lg"
                                    >
                                        Dismiss All
                                    </Button>
                                )}
                            </div>

                            {announcementsList.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/20 dark:bg-white/1">
                                    <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 mb-1">
                                        <Bell className="h-4 w-4" />
                                    </div>
                                    <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider mb-0.5">No Announcements</h3>
                                    <p className="text-[10px] text-slate-500 font-medium max-w-[200px] leading-snug">
                                        No announcements available.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {announcementsList.map((ann, i) => (
                                        <div key={i} className="p-3 border border-slate-100 dark:border-slate-800/85 rounded-xl hover:bg-slate-50/30 dark:hover:bg-white/5 transition-all space-y-1.5">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[8px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-950/20 px-1.5 py-0.2 rounded border border-blue-100/30">
                                                    {ann.category}
                                                </span>
                                                <Badge className={cn("border-none text-[8px] font-black uppercase px-1.5 py-0.2 rounded",
                                                    ann.priority === 'High' ? 'bg-rose-500 text-white' :
                                                        ann.priority === 'Medium' ? 'bg-amber-500 text-white' : 'bg-slate-500 text-white'
                                                )}>
                                                    {ann.priority}
                                                </Badge>
                                            </div>
                                            <p className="text-xs font-extrabold text-slate-850 dark:text-slate-200 leading-snug">{ann.title}</p>
                                            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider pt-0.5">{ann.date}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                </div>
            </div>

        </div>
    );
};

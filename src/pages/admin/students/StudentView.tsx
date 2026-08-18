import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStudentStore } from "../../../store/studentStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { 
    Loader2, 
    ArrowLeft, 
    Edit3, 
    Shield,
    ClipboardList,
    FileText,
    Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/api/axios";
import { toast } from "sonner";

const StudentView: React.FC = () => {
    const navigate = useNavigate();
    const [downloadingReports, setDownloadingReports] = useState<{ [key: number]: boolean }>({});
    const { id } = useParams<{ id: string }>();
    const { student, loading, error, fetchStudent, clearStudent } = useStudentStore();

    const user = useAuthStore((state) => state.user);
    const isSchool = user?.roleId === 4 || 
                     user?.roleId === 3 ||
                     user?.role?.toLowerCase() === "school" || 
                     user?.role?.toLowerCase() === "organization" ||
                     user?.role?.toLowerCase() === "organizationadmin";

    const redirectPath = isSchool ? "/school/students" : "/manage/students";

    useEffect(() => {
        if (id) {
            fetchStudent(id);
        }
        
        return () => {
            clearStudent();
        };
    }, [id, fetchStudent, clearStudent]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "-";
            const day = date.getDate();
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const month = months[date.getMonth()];
            const year = date.getFullYear();
            return `${day} ${month} ${year}`;
        } catch {
            return "-";
        }
    };

    // Build full absolute URL from a path like "/api/organization/..." or "/uploads/..."
    const getAbsoluteUrl = (path: string) => {
        if (!path) return "";
        if (path.startsWith("http://") || path.startsWith("https://")) return path;
        const baseHost = (
            import.meta.env.VITE_API_BASE_URL ||
            import.meta.env.VITE_ORG_API_BASE_URL ||
            "https://nervous-dubinsky.180-179-213-167.plesk.page/api/"
        ).replace(/\/+$/, "");
        // Strip trailing /api from base host so we can use the full path as-is
        const domain = baseHost.endsWith("/api")
            ? baseHost.slice(0, -4)
            : baseHost;
        const cleanPath = path.startsWith("/") ? path : `/${path}`;
        return domain + cleanPath;
    };

    // Uses the reportPdfUrl returned by the backend (e.g. "/api/organization/students/report/21/download")
    // which is the correct endpoint for org/admin roles — not the student-only endpoint.
    const handleDownloadReport = async (reportId: number, testName: string, reportPdfUrl: string) => {
        if (!reportPdfUrl) {
            toast.error("Report URL not available for this attempt.");
            return;
        }

        setDownloadingReports(prev => ({ ...prev, [reportId]: true }));

        try {
            // reportPdfUrl from backend includes "/api/" prefix (e.g. "/api/organization/students/report/21/download")
            // Axios base URL already includes "/api/", so we strip the leading "/api" before calling api.get()
            let endpoint = reportPdfUrl;
            if (endpoint.startsWith("/api/")) {
                endpoint = endpoint.substring(4); // "/api/org..." → "/org..."
            } else if (endpoint.startsWith("/api")) {
                endpoint = endpoint.substring(4);
            }

            const response = await api.get(endpoint, {
                responseType: "blob",
                headers: { "x-skip-toast": "true" }
            });

            // Extract filename from Content-Disposition header
            let filename = `${testName.replace(/[^a-zA-Z0-9]/g, "_")}_Report.pdf`;
            const disposition = response.headers["content-disposition"] || response.headers["Content-Disposition"];
            if (disposition) {
                const filenameStarMatch = disposition.match(/filename\*=utf-8''([^;\n]+)/i);
                if (filenameStarMatch && filenameStarMatch[1]) {
                    filename = decodeURIComponent(filenameStarMatch[1]);
                } else {
                    const filenameMatch = disposition.match(/filename=([^;\n]+)/);
                    if (filenameMatch && filenameMatch[1]) {
                        filename = filenameMatch[1].replace(/['"]/g, "").trim();
                    }
                }
            }

            // Create blob URL and trigger download
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Report downloaded successfully.");
        } catch (error) {
            console.error("PDF download failed:", error);
            toast.error("Unable to download report.");
        } finally {
            setDownloadingReports(prev => ({ ...prev, [reportId]: false }));
        }
    };


    if (loading && !student) {
        return (
            <div className="min-h-screen w-full bg-[#FAFAFA] dark:bg-slate-950 px-4 py-6 flex flex-col items-center overflow-x-hidden">
                <div className="max-w-4xl w-full flex flex-col gap-6 animate-pulse">
                    
                    {/* Header Skeleton */}
                    <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-3">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-slate-200 dark:bg-slate-850 rounded-lg"></div>
                            <div className="space-y-1.5">
                                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-850 rounded"></div>
                                <div className="h-3 w-40 bg-slate-100 dark:bg-slate-850 rounded"></div>
                            </div>
                        </div>
                        <div className="h-9 w-28 bg-slate-200 dark:bg-slate-850 rounded-xl"></div>
                    </div>

                    {/* Identity Card Skeleton */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex items-center gap-5">
                        <div className="h-16 w-16 bg-slate-200 dark:bg-slate-850 rounded-xl"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-40 bg-slate-200 dark:bg-slate-850 rounded"></div>
                            <div className="h-3 w-28 bg-slate-100 dark:bg-slate-850 rounded"></div>
                        </div>
                        <div className="h-6 w-16 bg-slate-200 dark:bg-slate-850 rounded-full"></div>
                    </div>

                    {/* Details Card Skeleton */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm p-6 space-y-6">
                        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-850 rounded"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="h-3 w-20 bg-slate-100 dark:bg-slate-850 rounded"></div>
                                    <div className="h-4 w-36 bg-slate-200 dark:bg-slate-850 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="min-h-screen w-full bg-[#FAFAFA] dark:bg-slate-950 flex items-center justify-center px-4">
                <Card className="max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
                    <CardContent className="p-8 text-center flex flex-col items-center">
                        <div className="h-16 w-16 rounded-2xl bg-red-50 dark:bg-red-950/20 flex items-center justify-center mb-4 border border-red-100 dark:border-red-900/35">
                            <Shield className="h-8 w-8 text-red-500" />
                        </div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">Access Protocol Failed</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mb-6">{error || "The requested student could not be located in the registry."}</p>
                        <Button onClick={() => navigate(redirectPath)} className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 text-white text-xs font-semibold h-9 px-6 rounded-xl shadow-sm">
                            Return to Registry
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const initials = `${student.firstName?.[0] || ""}${student.lastName?.[0] || ""}`.toUpperCase() || "??";
    const fullName = `${student.firstName || ""} ${student.lastName || ""}`.trim() || "Student Profile";

    return (
        <div className="min-h-screen w-full bg-[#F8FAFC] relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none z-0" />
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>

            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 space-y-5 animate-in fade-in duration-500 max-w-4xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => navigate(redirectPath)}
                            className="p-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                            type="button"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <div className="h-px w-6 bg-primary/40"></div>
                                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-primary">Organization Console</span>
                            </div>
                            <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2 mb-0.5">
                                View <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Student</span>
                            </h1>
                            <p className="text-xs font-medium text-slate-500 max-w-2xl">
                                Manage and view student information
                            </p>
                        </div>
                    </div>

                    <Button 
                        onClick={() => navigate(isSchool ? `/school/students/edit/${student.id}` : `/students/edit/${student.id}`)} 
                        className="bg-slate-900 hover:bg-slate-800 border-none text-white h-9 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-slate-900/20 gap-2 px-5 hover:scale-[1.02] active:scale-95 transition-all flex items-center"
                    >
                        <Edit3 className="h-3.5 w-3.5" />
                        Edit Student
                    </Button>
                </div>

                {/* Identity Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-xl p-4 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-650 flex items-center justify-center font-black text-white text-base shadow-md">
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight truncate">
                            {fullName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            <span>Grade {student.gradeLevel || student.gradeName || "Not assigned"}</span>
                            <span className="text-slate-350 dark:text-slate-700">•</span>
                            <span>ID: {student.studentId || student.id || "-"}</span>
                        </div>
                    </div>
                    <div>
                        {student.isActive !== false ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                                <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                                Active
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50">
                                <span className="h-1 w-1 rounded-full bg-rose-500" />
                                Inactive
                            </span>
                        )}
                    </div>
                </div>

                {/* Details Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-xl shadow-sm p-4 space-y-5">
                    {/* Personal Information */}
                    <div className="space-y-2">
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-1.5">
                            <h4 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                Personal Information
                            </h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                            <div>
                                <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">First Name</span>
                                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">{student.firstName || "-"}</span>
                            </div>
                            <div>
                                <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Last Name</span>
                                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">{student.lastName || "-"}</span>
                            </div>
                            <div>
                                <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Gender</span>
                                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">{student.gender || "-"}</span>
                            </div>
                            <div>
                                <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Date of Birth</span>
                                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">{formatDate(student.dateOfBirth)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div className="space-y-2">
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-1.5">
                            <h4 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                Academic Information
                            </h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                            <div>
                                <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Grade</span>
                                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">{student.gradeLevel || student.gradeName || "Not assigned"}</span>
                            </div>
                            <div>
                                <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Student ID</span>
                                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">{student.studentId || "-"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-2">
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-1.5">
                            <h4 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                Contact Information
                            </h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                            <div>
                                <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Email</span>
                                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block break-all">{student.email || "-"}</span>
                            </div>
                            <div>
                                <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Phone Number</span>
                                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">{student.phoneNumber || student.phone || "-"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Assessment & Report History Section */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm p-6 space-y-6">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                            Assessment & Report History
                        </h4>
                    </div>
                    
                    {!student.testDetails || student.testDetails.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/25 dark:bg-slate-950/10 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <div className="h-12 w-12 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center mb-3.5 text-slate-400 dark:text-slate-500">
                                <ClipboardList className="h-6 w-6" />
                            </div>
                            <h5 className="text-sm font-black text-slate-900 dark:text-white mb-1">
                                No Assessments Available
                            </h5>
                            <p className="text-[11px] text-slate-550 dark:text-slate-400 max-w-sm leading-relaxed">
                                This student has not attempted any assessments yet. Reports and attempt history will appear here once tests are completed.
                            </p>
                            <Button 
                                variant="outline" 
                                onClick={() => navigate(redirectPath)}
                                className="mt-4 h-8.5 border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 font-bold px-4 text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                            >
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Go Back
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {student.testDetails.map((test) => (
                                <div key={test.testId} className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 bg-slate-50/30 dark:bg-slate-950/10 space-y-4">
                                    <div>
                                        <h5 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                                            {test.testName}
                                        </h5>
                                        <div className="flex flex-wrap items-center gap-x-2 mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                                            <span className="bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">
                                                {test.totalQuestions} Questions
                                            </span>
                                            <span className="text-slate-300 dark:text-slate-700">•</span>
                                            <span className="bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded">
                                                {test.totalAttempts} {test.totalAttempts === 1 ? "Attempt" : "Attempts"}
                                            </span>
                                            <span className="text-slate-300 dark:text-slate-700">•</span>
                                            <span>
                                                Last Attempt: {formatDate(test.lastAttemptDate)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Attempts sub-section */}
                                    <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                            Attempts
                                        </div>
                                        
                                        {!test.attempts || test.attempts.length === 0 ? (
                                            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                                                No reports generated for this assessment.
                                            </p>
                                        ) : (
                                            <div className="space-y-2">
                                                {test.attempts.map((attempt) => (
                                                    <div 
                                                        key={attempt.reportId} 
                                                        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:border-slate-200 dark:hover:border-slate-700 transition-all group"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/35 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                                                <FileText className="h-4.5 w-4.5" />
                                                            </div>
                                                            <div>
                                                                <div className="text-xs font-extrabold text-slate-850 dark:text-slate-200 flex items-center gap-2">
                                                                    <span>Attempt #{attempt.attemptNumber}</span>
                                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
                                                                        {attempt.format.toUpperCase()}
                                                                    </span>
                                                                </div>
                                                                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">
                                                                    Generated: {formatDate(attempt.createdDate)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
                                                            {/* View HTML report in browser */}
                                                            {attempt.reportHtmlUrl && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => window.open(getAbsoluteUrl(attempt.reportHtmlUrl), "_blank", "noopener,noreferrer")}
                                                                    className="h-8 px-3 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-black uppercase tracking-wider rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-all shadow-sm"
                                                                >
                                                                    <FileText className="h-3.5 w-3.5" />
                                                                    View HTML
                                                                </Button>
                                                            )}
                                                            {/* Download PDF using the org-specific endpoint from the API */}
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleDownloadReport(attempt.reportId, test.testName, attempt.reportPdfUrl)}
                                                                disabled={!!downloadingReports[attempt.reportId]}
                                                                className="h-8 px-3.5 bg-blue-600 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-[11px] font-black uppercase tracking-wider rounded-lg shadow-sm shadow-blue-600/10 hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                                                            >
                                                                {downloadingReports[attempt.reportId] ? (
                                                                    <>
                                                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                                        Downloading...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Download className="h-3.5 w-3.5" />
                                                                        Download Report
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
            <div className="h-16"></div>
        </div>
    );
};

export default StudentView;
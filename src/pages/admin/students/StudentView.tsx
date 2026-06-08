import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStudentStore } from "../../../store/studentStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { 
    Loader2, 
    ArrowLeft, 
    Edit3, 
    Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

const StudentView: React.FC = () => {
    const navigate = useNavigate();
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

    if (loading && !student) {
        return (
            <div className="min-h-screen w-full bg-[#FAFAFA] dark:bg-slate-950 flex flex-col items-center justify-center">
                <div className="relative">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                    <div className="absolute inset-0 h-10 w-10 rounded-full border-4 border-blue-100 border-t-transparent animate-pulse"></div>
                </div>
                <p className="mt-4 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[9px]">Retrieving student profile...</p>
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
        <div className="min-h-screen w-full bg-[#FAFAFA] dark:bg-slate-950 px-4 py-6 flex flex-col items-center overflow-x-hidden">
            <div className="max-w-4xl w-full flex flex-col gap-6">
                
                {/* Compact Header */}
                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => navigate(redirectPath)}
                            className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            type="button"
                        >
                            <ArrowLeft className="h-4 w-4 text-slate-500" />
                        </button>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                View Student
                            </h2>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Manage and view student information
                            </p>
                        </div>
                    </div>
                    <Button 
                        onClick={() => navigate(isSchool ? `/school/students/edit/${student.id}` : `/students/edit/${student.id}`)} 
                        className="h-9 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white text-xs font-bold shadow-sm flex items-center gap-2"
                    >
                        <Edit3 className="h-3.5 w-3.5" />
                        Edit Student
                    </Button>
                </div>

                {/* Identity Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex items-center gap-5">
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-650 flex items-center justify-center font-black text-white text-xl shadow-md">
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight truncate">
                            {fullName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                            <span>Grade {student.gradeLevel || student.gradeName || "Not assigned"}</span>
                            <span className="text-slate-350 dark:text-slate-700">•</span>
                            <span>ID: {student.studentId || student.id || "-"}</span>
                        </div>
                    </div>
                    <div>
                        {student.isActive !== false ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Active
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50">
                                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                Inactive
                            </span>
                        )}
                    </div>
                </div>

                {/* Details Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm p-6 space-y-8">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                Personal Information
                            </h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            <div>
                                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">First Name</span>
                                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 block">{student.firstName || "-"}</span>
                            </div>
                            <div>
                                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Last Name</span>
                                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 block">{student.lastName || "-"}</span>
                            </div>
                            <div>
                                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Gender</span>
                                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 block">{student.gender || "-"}</span>
                            </div>
                            <div>
                                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Date of Birth</span>
                                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 block">{formatDate(student.dateOfBirth)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div className="space-y-4">
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                Academic Information
                            </h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            <div>
                                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Grade</span>
                                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 block">{student.gradeLevel || student.gradeName || "Not assigned"}</span>
                            </div>
                            <div>
                                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Student ID</span>
                                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 block">{student.studentId || "-"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                Contact Information
                            </h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            <div>
                                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Email</span>
                                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 block break-all">{student.email || "-"}</span>
                            </div>
                            <div>
                                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Phone Number</span>
                                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 block">{student.phoneNumber || student.phone || "-"}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="h-16"></div>
        </div>
    );
};

export default StudentView;
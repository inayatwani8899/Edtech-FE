import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStudentStore } from "../../../store/studentStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { 
    Loader2, 
    Calendar, 
    Phone, 
    Mail, 
    User, 
    School, 
    ArrowLeft, 
    Edit3, 
    Shield, 
    BadgeCheck, 
    Activity,
    MapPin,
    CalendarDays,
    GraduationCap,
    LayoutDashboard,
    XCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col items-center justify-center">
                <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-cyan-600" />
                    <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-cyan-100 border-t-transparent animate-pulse"></div>
                </div>
                <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Accessing Student Dossier...</p>
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="min-h-screen w-full bg-[#FAFAFA] flex items-center justify-center px-4">
                <Card className="max-w-md w-full border-none shadow-premium bg-white rounded-[2.5rem] overflow-hidden">
                    <CardContent className="p-10 text-center">
                        <div className="h-20 w-20 rounded-3xl bg-red-50 flex items-center justify-center mx-auto mb-6">
                            <Shield className="h-10 w-10 text-red-500" />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Access Protocol Failed</h2>
                        <p className="text-slate-500 text-sm mb-8">{error || "The requested individual could not be located in the registry."}</p>
                        <Button onClick={() => navigate(redirectPath)} className="bg-slate-900 text-white font-black text-[10px] uppercase h-10 px-8 rounded-xl tracking-widest hover:bg-slate-800 transition-all">
                            Return to Registry
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#FAFAFA] px-4 overflow-x-hidden">
            <div className="max-w-5xl mx-auto relative z-10">
                {/* CONDENSED HEADER */}
                <div className="flex items-center justify-between gap-3 mb-6 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-slate-50 border border-slate-100" onClick={() => navigate(redirectPath)}>
                            <ArrowLeft className="h-3.5 w-3.5 text-slate-400" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none uppercase">
                                Profile Intel
                            </h1>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Static Identity Dossier</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button 
                            variant="ghost" 
                            onClick={() => navigate(redirectPath)} 
                            className="text-slate-500 hover:bg-slate-100 font-black text-[10px] h-8 px-4 rounded-lg uppercase"
                        >
                            Back
                        </Button>
                        <Button 
                            onClick={() => navigate(isSchool ? `/school/students/edit/${student.id}` : `/students/edit/${student.id}`)} 
                            className="bg-cyan-600 text-white font-black text-[10px] h-8 px-5 rounded-lg shadow-lg hover:bg-cyan-500 transition-all flex items-center gap-2 uppercase tracking-wider"
                        >
                            <Edit3 className="h-3.5 w-3.5" />
                            Modify Dossier
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
                    {/* LEFT COLUMN: IDENTITY AVATAR */}
                    <div className="lg:col-span-4">
                        <Card className="border-none shadow-elegant bg-white rounded-[2.5rem] overflow-hidden border border-slate-100/50">
                            <div className="h-32 bg-slate-900 relative">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent"></div>
                            </div>
                            <CardContent className="px-6 pb-8 -mt-16 relative z-10 text-center">
                                <div className="h-32 w-32 rounded-[3rem] bg-white p-2 shadow-2xl border border-slate-50 mx-auto mb-6">
                                    <div className="h-full w-full rounded-[2.5rem] bg-slate-50 flex items-center justify-center border-2 border-dashed border-slate-200">
                                        <User className="h-16 w-16 text-slate-300" />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                                    {student.firstName} {student.lastName}
                                </h2>
                                <Badge variant="secondary" className="bg-cyan-50 text-cyan-600 font-black uppercase tracking-[0.2em] text-[10px] px-4 py-1 mb-8 border-none">
                                    Student Unit
                                </Badge>

                                <div className="space-y-4 pt-6 border-t border-slate-50 text-left">
                                    <div className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-2xl border border-slate-100">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight mb-1">Internal Reference</span>
                                            <span className="text-xs font-black text-slate-700 font-mono tracking-tighter">ID: {student.id}</span>
                                        </div>
                                        <Shield className="h-4 w-4 text-slate-300" />
                                    </div>
                                    
                                    <div className={cn(
                                        "flex items-center justify-between p-3.5 rounded-2xl border shadow-sm transition-colors",
                                        student.isActive !== false ? "bg-emerald-50/30 border-emerald-100 shadow-emerald-500/5" : "bg-rose-50/30 border-rose-100 shadow-rose-500/5"
                                    )}>
                                        <div className="flex flex-col">
                                            <span className={cn("text-[9px] font-black uppercase tracking-tight mb-1", student.isActive !== false ? "text-emerald-600/60" : "text-rose-600/60")}>Status Verification</span>
                                            <span className={cn("text-xs font-black", student.isActive !== false ? "text-emerald-700" : "text-rose-700")}>
                                                {student.isActive !== false ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                        {student.isActive !== false ? (
                                            <BadgeCheck className="h-5 w-5 text-emerald-500" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-rose-500" />
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: DATA STRIPS */}
                    <div className="lg:col-span-8 space-y-6">
                        <Card className="border-none shadow-elegant bg-white rounded-[2.5rem] border border-slate-100/50 overflow-hidden">
                            <div className="px-8 py-5 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Activity className="h-5 w-5 text-slate-800" />
                                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Biometric & Academic Matrix</h3>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            </div>
                            <CardContent className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* PHONE */}
                                    <div className="flex items-center gap-5 group">
                                        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 transition-all group-hover:scale-110 group-hover:bg-cyan-50 group-hover:border-cyan-100">
                                            <Phone className="h-5 w-5 text-slate-400 group-hover:text-cyan-600" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1">Contact Signal</p>
                                            <p className="text-sm font-black text-slate-800">{student.phone || "No signal detected"}</p>
                                        </div>
                                    </div>

                                    {/* EMAIL */}
                                    <div className="flex items-center gap-5 group">
                                        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 transition-all group-hover:scale-110 group-hover:bg-cyan-50 group-hover:border-cyan-100">
                                            <Mail className="h-5 w-5 text-slate-400 group-hover:text-cyan-600" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1">Neural Address</p>
                                            <p className="text-sm font-black text-slate-800 break-all">{student.email || "No address synchronized"}</p>
                                        </div>
                                    </div>

                                    {/* GRADE */}
                                    <div className="flex items-center gap-5 group">
                                        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 transition-all group-hover:scale-110 group-hover:bg-cyan-50 group-hover:border-cyan-100">
                                            <GraduationCap className="h-5 w-5 text-slate-400 group-hover:text-cyan-600" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1">Academic Stratum</p>
                                            <p className="text-sm font-black text-slate-800">Grade {student.gradeLevel || student.gradeName || "Not classified"}</p>
                                        </div>
                                    </div>

                                    {/* DOB */}
                                    <div className="flex items-center gap-5 group">
                                        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 transition-all group-hover:scale-110 group-hover:bg-cyan-50 group-hover:border-cyan-100">
                                            <CalendarDays className="h-5 w-5 text-slate-400 group-hover:text-cyan-600" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1">Temporal Origin</p>
                                            <p className="text-sm font-black text-slate-800">
                                                {student.dateOfBirth 
                                                    ? new Date(student.dateOfBirth).toLocaleDateString(undefined, { dateStyle: 'long' }) 
                                                    : "Date unknown"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* GENDER */}
                                    <div className="flex items-center gap-5 group">
                                        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 transition-all group-hover:scale-110 group-hover:bg-cyan-50 group-hover:border-cyan-100">
                                            <User className="h-5 w-5 text-slate-400 group-hover:text-cyan-600" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1">Gender Classification</p>
                                            <p className="text-sm font-black text-slate-800">{student.gender || "Not specified"}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* ENGAGEMENT SYNC */}
                        <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-slate-900/20 group">
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform">
                                    <LayoutDashboard className="h-7 w-7 text-cyan-400" />
                                </div>
                                <div className="text-center md:text-left">
                                    <h4 className="text-lg font-black tracking-tight leading-none mb-1">Engagement Dashboard</h4>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Access performance & assessment metrics</p>
                                </div>
                            </div>
                            <Button className="w-full md:w-auto bg-white text-slate-900 font-black text-[10px] uppercase tracking-widest h-12 px-10 rounded-2xl hover:bg-slate-100 transition-all shadow-xl active:scale-95">
                                Analyze Activity
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-16"></div>
        </div>
    );
};

export default StudentView;
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
    Loader2, 
    Save, 
    User, 
    Mail, 
    Phone, 
    GraduationCap, 
    Calendar as CalendarIcon, 
    Sparkles, 
    ArrowLeft,
    Shield,
    Fingerprint,
    CheckCircle2,
    BookOpen
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useStudentStore } from "../../../store/studentStore";

interface StudentFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gradeLevel: string;
    dateOfBirth: string;
}

const gradeOptions = [
    "Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade",
    "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade",
];

const StudentForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { student, loading, fetchStudent, createStudent, updateStudent, clearStudent } = useStudentStore();

    const [formData, setFormData] = useState<StudentFormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gradeLevel: "",
        dateOfBirth: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (id) {
            fetchStudent(id);
        }
        return () => {
            clearStudent();
        };
    }, [id, fetchStudent, clearStudent]);

    useEffect(() => {
        if (id && student) {
            setFormData({
                firstName: student.firstName || "",
                lastName: student.lastName || "",
                email: student.email || "",
                phone: student.phone || "",
                gradeLevel: student.gradeLevel || "",
                dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : ""
            });
        }
    }, [student, id]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            toast.error("Student identity fields are required");
            return false;
        }
        if (!emailRegex.test(formData.email)) {
            toast.error("Valid student email required");
            return false;
        }
        if (!formData.gradeLevel) {
            toast.error("Academic grade must be assigned");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            if (id) {
                await updateStudent(id, formData);
                toast.success("Scholar record synchronized successfully");
            } else {
                await createStudent(formData);
                toast.success("New scholar successfully enrolled");
            }
            navigate("/manage/students");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Enrollment protocol failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading && id && !student) {
        return (
            <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col items-center justify-center">
                <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
                    <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-emerald-100 border-t-transparent animate-pulse"></div>
                </div>
                <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Retrieving Scholar Dossier...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#FAFAFA] px-4 overflow-x-hidden">
            <div className="max-w-5xl mx-auto relative z-10">
                {/* CONDENSED HEADER */}
                <div className="flex items-center justify-between gap-3 mb-3 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-slate-50 border border-slate-100" onClick={() => navigate("/manage/students")}>
                            <ArrowLeft className="h-3.5 w-3.5 text-slate-400" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                                {id ? "Update Scholar" : "Enroll Scholar"}
                            </h1>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Academic Registry Module</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/manage/students")}
                            className="text-slate-500 hover:bg-slate-100 font-bold text-[10px] h-7 px-3 rounded-lg"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-slate-900 text-white font-bold text-[10px] h-7 px-4 rounded-lg shadow-md hover:bg-slate-800 transition-all flex items-center gap-1.5"
                        >
                            {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                            {id ? "Sync Data" : "Enroll"}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEFT COLUMN: IDENTITY & GRADE */}
                    <div className="lg:col-span-3">
                        <Card className="border-none shadow-elegant bg-white rounded-3xl overflow-hidden border border-slate-100/50">
                            <div className="h-16 bg-slate-900 relative">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                            </div>
                            <CardContent className="px-4 pb-4 -mt-8 relative z-10 text-center">
                                <div className="h-16 w-16 rounded-2xl bg-white p-1 shadow-lg border border-slate-50 mx-auto mb-3">
                                    <div className="h-full w-full rounded-xl bg-slate-50 flex items-center justify-center">
                                        <GraduationCap className="h-8 w-8 text-emerald-300" />
                                    </div>
                                </div>
                                <h2 className="text-base font-black text-slate-900 truncate mb-1 px-2">
                                    {formData.firstName || formData.lastName ? `${formData.firstName} ${formData.lastName}`.trim() : "Scholar ID"}
                                </h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Academic Registry</p>

                                <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-50">
                                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-left">
                                        <span className="text-[8px] font-black text-slate-400 uppercase block tracking-widest mb-1 text-center">Assigned Grade</span>
                                        <span className="text-sm font-black text-slate-800 block text-center">{formData.gradeLevel || "N/A"}</span>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-1.5 text-left">
                                    <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Level Selection</Label>
                                    <Select
                                        value={formData.gradeLevel}
                                        onValueChange={(val) => handleInputChange("gradeLevel", val)}
                                    >
                                        <SelectTrigger className="w-full h-9 bg-slate-100/50 border-transparent rounded-xl px-3 text-[10px] font-bold text-slate-600 focus:ring-0">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="h-3 w-3 text-emerald-500" />
                                                <span>Grade: {formData.gradeLevel || "Select"}</span>
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                                            {gradeOptions.map((grade) => (
                                                <SelectItem key={grade} value={grade} className="text-[10px] font-bold">{grade}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: PROFESSIONAL DETAILS & CONTACT */}
                    <div className="lg:col-span-9">
                        <Card className="border-none shadow-elegant bg-white rounded-3xl border border-slate-100/50 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                                <div className="flex items-center gap-2.5">
                                    <Shield className="h-4 w-4 text-emerald-600" />
                                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Scholar Profile & Credentials</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Enrollment Active</span>
                                </div>
                            </div>
                            <CardContent className="p-6 space-y-6">
                                {/* PRIMARY IDENTITY & CONTACT GRID */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">First Name</Label>
                                        <div className="relative group">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                                            <Input value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} className="h-10 pl-9 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-emerald-100 rounded-xl font-bold text-sm transition-all" placeholder="Given Name" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Last Name</Label>
                                        <div className="relative group">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                                            <Input value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} className="h-10 pl-9 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-emerald-100 rounded-xl font-bold text-sm transition-all" placeholder="Family Name" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight ml-1">Academic Email</Label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-emerald-300 group-focus-within:text-emerald-600 transition-colors" />
                                            <Input
                                                value={formData.email}
                                                onChange={(e) => handleInputChange("email", e.target.value)}
                                                className="h-10 pl-9 bg-emerald-50/30 border-emerald-100/50 focus:bg-white focus:ring-2 focus:ring-emerald-100 rounded-xl font-bold text-sm transition-all"
                                                placeholder="student@school.edu"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Parent/Guardian Signal</Label>
                                        <div className="relative group">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                                            <Input value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} className="h-10 pl-9 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-emerald-100 rounded-xl font-bold text-sm transition-all" placeholder="+1 (000) 000-0000" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 col-span-full">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Date of Birth</Label>
                                        <div className="relative group">
                                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                                            <Input 
                                                type="date" 
                                                value={formData.dateOfBirth} 
                                                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)} 
                                                className="h-10 pl-9 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-emerald-100 rounded-xl font-bold text-sm transition-all" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* ACTION STRIP */}
                        {id && (
                            <div className="mt-6 p-4 rounded-3xl bg-emerald-600 text-white flex items-center justify-between shadow-xl shadow-emerald-600/20 group">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform">
                                        <Sparkles className="h-5 w-5 text-emerald-100" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black tracking-tight leading-none mb-1">Scholar Synchronization Active</h4>
                                        <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Identity verified for secure update</p>
                                    </div>
                                </div>
                                <Button onClick={handleSubmit} className="bg-white text-emerald-600 font-black text-[10px] uppercase tracking-widest h-9 px-6 rounded-xl hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all shadow-lg">
                                    Push Update
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="h-16"></div>
        </div>
    );
};

export default StudentForm;
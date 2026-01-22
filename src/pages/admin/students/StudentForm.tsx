import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStudentStore, Student } from "../../../store/studentStore";
import {
    Loader2,
    Save,
    User,
    Mail,
    Phone,
    GraduationCap,
    Calendar as CalendarIcon,
    Sparkles,
    BookOpen
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

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
    const { student, loading, error, fetchStudent, createStudent, updateStudent, clearStudent } = useStudentStore();
    const { toast } = useToast();

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (id) {
                await updateStudent(id, formData);
            } else {
                await createStudent(formData);
            }
            navigate("/manage/students");
        } catch (err) {
            console.error("Failed to save student:", err);
            toast({ variant: "destructive", description: "Failed to save student record." });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading && id && !student) {
        return (
            <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-t-4 border-emerald-500 animate-spin"></div>
                    <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-emerald-500 animate-pulse" />
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-400">Loading Student Record...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#F8FAFC] py-8 px-4 sm:px-6">
            {/* Dynamic Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-teal-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }}></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="bg-white/50 backdrop-blur-md border-slate-200 text-slate-500 text-[10px] uppercase tracking-widest font-bold px-2 py-0.5">
                                Scholar Registry
                            </Badge>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                            {id ? "Edit Scholar" : "Enrol Scholar"}
                            <span className="text-slate-300">/</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Academic Profile</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/manage/students")}
                            className="bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-700 font-semibold h-10 px-5 transition-all"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-slate-900 text-white font-bold h-10 px-6 shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 rounded-xl"
                        >
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            Save Record
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min">

                    {/* CARD 1: IDENTITY (Hero) - Spans 8 cols */}
                    <Card className="md:col-span-8 border-none shadow-elegant bg-white/80 backdrop-blur-xl rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all duration-500">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Visual Avatar Section */}
                                <div className="flex-shrink-0 flex flex-col items-center gap-3">
                                    <div className="h-32 w-32 rounded-[2rem] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border-4 border-white shadow-lg relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                        <User className="h-12 w-12 text-slate-300" />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Student Photo</p>
                                    </div>
                                </div>

                                {/* Identity Inputs */}
                                <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-slate-500">First Name</Label>
                                        <Input
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="h-11 bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white focus:border-emerald-200 transition-all rounded-xl font-bold text-slate-700"
                                            placeholder="Given Name"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-slate-500">Last Name</Label>
                                        <Input
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="h-11 bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white focus:border-emerald-200 transition-all rounded-xl font-bold text-slate-700"
                                            placeholder="Family Name"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5 col-span-2">
                                        <Label className="text-xs font-bold text-slate-500">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="h-11 pl-10 bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white focus:border-emerald-200 transition-all rounded-xl font-semibold text-slate-700"
                                                placeholder="student@school.edu"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-slate-500">Contact Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="h-11 pl-10 bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white focus:border-emerald-200 transition-all rounded-xl font-semibold text-slate-700"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* CARD 2: GRADE METRIC - Spans 4 cols */}
                    <Card className="md:col-span-4 border-none shadow-elegant bg-gradient-to-br from-emerald-900 to-teal-900 text-white rounded-[2rem] overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-[150%] h-[150%] bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        <CardHeader className="p-6 pb-2 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                                    <GraduationCap className="h-5 w-5 text-emerald-300" />
                                </div>
                                <h3 className="text-lg font-bold">Academic Grade</h3>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 relative z-10 space-y-6">
                            <div className="space-y-2">
                                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 tracking-tight leading-none text-center py-4">
                                    {formData.gradeLevel || "Not Assigned"}
                                </div>
                                <Select
                                    value={formData.gradeLevel}
                                    onValueChange={(val) => setFormData(prev => ({ ...prev, gradeLevel: val }))}
                                >
                                    <SelectTrigger className="h-10 bg-white/10 border-white/5 text-white font-bold hover:bg-white/20 transition-all border-none focus:ring-0 rounded-xl">
                                        <SelectValue placeholder="Select Grade" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                        {gradeOptions.map((grade, idx) => (
                                            <SelectItem key={idx} value={grade} className="focus:bg-slate-800 focus:text-white">{grade}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* CARD 3: ADDITIONAL DETAILS (Horizontal Strip) - Spans 12 cols */}
                    <Card className="md:col-span-12 border-none shadow-elegant bg-white/60 backdrop-blur-xl rounded-[2rem] overflow-hidden">
                        <CardHeader className="p-6 pb-2">
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-blue-600" />
                                <h3 className="text-lg font-bold text-slate-900">Student Particulars</h3>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-slate-500">Date of Birth</Label>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            name="dateOfBirth"
                                            type="date"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                            className="h-11 pl-10 bg-white border-slate-200/50 hover:border-blue-200 transition-all rounded-xl font-semibold text-slate-700"
                                        />
                                    </div>
                                </div>
                                {/* Placeholder for more student info */}
                            </div>
                        </CardContent>
                    </Card>

                </form>
            </div>
        </div>
    );
};

export default StudentForm;
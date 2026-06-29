import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
    Loader2, 
    UserPlus, 
    ArrowLeft,
    Info,
    Eye,
    EyeOff,
    User,
    CheckCircle2,
    Lock
} from "lucide-react";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
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
import { useAuthStore } from "../../../store/useAuthStore";
import { cn } from "@/lib/utils";

interface StudentFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    gradeId: string;
    dateOfBirth: string;
    password?: string;
    studentId?: string; // Optional student ID field
    isActive?: boolean;
}

const StudentForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { student, loading, fetchStudent, createStudent, updateStudent, clearStudent } = useStudentStore();

    const user = useAuthStore((state) => state.user);
    const isSchool = user?.roleId === 4 || 
                     user?.roleId === 3 ||
                     user?.role?.toLowerCase() === "school" || 
                     user?.role?.toLowerCase() === "organization" ||
                     user?.role?.toLowerCase() === "organizationadmin";

    const redirectPath = isSchool ? "/school/students" : "/manage/students";

    const [grades, setGrades] = useState<{ id: number; name: string }[]>([]);
    const [countryCode, setCountryCode] = useState("+91");
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<StudentFormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        gradeId: "",
        dateOfBirth: "",
        password: "",
        studentId: "",
        isActive: true
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch grades list
    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const response = await api.get("/Grade", {
                    params: { page: 1, limit: 100, sortDirection: "asc" }
                });
                if (response.data && response.data.code === 200) {
                    setGrades(response.data.data.grades || []);
                }
            } catch (err) {
                console.error("Failed to fetch grades:", err);
            }
        };
        fetchGrades();
    }, []);

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
            // Find matched gradeId if only gradeLevel is present
            let selectedGradeId = student.gradeId?.toString() || "";
            if (!selectedGradeId && student.gradeLevel && grades.length > 0) {
                const matchedGrade = grades.find(g => g.name.toLowerCase() === student.gradeLevel?.toLowerCase());
                if (matchedGrade) {
                    selectedGradeId = matchedGrade.id.toString();
                }
            }

            // Extract phone number and country code if combined
            let rawPhone = student.phoneNumber || student.phone || "";
            let matchedCode = "+91";
            let parsedPhone = rawPhone;
            
            const codes = ["+91", "+1", "+44", "+971"];
            for (const code of codes) {
                if (rawPhone.startsWith(code)) {
                    matchedCode = code;
                    parsedPhone = rawPhone.slice(code.length);
                    break;
                }
            }

            setCountryCode(matchedCode);
            setFormData({
                firstName: student.firstName || "",
                lastName: student.lastName || "",
                email: student.email || "",
                phone: parsedPhone || "",
                gender: student.gender || "",
                gradeId: selectedGradeId,
                dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : "",
                password: "",
                studentId: "",
                isActive: student.isActive !== false
            });
        }
    }, [student, id, grades]);

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            toast.error("First name and last name are required");
            return false;
        }
        if (!emailRegex.test(formData.email)) {
            toast.error("Valid email address is required");
            return false;
        }
        if (!formData.phone.trim()) {
            toast.error("Phone number is required");
            return false;
        }
        if (!formData.dateOfBirth) {
            toast.error("Date of birth is required");
            return false;
        }
        if (!formData.gender) {
            toast.error("Gender selection is required");
            return false;
        }
        if (!formData.gradeId) {
            toast.error("Grade selection is required");
            return false;
        }
        if (!id && !formData.password?.trim()) {
            toast.error("Password is required for registration");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        const selectedGrade = grades.find(g => g.id.toString() === formData.gradeId);
        const formattedPhone = `${countryCode}${formData.phone.replace(/[^0-9]/g, "")}`;

        const submitPayload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formattedPhone,
            phoneNumber: formattedPhone,
            gender: formData.gender,
            gradeId: Number(formData.gradeId),
            gradeLevel: selectedGrade ? selectedGrade.name : "",
            dateOfBirth: formData.dateOfBirth,
            password: formData.password,
            isActive: formData.isActive !== false
        };

        try {
            if (id) {
                await updateStudent(id, submitPayload);
                toast.success("Scholar record synchronized successfully");
            } else {
                await createStudent(submitPayload);
                toast.success("Student added successfully by organization.");
            }
            navigate(redirectPath);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Student registration failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading && id && !student) {
        return (
            <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col items-center justify-center">
                <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                    <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-blue-100 border-t-transparent animate-pulse"></div>
                </div>
                <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Retrieving Scholar Dossier...</p>
            </div>
        );
    }

    // Dynamic helper values for preview
    const initials = `${formData.firstName?.[0] || ""}${formData.lastName?.[0] || ""}`.toUpperCase() || "??";
    const fullName = `${formData.firstName} ${formData.lastName}`.trim() || "New Student";
    const selectedGradeName = grades.find(g => g.id.toString() === formData.gradeId)?.name || "Not assigned";

    // Sections completion status
    const isPersonalComplete = !!(formData.firstName && formData.lastName && formData.gender && formData.dateOfBirth);
    const isAcademicComplete = !!formData.gradeId;
    const isContactComplete = !!(formData.email && formData.phone && (id || formData.password));

    return (
        <div className="min-h-screen w-full bg-[#FAFAFA] dark:bg-slate-950 px-4 py-6 flex flex-col items-center overflow-x-hidden">
            <div className="max-w-5xl w-full flex flex-col gap-6">
                
                {/* Compact Header */}
                <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-slate-800 pb-3">
                    <button 
                        onClick={() => navigate(redirectPath)}
                        className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        type="button"
                    >
                        <ArrowLeft className="h-4 w-4 text-slate-500" />
                    </button>
                    <div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                            {id ? "Edit Student" : "Register New Student"}
                        </h2>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {id ? "Manage and update student information" : "Create a new student record in your organization"}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
                    
                    {/* Main Form Fields Container (Left Column) */}
                    <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
                        
                        <div className="p-6 space-y-8">
                            {/* Section 1: Personal Information */}
                            <div className="space-y-4">
                                <div className="border-b border-slate-100 dark:border-slate-800/65 pb-2">
                                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                        Personal Information
                                    </h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* First Name */}
                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            First Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input 
                                            value={formData.firstName}
                                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                                            placeholder="First name"
                                            className="h-9 text-xs border-slate-200 dark:border-slate-800 rounded-xl"
                                            required
                                        />
                                    </div>
                                    
                                    {/* Last Name */}
                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Last Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input 
                                            value={formData.lastName}
                                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                                            placeholder="Last name"
                                            className="h-9 text-xs border-slate-200 dark:border-slate-800 rounded-xl"
                                            required
                                        />
                                    </div>

                                    {/* Gender */}
                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Gender <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={formData.gender}
                                            onValueChange={(val) => handleInputChange("gender", val)}
                                        >
                                            <SelectTrigger className="w-full h-9 bg-transparent border-slate-200 dark:border-slate-800 rounded-xl px-3 text-xs font-semibold text-slate-750 dark:text-slate-300">
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 shadow-xl">
                                                <SelectItem value="Male" className="text-xs font-semibold">Male</SelectItem>
                                                <SelectItem value="Female" className="text-xs font-semibold">Female</SelectItem>
                                                <SelectItem value="Other" className="text-xs font-semibold">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Date of Birth */}
                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Date of Birth <span className="text-red-500">*</span>
                                        </Label>
                                        <Input 
                                            type="date"
                                            value={formData.dateOfBirth}
                                            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                                            className="h-9 text-xs border-slate-200 dark:border-slate-800 rounded-xl"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Academic Information */}
                            <div className="space-y-4">
                                <div className="border-b border-slate-100 dark:border-slate-800/65 pb-2">
                                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                        Academic Information
                                    </h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Grade */}
                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Grade <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={formData.gradeId}
                                            onValueChange={(val) => handleInputChange("gradeId", val)}
                                        >
                                            <SelectTrigger className="w-full h-9 bg-transparent border-slate-200 dark:border-slate-800 rounded-xl px-3 text-xs font-semibold text-slate-750 dark:text-slate-300">
                                                <SelectValue placeholder="Select grade" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 shadow-xl max-h-56">
                                                {grades.map((g) => (
                                                    <SelectItem key={g.id} value={g.id.toString()} className="text-xs font-semibold">
                                                        {g.name}
                                                    </SelectItem>
                                                ))}
                                                {grades.length === 0 && (
                                                    <SelectItem value="loading" disabled className="text-xs font-semibold">
                                                        Loading grades...
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Student ID */}
                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Student ID <span className="text-slate-400 text-[10px]">(Optional)</span>
                                        </Label>
                                        <Input 
                                            value={formData.studentId}
                                            onChange={(e) => handleInputChange("studentId", e.target.value)}
                                            placeholder="Enter student ID"
                                            className="h-9 text-xs border-slate-200 dark:border-slate-800 rounded-xl"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Contact Information */}
                            <div className="space-y-4">
                                <div className="border-b border-slate-100 dark:border-slate-800/65 pb-2">
                                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                        Contact Information
                                    </h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Email */}
                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Email <span className="text-red-500">*</span>
                                        </Label>
                                        <Input 
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                            placeholder="email@address.com"
                                            className="h-9 text-xs border-slate-200 dark:border-slate-800 rounded-xl"
                                            required
                                        />
                                    </div>

                                    {/* Phone Number */}
                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Phone Number <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="flex rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                                            <select 
                                                value={countryCode} 
                                                onChange={(e) => setCountryCode(e.target.value)}
                                                className="bg-transparent pl-3 pr-2 text-xs font-semibold border-none outline-none cursor-pointer text-slate-700 dark:text-slate-300 h-9"
                                            >
                                                <option value="+91">🇮🇳 +91</option>
                                                <option value="+1">🇺🇸 +1</option>
                                                <option value="+44">🇬🇧 +44</option>
                                                <option value="+971">🇦🇪 +971</option>
                                            </select>
                                            <div className="w-px bg-slate-200 dark:bg-slate-800 self-stretch my-2"></div>
                                            <input 
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                                placeholder="Phone number" 
                                                className="flex-1 bg-transparent px-3 text-xs font-semibold text-slate-800 dark:text-slate-150 placeholder:text-slate-400 outline-none border-none h-9"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password - Only show on creation */}
                                    {!id && (
                                        <div className="space-y-1 md:col-span-2">
                                            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Password <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative">
                                                <Input 
                                                    type={showPassword ? "text" : "password"}
                                                    value={formData.password}
                                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                                    placeholder="Enter login password"
                                                    className="h-9 pr-10 text-xs border-slate-200 dark:border-slate-800 rounded-xl"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Status (Only when editing, using colored chips) */}
                                    {id && (
                                        <div className="space-y-1 md:col-span-2">
                                            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                                Status
                                            </Label>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleInputChange("isActive", true)}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5",
                                                        formData.isActive !== false
                                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm"
                                                            : "bg-transparent text-slate-400 border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                                                    )}
                                                >
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                    Active
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleInputChange("isActive", false)}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5",
                                                        formData.isActive === false
                                                            ? "bg-rose-50 text-rose-700 border-rose-200 shadow-sm"
                                                            : "bg-transparent text-slate-400 border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                                                    )}
                                                >
                                                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                                    Inactive
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sticky Action Footer */}
                        <div className="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200/60 dark:border-slate-800 px-6 py-4 flex items-center justify-end gap-3 z-10">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate(redirectPath)}
                                className="h-9 px-4 rounded-xl border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-9 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 text-white text-xs font-bold shadow-sm flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                    <UserPlus className="h-3.5 w-3.5" />
                                )}
                                {id ? "Save Changes" : "Register Student"}
                            </Button>
                        </div>
                    </div>

                    {/* Student Avatar & Progress Sidebar (Right Column) */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        
                        {/* Student Identity Card */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
                            <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-650 flex items-center justify-center font-black text-white text-2xl shadow-md mb-4">
                                {initials}
                            </div>
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                                {fullName}
                            </h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                Grade {selectedGradeName}
                            </p>
                            
                            <div className="mt-3">
                                {formData.isActive !== false ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                        <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                                        Active Student
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-100">
                                        <span className="h-1 w-1 rounded-full bg-rose-500" />
                                        Inactive Student
                                    </span>
                                )}
                            </div>

                            {/* Dynamic Checklist Progress */}
                            <div className="w-full border-t border-slate-100 dark:border-slate-800 pt-4 mt-5 text-left space-y-3">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                                    Dossier Sections
                                </p>
                                
                                <div className="flex items-center justify-between text-xs">
                                    <span className={cn("font-medium", isPersonalComplete ? "text-slate-800 dark:text-slate-200" : "text-slate-400")}>
                                        Personal Information
                                    </span>
                                    <div className={cn(
                                        "h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-bold border",
                                        isPersonalComplete 
                                            ? "bg-emerald-500 border-emerald-500 text-white" 
                                            : "border-slate-200 text-slate-400"
                                    )}>
                                        {isPersonalComplete ? "✓" : "1"}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-xs">
                                    <span className={cn("font-medium", isAcademicComplete ? "text-slate-800 dark:text-slate-200" : "text-slate-400")}>
                                        Academic Information
                                    </span>
                                    <div className={cn(
                                        "h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-bold border",
                                        isAcademicComplete 
                                            ? "bg-emerald-500 border-emerald-500 text-white" 
                                            : "border-slate-200 text-slate-400"
                                    )}>
                                        {isAcademicComplete ? "✓" : "2"}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-xs">
                                    <span className={cn("font-medium", isContactComplete ? "text-slate-800 dark:text-slate-200" : "text-slate-400")}>
                                        Contact & Credentials
                                    </span>
                                    <div className={cn(
                                        "h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-bold border",
                                        isContactComplete 
                                            ? "bg-emerald-500 border-emerald-500 text-white" 
                                            : "border-slate-200 text-slate-400"
                                    )}>
                                        {isContactComplete ? "✓" : "3"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Context helper notice banner */}
                        <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 rounded-2xl p-4 flex gap-3 items-start">
                            <Info className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                            <p className="text-[11px] font-semibold leading-relaxed text-indigo-600 dark:text-indigo-400">
                                Students will use their email and registered password to sign in to their profile portal interface.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentForm;